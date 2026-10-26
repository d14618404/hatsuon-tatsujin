"""macOS offline TTS demos aligned to speech-engine word callbacks."""
from pathlib import Path
import argparse
import array
import json
import re
import statistics
import struct
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parent.parent
STAGES = {
    'stage-01': 'The little girl opened the wooden door and discovered a beautiful garden behind the house'.split(),
    'stage-02': 'My brother found a small black cat under the old wooden bridge'.split(),
    'stage-03': 'We waited for the morning train, but it never came to the station'.split(),
    'stage-04': 'After school, my friends and I walked through the quiet park, where we found a small bridge beside the river'.split(),
    'stage-05': 'On Saturday morning, our science teacher took us to the city museum, where we carefully studied ancient maps and listened to stories about distant travelers'.split(),
    'stage-06': 'Before sunset, our family packed some food and drove to the quiet lake, where we sat beside the water and watched the orange sky slowly fade behind the distant mountains'.split(),
    'stage-07': 'What is this? It’s morning already. Mumbling to myself. On my toast, spreading butter, I take it slow. Though the rain’s finally stopped, guess it left a few drops, and they just won’t dry. Then I saw little footprints, and I wondered whose they were. Turns out last night I left them there. They were my own. Still today, on the ground, water soaking all around. Guess it still won’t dry. And now it’s freezing cold'.split(),
}
CHUNK_ENDS = {
    'stage-07': [3, 6, 9, 18, 34, 45, 53, 57, 66, 71, 76],
}
WAVEFORM_MEASURED_STARTS = {
    'stage-07': {27: 9.29, 28: 9.51, 29: 10.25, 31: 10.56, 32: 10.8, 33: 11.08},
}
VOICE = 'Samantha'
RATE = 170
BOUNDARY_PASSES = 3


def synth(text, target):
    subprocess.run(['say', '-v', VOICE, '-r', str(RATE), '-o', str(target),
                    '--data-format=LEI16@22050', text], check=True)


def spoken_text(words):
    text = ' '.join(words)
    return text if text.endswith(('.', '?', '!')) else text + '.'


def voiced_spans(path, minimum_gap=.12):
    with wave.open(str(path)) as audio:
        sr = audio.getframerate()
        samples = array.array('h', audio.readframes(audio.getnframes()))
    active = [i for i, value in enumerate(samples) if abs(value) > 180]
    if not active:
        raise RuntimeError('TTS output is empty or silent. Run with access to macOS speech services.')
    spans = []
    start = previous = active[0]
    for index in active[1:]:
        if index - previous > minimum_gap * sr:
            spans.append((start / sr, (previous + 1) / sr))
            start = index
        previous = index
    spans.append((start / sr, (previous + 1) / sr))
    return spans, len(samples) / sr


def bounds(path):
    spans, duration = voiced_spans(path)
    return spans[0][0], spans[-1][1], duration


def capture_boundary_offsets(words):
    with tempfile.TemporaryDirectory(prefix='rhythm-boundaries-') as folder:
        session = Path(folder) / 'session'
        subprocess.run([
            'script', '-q', '-r', '-t', '0', str(session),
            '/bin/zsh', '-c', 'stty cols 1000; exec say "$@"', 'say',
            '-v', VOICE, '-r', str(RATE), '--interactive=red', spoken_text(words),
        ], check=True, stdout=subprocess.DEVNULL)
        data = session.read_bytes()

    records = []
    finished = None
    cursor = 0
    while cursor + 24 <= len(data):
        length, seconds, micros, kind = struct.unpack_from('<QQI4s', data, cursor)
        cursor += 24
        payload = data[cursor:cursor + length]
        cursor += length
        timestamp = seconds + micros / 1_000_000
        record_kind = kind.rstrip(b'\0')
        if record_kind == b'o':
            records.append((timestamp, payload))
        elif record_kind == b'e':
            finished = timestamp

    clusters = []
    for timestamp, payload in records:
        if clusters and timestamp - clusters[-1][1] < .01:
            clusters[-1][1] = timestamp
            clusters[-1][2] += payload
        else:
            clusters.append([timestamp, timestamp, payload])
    events = [cluster[0] for cluster in clusters
              if b'\r' in cluster[2] and re.search(rb'[A-Za-z]', cluster[2])]
    if len(events) < len(words):
        raise RuntimeError(f'Expected {len(words)} word boundaries, received {len(events)}.')
    events = events[:len(words)]
    if finished is None or finished <= events[0]:
        raise RuntimeError('Speech completion timestamp was not recorded.')
    return [timestamp - events[0] for timestamp in events], finished - events[0]


def speech_boundary_offsets(words, voiced_duration):
    """Normalize live callbacks to the rendered WAV, then reduce synthesis jitter."""
    passes = [capture_boundary_offsets(words) for _ in range(BOUNDARY_PASSES)]
    normalized = [[offset * voiced_duration / live_duration for offset in offsets]
                  for offsets, live_duration in passes]
    return [statistics.median(offsets) for offsets in zip(*normalized)]


def generate(stage_id, words):
    out = ROOT / f'public/audio/{stage_id}-synthetic.wav'
    chunk_ends = CHUNK_ENDS.get(stage_id)
    if chunk_ends:
        starts = []
        chunks = []
        cursor = 0
        with tempfile.TemporaryDirectory(prefix='rhythm-chunks-') as folder:
            for number, end in enumerate(chunk_ends):
                chunk_words = words[cursor:end]
                chunk_path = Path(folder) / f'{number}.wav'
                synth(spoken_text(chunk_words), chunk_path)
                first, last, chunk_duration = bounds(chunk_path)
                offsets = speech_boundary_offsets(chunk_words, last - first)
                with wave.open(str(chunk_path)) as audio:
                    params = audio.getparams()
                    chunks.append(audio.readframes(audio.getnframes()))
                elapsed = sum(len(chunk) for chunk in chunks[:-1]) / params.sampwidth / params.nchannels / params.framerate
                starts.extend(round(elapsed + first + offset, 4) for offset in offsets)
                cursor = end
        with wave.open(str(out), 'wb') as audio:
            audio.setparams(params)
            audio.writeframes(b''.join(chunks))
        duration = sum(len(chunk) for chunk in chunks) / params.sampwidth / params.nchannels / params.framerate
        method = f'Median of {BOUNDARY_PASSES} macOS speech-engine word-boundary passes per sentence, normalized to each rendered WAV chunk.'
    else:
        synth(spoken_text(words), out)
        first, last, duration = bounds(out)
        offsets = speech_boundary_offsets(words, last - first)
        starts = [round(first + offset, 4) for offset in offsets]
        method = f'Median of {BOUNDARY_PASSES} macOS speech-engine word-boundary passes, normalized to the voiced WAV duration.'
    for index, measured_start in WAVEFORM_MEASURED_STARTS.get(stage_id, {}).items():
        starts[index] = measured_start
    if stage_id in WAVEFORM_MEASURED_STARTS:
        method += ' Ambiguous punctuation boundaries were checked against the rendered waveform.'
    metadata = {
        'stageId': stage_id, 'voice': VOICE, 'locale': 'en-US', 'wordsPerMinute': RATE,
        'audioFile': f'{stage_id}-synthetic.wav', 'duration': duration,
        'timingStatus': 'engine-word-boundary-aligned', 'verified': False,
        'method': method,
        'words': [{'text': word, 'start': start} for word, start in zip(words, starts)],
    }
    (ROOT / f'public/audio/{stage_id}-synthetic.json').write_text(
        json.dumps(metadata, indent=2) + '\n')
    return metadata


def write_module():
    entries = []
    for stage_id in STAGES:
        metadata_path = ROOT / f'public/audio/{stage_id}-synthetic.json'
        if not metadata_path.exists():
            continue
        metadata = json.loads(metadata_path.read_text())
        starts = [word['start'] for word in metadata['words']]
        entries.append(
            f'  "{stage_id}": {{\n'
            f'    audio: new URL("../public/audio/{stage_id}-synthetic.wav", import.meta.url).href,\n'
            f'    verified: false, timingStatus: {json.dumps(metadata["timingStatus"])},\n'
            f'    starts: {json.dumps(starts)}\n'
            '  }'
        )
    (ROOT / 'src/synthetic-demo.js').write_text(
        '// Generated by scripts/generate-synthetic-audio.py; aligned to speech-engine word callbacks.\n'
        'export const syntheticDemos = {\n' + ',\n'.join(entries) + '\n};\n')


parser = argparse.ArgumentParser()
parser.add_argument('--stage', choices=STAGES, action='append', help='Generate only this stage; repeatable')
args = parser.parse_args()
selected = args.stage or list(STAGES)
results = {stage_id: generate(stage_id, STAGES[stage_id]) for stage_id in selected}
write_module()
print(json.dumps({stage_id: {'duration': data['duration'],
                            'alignedStarts': [word['start'] for word in data['words']]}
                  for stage_id, data in results.items()}))
