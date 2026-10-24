export const stages = [{
  id:'stage-01', title:'秘密の庭へ', difficulty:'EASY',
  sentence:'The little girl opened the wooden door and discovered a beautiful garden behind the house.',
  audio:new URL('../public/audio/stage-01.mp3',import.meta.url).href, verified:false,
  words:[['The','The','function'],['little','LITtle','content'],['girl','GIRL','content'],['opened','OPENed','content'],['the','the','function'],['wooden','WOODen','content'],['door','DOOR','content'],['and','and','function'],['discovered','disCOVered','content'],['a','a','function'],['beautiful','BEAUtiful','content'],['garden','GARden','content'],['behind','behind','function'],['the','the','function'],['house','HOUSE','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
}];
export function lessonReady(stage){return stage.verified===true && stage.words.every((w,i)=>Number.isFinite(w.start)&&w.start>=0&&(i===0||w.start>stage.words[i-1].start));}
