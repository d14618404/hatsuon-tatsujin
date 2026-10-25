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
}
VOICE = 'Samantha'
RATE = 170
BOUNDARY_PASSES = 3


def synth(text, target):
    subprocess.run(['say', '-v', VOICE, '-r', str(RATE), '-o', str(target),
                    '--data-format=LEI16@22050', text], check=True)


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
            'say', '-v', VOICE, '-r', str(RATE), '--interactive=red',
            ' '.join(words) + '.',
        ], check=True, stdout=subprocess.DEVNULL)
        data = session.read_bytes()

    records = []
    cursor = 0
    while cursor + 24 <= len(data):
        length, seconds, micros, kind = struct.unpack_from('<QQI4s', data, cursor)
        cursor += 24
        payload = data[cursor:cursor + length]
        cursor += length
        if kind.rstrip(b'\0') == b'o':
            records.append((seconds + micros / 1_000_000, payload))

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
    return [timestamp - events[0] for timestamp in events]


def speech_boundary_offsets(words):
    """Use median speech-engine callback offsets to reduce synthesis jitter."""
    passes = [capture_boundary_offsets(words) for _ in range(BOUNDARY_PASSES)]
    return [statistics.median(offsets) for offsets in zip(*passes)]


def generate(stage_id, words):
    out = ROOT / f'public/audio/{stage_id}-synthetic.wav'
    synth(' '.join(words) + '.', out)
    first, _, duration = bounds(out)
    offsets = speech_boundary_offsets(words)
    starts = [round(first + offset, 4) for offset in offsets]
    method = f'Median of {BOUNDARY_PASSES} macOS speech-engine word-boundary passes, anchored to the first voiced WAV sample.'
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
