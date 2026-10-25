export const PREROLL=3;
export const COUNTDOWN_SECONDS=3;
function wav(channels,sampleRate){const length=channels[0].length, count=channels.length;const data=new ArrayBuffer(44+length*count*2),v=new DataView(data);const str=(p,s)=>[...s].forEach((c,i)=>v.setUint8(p+i,c.charCodeAt(0)));str(0,'RIFF');v.setUint32(4,data.byteLength-8,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,count,true);v.setUint32(24,sampleRate,true);v.setUint32(28,sampleRate*count*2,true);v.setUint16(32,count*2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,length*count*2,true);for(let i=0;i<length;i++)for(let c=0;c<count;c++)v.setInt16(44+(i*count+c)*2,Math.max(-1,Math.min(1,channels[c][i]))*32767,true);return new Blob([data],{type:'audio/wav'});}
export class AudioClock{
 constructor(){this.audio=new Audio();this.audio.preload='auto';this.audio.preservesPitch=true;this.url=null;}
 async prepare(stage,words,demo){this.stop();let channels,sr;if(demo){sr=22050;channels=[new Float32Array(Math.ceil((PREROLL+words.at(-1).start+1)*sr))];for(const w of words){const at=Math.round((PREROLL+w.start)*sr);for(let i=0;i<sr*.055;i++)channels[0][at+i]=.1*Math.sin(i/sr*2*Math.PI*(w.kind==='content'?440:660))*Math.exp(-i/(sr*.012));}}else{const response=await fetch(stage.audio);if(!response.ok)throw Error('英文音声を読み込めません。'+stage.audio);const context=new AudioContext();try{const decoded=await context.decodeAudioData(await response.arrayBuffer());sr=decoded.sampleRate;if(words.at(-1).start>=decoded.duration)throw Error('タイムスタンプが音声の長さを超えています。');channels=Array.from({length:decoded.numberOfChannels},(_,c)=>{const a=new Float32Array(Math.ceil((PREROLL+decoded.duration+.4)*sr));a.set(decoded.getChannelData(c),Math.round(PREROLL*sr));return a;});}finally{await context.close();}}
 if(this.url)URL.revokeObjectURL(this.url);this.url=URL.createObjectURL(wav(channels,sr));this.audio.src=this.url;this.audio.load();
 }
 get time(){return this.audio.currentTime-PREROLL;}
 async play(rate,resume=false){this.audio.playbackRate=rate;if(!resume)this.audio.currentTime=Math.max(0,PREROLL-COUNTDOWN_SECONDS*rate);await this.audio.play();}
 pause(){this.audio.pause();}
 stop(){this.audio.pause();this.audio.currentTime=0;}
}
export class DrumSound{
 async unlock(){this.context??=new AudioContext();if(this.context.state==='suspended')await this.context.resume();}
 tone(type,from,to,gain,duration,at){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(from,at);o.frequency.exponentialRampToValueAtTime(to,at+duration);g.gain.setValueAtTime(gain,at);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g).connect(c.destination);o.start(at);o.stop(at+duration+.01);}
 noise(gain,duration,frequency,at){const c=this.context,count=Math.ceil(c.sampleRate*duration),buffer=c.createBuffer(1,count,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<count;i++)data[i]=Math.random()*2-1;const source=c.createBufferSource(),filter=c.createBiquadFilter(),level=c.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.setValueAtTime(frequency,at);filter.Q.setValueAtTime(.7,at);level.gain.setValueAtTime(gain,at);level.gain.exponentialRampToValueAtTime(.001,at+duration);source.connect(filter).connect(level).connect(c.destination);source.start(at);source.stop(at+duration+.01);}
 async hit(kind){try{await this.unlock();if(this.context.state!=='running')return;const at=this.context.currentTime;if(kind==='content'){this.tone('sine',210,82,.26,.2,at);this.tone('triangle',430,170,.1,.12,at);this.noise(.055,.035,900,at);}else{this.tone('triangle',1550,720,.16,.09,at);this.noise(.13,.055,2300,at);}}catch{}}
}
