import test from 'node:test';
import assert from 'node:assert/strict';
import {noteX} from '../src/rhythm-layout.js';

test('a note reaches the actual target center at its word timestamp',()=>{
  for(const targetX of [80,100,160]){
    assert.equal(noteX(targetX,2.5,2.5,550),targetX);
  }
});

test('note travel is symmetric around the word timestamp',()=>{
  const targetX=100, speed=550;
  assert.equal(noteX(targetX,2.5,2,speed),375);
  assert.equal(noteX(targetX,2.5,3,speed),-175);
});
