import {demoTimelines} from '../src/demo-timelines.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {grade,deltaMs,nearest,expired} from '../src/judgement.js';
import {stages,lessonReady} from '../src/stages.js';
for(const rate of [.25,.5,.75,1])test(`symmetric real-time judgement at ${rate}x`,()=>{for(const sign of [-1,1]){for(const [ms,result] of [[0,'PERFECT'],[100,'PERFECT'],[101,'GOOD'],[200,'GOOD'],[201,'MISS']])assert.equal(grade(deltaMs(3,3+sign*ms/1000*rate,rate)),result);}assert.equal(grade(0,false),'MISS');assert.equal(expired({start:3},3+.201*rate,rate),true);assert.equal(expired({start:3},3+.199*rate,rate),false);});
test('nearest note is consumed only once; close notes selected by distance',()=>{const words=[{start:1},{start:1.1}];assert.equal(nearest(words,1.08,1),1);words[1].result='PERFECT';assert.equal(nearest(words,1.08,1),0);words[0].result='MISS';assert.equal(nearest(words,1.08,1),-1);});
test('missing measured timings cannot enable real lesson',()=>{assert.equal(stages[0].words.length,15);assert.equal(lessonReady(stages[0]),false);assert.ok(stages[0].words.every(w=>w.start===null));assert.equal(demoTimelines['stage-01'].length,15);assert.equal(lessonReady({...stages[0],verified:true}),false);});
