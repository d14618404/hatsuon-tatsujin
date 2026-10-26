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
 assert.equal(demo.verified,false);assert.equal(demo.timingStatus,'engine-word-boundary-aligned');
 assert.ok(stage.words.every(w=>w.start===null));assert.equal(lessonReady(stage),false);
 const metadata=JSON.parse(await readFile(new URL(`../public/audio/${stage.id}-synthetic.json`,import.meta.url)));
 assert.deepEqual(metadata.words.map(w=>w.start),demo.starts);
 assert.deepEqual(metadata.words.map(w=>w.text),stage.words.map(w=>w.text));
 assert.match(metadata.method,/speech-engine word-boundary passes/);
 });
});
test('stage 03 keeps the spoken pause before but',()=>{
 const starts=syntheticDemos['stage-03'].starts;
 assert.ok(starts[6]-starts[5]>.4);
});
test('stage difficulty advances from short EASY stages to a 20-word MEDIUM stage',()=>{
 const stage3=stages.find(stage=>stage.id==='stage-03');
 const stage4=stages.find(stage=>stage.id==='stage-04');
 assert.equal(stage3.difficulty,'EASY');
 assert.equal(stage4.difficulty,'MEDIUM');
 assert.equal(stage4.words.length,20);
});
test('stage 05 is a 25-word MEDIUM stage',()=>{
 const stage5=stages.find(stage=>stage.id==='stage-05');
 assert.equal(stage5.difficulty,'MEDIUM');
 assert.equal(stage5.words.length,25);
});
test('stage 06 is a 30-word MEDIUM stage',()=>{
 const stage6=stages.find(stage=>stage.id==='stage-06');
 assert.equal(stage6.difficulty,'MEDIUM');
 assert.equal(stage6.words.length,30);
});
test('stage 07 is a 76-word HIGH stage with corrected punctuation',()=>{
 const stage7=stages.find(stage=>stage.id==='stage-07');
 assert.equal(stage7.title,'ひとりごつ');
 assert.equal(stage7.difficulty,'HIGH');
 assert.equal(stage7.words.length,76);
 assert.match(stage7.sentence,/whose they were\./);
 assert.doesNotMatch(stage7.sentence,/who’s they were/);
});
test('stage 07 resets alignment per sentence and does not place cold at audio completion',async()=>{
 const demo=syntheticDemos['stage-07'];
 const metadata=JSON.parse(await readFile(new URL('../public/audio/stage-07-synthetic.json',import.meta.url)));
 assert.match(metadata.method,/passes per sentence/);
 assert.ok(metadata.duration-demo.starts.at(-1)>.3);
});
test('stage 07 aligns few drops and they just wont dry to measured waveform starts',()=>{
 const starts=syntheticDemos['stage-07'].starts;
 assert.deepEqual(starts.slice(27,34),[9.29,9.51,10.25,10.3973,10.56,10.8,11.08]);
 assert.ok(starts[29]-starts[28]>.5);
});
