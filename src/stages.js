export const stages = [{
  id:'stage-01', title:'秘密の庭へ', difficulty:'EASY',
  sentence:'The little girl opened the wooden door and discovered a beautiful garden behind the house.',
  phraseEnds:[7,12,15],
  audio:new URL('../public/audio/stage-01.mp3',import.meta.url).href, verified:false,
  words:[['The','The','function'],['little','LITtle','content'],['girl','GIRL','content'],['opened','OPENed','content'],['the','the','function'],['wooden','WOODen','content'],['door','DOOR','content'],['and','and','function'],['discovered','disCOVered','content'],['a','a','function'],['beautiful','BEAUtiful','content'],['garden','GARden','content'],['behind','behind','function'],['the','the','function'],['house','HOUSE','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-02', title:'橋の下の子猫', difficulty:'EASY',
  sentence:'My brother found a small black cat under the old wooden bridge.',
  phraseEnds:[7,12],
  audio:new URL('../public/audio/stage-02.mp3',import.meta.url).href, verified:false,
  words:[['My','My','function'],['brother','BROther','content'],['found','FOUND','content'],['a','a','function'],['small','SMALL','content'],['black','BLACK','content'],['cat','CAT','content'],['under','under','function'],['the','the','function'],['old','OLD','content'],['wooden','WOODen','content'],['bridge','BRIDGE','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-03', title:'来なかった朝の列車', difficulty:'EASY',
  sentence:'We waited for the morning train, but it never came to the station.',
  phraseEnds:[6,13],
  audio:new URL('../public/audio/stage-03.mp3',import.meta.url).href, verified:false,
  words:[['We','We','function'],['waited','WAITed','content'],['for','for','function'],['the','the','function'],['morning','MORNing','content'],['train,','TRAIN','content'],['but','but','function'],['it','it','function'],['never','NEVer','content'],['came','CAME','content'],['to','to','function'],['the','the','function'],['station','STAtion','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-04', title:'川辺の小さな橋', difficulty:'MEDIUM',
  sentence:'After school, my friends and I walked through the quiet park, where we found a small bridge beside the river.',
  phraseEnds:[2,6,11,15,20],
  audio:new URL('../public/audio/stage-04.mp3',import.meta.url).href, verified:false,
  words:[['After','AFter','function'],['school,','SCHOOL','content'],['my','my','function'],['friends','FRIENDS','content'],['and','and','function'],['I','I','function'],['walked','WALKED','content'],['through','through','function'],['the','the','function'],['quiet','QUIet','content'],['park,','PARK','content'],['where','where','function'],['we','we','function'],['found','FOUND','content'],['a','a','function'],['small','SMALL','content'],['bridge','BRIDGE','content'],['beside','beside','function'],['the','the','function'],['river','RIVer','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-05', title:'博物館の古い地図', difficulty:'MEDIUM',
  sentence:'On Saturday morning, our science teacher took us to the city museum, where we carefully studied ancient maps and listened to stories about distant travelers.',
  phraseEnds:[3,7,12,18,25],
  audio:new URL('../public/audio/stage-05.mp3',import.meta.url).href, verified:false,
  words:[['On','On','function'],['Saturday','SATurday','content'],['morning,','MORNing','content'],['our','our','function'],['science','SCIence','content'],['teacher','TEACHer','content'],['took','TOOK','content'],['us','us','function'],['to','to','function'],['the','the','function'],['city','CITy','content'],['museum,','muSEum','content'],['where','where','function'],['we','we','function'],['carefully','CAREfully','content'],['studied','STUDied','content'],['ancient','ANcient','content'],['maps','MAPS','content'],['and','and','function'],['listened','LIStened','content'],['to','to','function'],['stories','STORies','content'],['about','about','function'],['distant','DIStant','content'],['travelers','TRAVelers','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-06', title:'夕暮れの湖', difficulty:'MEDIUM',
  sentence:'Before sunset, our family packed some food and drove to the quiet lake, where we sat beside the water and watched the orange sky slowly fade behind the distant mountains.',
  phraseEnds:[2,7,13,19,24,30],
  audio:new URL('../public/audio/stage-06.mp3',import.meta.url).href, verified:false,
  words:[['Before','before','function'],['sunset,','SUNset','content'],['our','our','function'],['family','FAMily','content'],['packed','PACKED','content'],['some','some','function'],['food','FOOD','content'],['and','and','function'],['drove','DROVE','content'],['to','to','function'],['the','the','function'],['quiet','QUIet','content'],['lake,','LAKE','content'],['where','where','function'],['we','we','function'],['sat','SAT','content'],['beside','beside','function'],['the','the','function'],['water','WAter','content'],['and','and','function'],['watched','WATCHED','content'],['the','the','function'],['orange','ORange','content'],['sky','SKY','content'],['slowly','SLOWly','content'],['fade','FADE','content'],['behind','behind','function'],['the','the','function'],['distant','DIStant','content'],['mountains','MOUNtains','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
},{
  id:'stage-07', title:'ひとりごつ', difficulty:'HIGH',
  sentence:'What is this? It’s morning already. Mumbling to myself. On my toast, spreading butter, I take it slow. Though the rain’s finally stopped, guess it left a few drops, and they just won’t dry. Then I saw little footprints, and I wondered whose they were. Turns out last night I left them there. They were my own. Still today, on the ground, water soaking all around. Guess it still won’t dry. And now it’s freezing cold.',
  phraseEnds:[3,6,9,12,14,18,23,29,34,39,45,49,53,57,62,66,71,76],
  audio:new URL('../public/audio/stage-07.mp3',import.meta.url).href, verified:false,
  words:[['What','WHAT','content'],['is','is','function'],['this?','THIS','content'],['It’s','it’s','function'],['morning','MORNing','content'],['already.','alREADy','content'],['Mumbling','MUMbling','content'],['to','to','function'],['myself.','mySELF','content'],['On','on','function'],['my','my','function'],['toast,','TOAST','content'],['spreading','SPREADing','content'],['butter,','BUTter','content'],['I','I','function'],['take','TAKE','content'],['it','it','function'],['slow.','SLOW','content'],['Though','though','function'],['the','the','function'],['rain’s','RAIN’S','content'],['finally','FInally','content'],['stopped,','STOPPED','content'],['guess','GUESS','content'],['it','it','function'],['left','LEFT','content'],['a','a','function'],['few','FEW','content'],['drops,','DROPS','content'],['and','and','function'],['they','they','function'],['just','JUST','content'],['won’t','won’t','function'],['dry.','DRY','content'],['Then','THEN','content'],['I','I','function'],['saw','SAW','content'],['little','LITtle','content'],['footprints,','FOOTprints','content'],['and','and','function'],['I','I','function'],['wondered','WONdered','content'],['whose','whose','function'],['they','they','function'],['were.','were','function'],['Turns','TURNS','content'],['out','OUT','content'],['last','LAST','content'],['night','NIGHT','content'],['I','I','function'],['left','LEFT','content'],['them','them','function'],['there.','THERE','content'],['They','they','function'],['were','were','function'],['my','my','function'],['own.','OWN','content'],['Still','STILL','content'],['today,','toDAY','content'],['on','on','function'],['the','the','function'],['ground,','GROUND','content'],['water','WAter','content'],['soaking','SOAKing','content'],['all','ALL','content'],['around.','aROUND','content'],['Guess','GUESS','content'],['it','it','function'],['still','STILL','content'],['won’t','won’t','function'],['dry.','DRY','content'],['And','and','function'],['now','NOW','content'],['it’s','it’s','function'],['freezing','FREEZing','content'],['cold','COLD','content']].map(([text,label,kind])=>({text,label,kind,start:null}))
}];
export function lessonReady(stage){return stage.verified===true && stage.words.every((w,i)=>Number.isFinite(w.start)&&w.start>=0&&(i===0||w.start>stage.words[i-1].start));}
