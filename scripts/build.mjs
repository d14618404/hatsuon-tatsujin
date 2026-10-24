import {mkdir,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','src'])await cp(file,`dist/${file}`,{recursive:true});
await cp('public','dist/public',{recursive:true});
console.log('Static build ready: dist/');
