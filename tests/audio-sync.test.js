import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioClock,COUNTDOWN_SECONDS,DrumSound,PREROLL} from '../src/audio-sync.js';
class FakeAudio {currentTime=0;paused=true;load(){}pause(){this.paused=true;}async play(){this.paused=false;}}
globalThis.Audio=FakeAudio;
test('all rates have a three-second countdown and resume does not reset',async()=>{for(const rate of [.25,.5,.75,1]){const clock=new AudioClock();await clock.prepare({},[{start:.35,kind:'content'},{start:1,kind:'function'}],true);assert.equal(clock.time,-PREROLL);await clock.play(rate);assert.equal(clock.audio.playbackRate,rate);assert.equal(clock.audio.preservesPitch,true);assert.ok(Math.abs(-clock.time/rate-COUNTDOWN_SECONDS)<1e-8);clock.audio.currentTime=PREROLL+.35;assert.ok(Math.abs(clock.time-.35)<1e-8);clock.pause();assert.equal(clock.audio.paused,true);await clock.play(rate,true);assert.ok(Math.abs(clock.time-.35)<1e-8);clock.stop();assert.equal(clock.time,-PREROLL);URL.revokeObjectURL(clock.url);}});
test('demo has audible guide at word start and silent preroll',async()=>{const clock=new AudioClock();await clock.prepare({},[{start:.35,kind:'content'}],true);const data=new DataView(await (await fetch(clock.url)).arrayBuffer());const sr=data.getUint32(24,true);for(let i=0;i<PREROLL*sr;i++)assert.equal(data.getInt16(44+i*2,true),0);const at=Math.round((PREROLL+.35)*sr);assert.notEqual(data.getInt16(44+(at+1)*2,true),0);URL.revokeObjectURL(clock.url);});
test('missing real audio fails explicitly',async()=>{const original=globalThis.fetch;globalThis.fetch=async()=>({ok:false});try{const clock=new AudioClock();await assert.rejects(clock.prepare({audio:'/audio/stage-01.mp3'},[{start:0}],false),/英文音声を読み込めません/);}finally{globalThis.fetch=original;}});
test('drum hits resume audio and keep the don audible on small speakers',async()=>{
 const started=[],frequencies=[];
 const param={setValueAtTime(value){frequencies.push(value);},exponentialRampToValueAtTime(){}};
 const node=()=>({connect(){return this;},start(){started.push(true);},stop(){},frequency:param,gain:param,Q:param});
 class FakeContext{state='suspended';currentTime=1;sampleRate=48000;destination={};async resume(){this.state='running';}createOscillator(){return node();}createGain(){return node();}createBuffer(){return {getChannelData:()=>new Float32Array(32)};}createBufferSource(){return node();}createBiquadFilter(){return {...node(),frequency:param,Q:param};}}
 const original=globalThis.AudioContext;globalThis.AudioContext=FakeContext;
 try{const drum=new DrumSound();await drum.hit('content');assert.equal(drum.context.state,'running');assert.equal(started.length,3);assert.ok(frequencies.includes(430));}
 finally{globalThis.AudioContext=original;}
});
