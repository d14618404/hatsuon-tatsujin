import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.mp3':'audio/mpeg','.wav':'audio/wav'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let file=decodeURIComponent(url.pathname); if(file==='/')file='/index.html';if(file.startsWith('/assets/')||file.startsWith('/audio/'))file='/public'+file;const target=path.resolve(root,'.'+file);if(!target.startsWith(root+path.sep))throw Error();const data=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(5173,'0.0.0.0',()=>console.log('Local: http://localhost:5173'));
