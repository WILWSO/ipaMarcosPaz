import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat, realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../build');
const portArg=process.argv.indexOf('--port');
const port=portArg<0?4173:Number(process.argv[portArg+1]);
if(!Number.isInteger(port)||port<0||port>65535)throw Error('Puerto inválido / Porta inválida');
try{await stat(path.join(root,'index.html'));}catch{console.error('Falta build/index.html. Ejecutá npm run build o usá el paquete listo para usar.');process.exit(1);}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.pdf':'application/pdf','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2'};
const rootReal=await realpath(root);
const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.includes('\0')||pathname.includes('\\')){res.writeHead(400).end();return;}
  let target=path.resolve(root,'.'+pathname);
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  let info=await stat(target);if(info.isDirectory()){target=path.join(target,'index.html');info=await stat(target);}
  const actual=await realpath(target);if(!actual.startsWith(rootReal+path.sep)||!info.isFile()){res.writeHead(403).end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD'){res.end();return;}
  const stream=createReadStream(target);stream.on('error',()=>res.destroy());stream.pipe(res);
 }catch(error){res.writeHead(error.code==='ENOENT'||error.code==='ENOTDIR'?404:400).end();}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'El puerto está ocupado. Cerrá la otra ventana del sistema o usá --port 4174.':error.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>{
 const url=`http://127.0.0.1:${server.address().port}/`;console.log(`Consulta Presbiteriana: ${url}`);console.log('Dejá esta ventana abierta. Para cerrar: Ctrl+C.');
 if(process.argv.includes('--open')){
  const command=process.platform==='win32'?['cmd',['/c','start','',url]]:process.platform==='darwin'?['open',[url]]:['xdg-open',[url]];
  const opener=spawn(command[0],command[1],{stdio:'ignore'});opener.on('error',()=>console.log('Abrí la dirección en tu navegador.'));opener.unref();
 }
});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
