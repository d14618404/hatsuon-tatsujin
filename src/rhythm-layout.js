export function noteX(targetX,wordStart,currentTime,pxPerSecond){
  return targetX+(wordStart-currentTime)*pxPerSecond;
}
