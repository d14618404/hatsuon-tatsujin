import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {syntheticDemos} from '../src/synthetic-demo.js';
import {stages,lessonReady} from '../src/stages.js';
test('each stage has an audible synthetic WAV and separate unverified timestamps',async t=>{
 for(const stage of stages)await t.test(stage.id,async()=>{
 const demo=syntheticDemos[stage.id];
 assert.ok(demo);
 const wav=await readFile(new URL(demo.audio));
 assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
 let sampleRate, byteRate, data;
 for(let i=12;i+8<=wav.length;){const tag=wav.toString('ascii',i,i+4),size=wav.readUInt32LE(i+4);if(tag==='fmt '){assert.equal(wav.readUInt16LE(i+8),1);sampleRate=wav.readUInt32LE(i+12);byteRate=wav.readUInt32LE(i+16);}if(tag==='data')data=wav.subarray(i+8,i+8+size);i+=8+size+(size%2);}
 assert.equal(sampleRate,22050);assert.ok(data.length>sampleRate*2);assert.ok(data.some(v=>v!==0));
 const duration=data.length/byteRate;
 assert.equal(demo.starts.length,stage.words.length);
 demo.starts.forEach((s,i)=>{assert.ok(s>=0&&s<duration);if(i)assert.ok(s>demo.starts[i-1]);});
 assert.equal(demo.verified,false);assert.equal(demo.timingStatus,'estimated-not-aligned');
 assert.ok(stage.words.every(w=>w.start===null));assert.equal(lessonReady(stage),false);
 const metadata=JSON.parse(await readFile(new URL(`../public/audio/${stage.id}-synthetic.json`,import.meta.url)));
 assert.deepEqual(metadata.words.map(w=>w.start),demo.starts);
 assert.deepEqual(metadata.words.map(w=>w.text),stage.words.map(w=>w.text));
 });
});
