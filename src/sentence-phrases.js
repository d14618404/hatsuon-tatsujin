export function makePhraseRanges(wordCount,phraseEnds=[]){
  const ends=[...new Set(phraseEnds)]
    .filter(end=>Number.isInteger(end)&&end>0&&end<=wordCount)
    .sort((a,b)=>a-b);
  if(ends.at(-1)!==wordCount)ends.push(wordCount);
  let start=0;
  return ends.map(end=>{const range={start,end};start=end;return range;}).filter(({start,end})=>end>start);
}

export function phraseIndexForWord(ranges,wordIndex){
  if(!ranges.length)return -1;
  const index=Math.max(0,wordIndex);
  const found=ranges.findIndex(({start,end})=>index>=start&&index<end);
  return found<0?ranges.length-1:found;
}

export function wordIndexAt(words,time){
  if(time<0)return -1;
  let index=-1;
  for(let i=0;i<words.length&&words[i].start<=time;i++)index=i;
  return index;
}
