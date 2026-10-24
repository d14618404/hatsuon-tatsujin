export const RULES=Object.freeze({perfectMs:100,goodMs:200,offsetMs:0,perfectScore:1000,goodScore:500,feedbackMs:650});
export function grade(deltaMs,correct=true){const d=Math.abs(deltaMs);return !correct||d>RULES.goodMs+1e-7?'MISS':d<=RULES.perfectMs+1e-7?'PERFECT':'GOOD';}
export function deltaMs(start,now,rate){return (now-start)/rate*1000-RULES.offsetMs;}
export function nearest(words,now,rate){let best=-1,dist=Infinity;words.forEach((w,i)=>{const d=Math.abs(deltaMs(w.start,now,rate));if(!w.result&&d<=RULES.goodMs+1e-7&&d<dist){best=i;dist=d;}});return best;}
export function expired(word,now,rate){return !word.result&&deltaMs(word.start,now,rate)>RULES.goodMs+1e-7;}
