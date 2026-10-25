import test from 'node:test';
import assert from 'node:assert/strict';
import {stages} from '../src/stages.js';
import {makePhraseRanges,phraseIndexForWord} from '../src/sentence-phrases.js';

test('stage phrase ranges cover every word once in short readable groups',()=>{
  for(const stage of stages){
    const ranges=makePhraseRanges(stage.words.length,stage.phraseEnds);
    assert.equal(ranges[0].start,0,stage.id);
    assert.equal(ranges.at(-1).end,stage.words.length,stage.id);
    ranges.forEach((range,index)=>{
      if(index)assert.equal(range.start,ranges[index-1].end,stage.id);
      assert.ok(range.end-range.start<=7,`${stage.id} phrase ${index+1} is too long`);
    });
  }
});

test('the active phrase changes at its first word',()=>{
  const ranges=makePhraseRanges(8,[3,6,8]);
  assert.equal(phraseIndexForWord(ranges,-1),0);
  assert.equal(phraseIndexForWord(ranges,2),0);
  assert.equal(phraseIndexForWord(ranges,3),1);
  assert.equal(phraseIndexForWord(ranges,6),2);
});
