export const stages = [{
  id:'stage-01', title:'秘密の庭へ', difficulty:'EASY',
  sentence:'The little girl opened the wooden door and discovered a beautiful garden behind the house.',
  audio:new URL('../public/audio/stage-01.mp3',import.meta.url).href, verified:false,
  words:[['The','The','function'],['little','LITtle','content'],['girl','GIRL','content'],['opened','OPENed','content'],['the','the','function'],['wooden','WOODen','content'],['door','DOOR','content'],['and','and','function'],['discovered','disCOVered','content'],['a','a','function'],['beautiful','BEAUtiful','content'],['garden','GARden','content'],['behind','behind','function'],['the','the','function'],['house','HOUSE','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-02', title:'橋の下の子猫', difficulty:'EASY',
  sentence:'My brother found a small black cat under the old wooden bridge.',
  audio:new URL('../public/audio/stage-02.mp3',import.meta.url).href, verified:false,
  words:[['My','My','function'],['brother','BROther','content'],['found','FOUND','content'],['a','a','function'],['small','SMALL','content'],['black','BLACK','content'],['cat','CAT','content'],['under','under','function'],['the','the','function'],['old','OLD','content'],['wooden','WOODen','content'],['bridge','BRIDGE','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
}];
export function lessonReady(stage){return stage.verified===true && stage.words.every((w,i)=>Number.isFinite(w.start)&&w.start>=0&&(i===0||w.start>stage.words[i-1].start));}
