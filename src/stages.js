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
},{
  id:'stage-03', title:'来なかった朝の列車', difficulty:'EASY',
  sentence:'We waited for the morning train, but it never came to the station.',
  audio:new URL('../public/audio/stage-03.mp3',import.meta.url).href, verified:false,
  words:[['We','We','function'],['waited','WAITed','content'],['for','for','function'],['the','the','function'],['morning','MORNing','content'],['train,','TRAIN','content'],['but','but','function'],['it','it','function'],['never','NEVer','content'],['came','CAME','content'],['to','to','function'],['the','the','function'],['station','STAtion','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-04', title:'川辺の小さな橋', difficulty:'MEDIUM',
  sentence:'After school, my friends and I walked through the quiet park, where we found a small bridge beside the river.',
  audio:new URL('../public/audio/stage-04.mp3',import.meta.url).href, verified:false,
  words:[['After','AFter','function'],['school,','SCHOOL','content'],['my','my','function'],['friends','FRIENDS','content'],['and','and','function'],['I','I','function'],['walked','WALKED','content'],['through','through','function'],['the','the','function'],['quiet','QUIet','content'],['park,','PARK','content'],['where','where','function'],['we','we','function'],['found','FOUND','content'],['a','a','function'],['small','SMALL','content'],['bridge','BRIDGE','content'],['beside','beside','function'],['the','the','function'],['river','RIVer','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-05', title:'博物館の古い地図', difficulty:'MEDIUM',
  sentence:'On Saturday morning, our science teacher took us to the city museum, where we carefully studied ancient maps and listened to stories about distant travelers.',
  audio:new URL('../public/audio/stage-05.mp3',import.meta.url).href, verified:false,
  words:[['On','On','function'],['Saturday','SATurday','content'],['morning,','MORNing','content'],['our','our','function'],['science','SCIence','content'],['teacher','TEACHer','content'],['took','TOOK','content'],['us','us','function'],['to','to','function'],['the','the','function'],['city','CITy','content'],['museum,','muSEum','content'],['where','where','function'],['we','we','function'],['carefully','CAREfully','content'],['studied','STUDied','content'],['ancient','ANcient','content'],['maps','MAPS','content'],['and','and','function'],['listened','LIStened','content'],['to','to','function'],['stories','STORies','content'],['about','about','function'],['distant','DIStant','content'],['travelers','TRAVelers','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
}];
export function lessonReady(stage){return stage.verified===true && stage.words.every((w,i)=>Number.isFinite(w.start)&&w.start>=0&&(i===0||w.start>stage.words[i-1].start));}
