// Check the delivered compiled application through its real local HTTP server.
import {spawn} from 'node:child_process';
import {readFile,stat} from 'node:fs/promises';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createIndex,search,reading,makeAnswer,highlightParts,suggestQueries} from '../src/lib/search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const child=spawn(process.execPath,['scripts/serve_local.mjs','--port','0'],{cwd:root,stdio:['ignore','pipe','pipe']});
let output='';let errors='';child.stderr.on('data',b=>errors+=b);
try{
 const base=await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Server startup timed out: '+errors)),10000);
  child.stdout.on('data',b=>{output+=b;const m=output.match(/http:\/\/127\.0\.0\.1:\d+\//);if(m){clearTimeout(timer);resolve(m[0]);}});
  child.on('exit',code=>{clearTimeout(timer);reject(Error(`Server exited ${code}: ${errors}`));});
 });
 const htmlResponse=await fetch(base);assert.equal(htmlResponse.status,200);const html=await htmlResponse.text();assert.ok(html.includes('Consulta Presbiteriana'));assert.ok(html.includes('Todas las palabras'));assert.ok(html.includes('Los resultados aparecen mientras'));
 const assets=[...html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)].map(m=>m[1]);assert.ok(assets.length>0);
 for(const asset of assets){const r=await fetch(new URL(asset,base),{method:'HEAD'});assert.equal(r.status,200,asset);assert.match(r.headers.get('content-type'),/javascript|css/);}
 const response=await fetch(base+'corpus.json');assert.equal(response.status,200);const c=await response.json();assert.equal(c.records.length,2172);assert.equal(c.normativeEffects.length,398);assert.equal(c.documentaryConfirmations.length,7);assert.equal(c.metadata.documentaryConfirmationProgress.openSelectedGroups,5);assert.equal(c.metadata.documentaryConfirmationProgress.resolvedSelectedGroups,2);
 const source=await readFile(root+'src/routes/+page.svelte','utf8');const docBlock=source.match(/const documentNames=\[([^\]]+)\]/)[1];const docs=[...docBlock.matchAll(/'([^']+)'/g)].map(m=>m[1]+'.md');
 for(const name of docs){const r=await fetch(base+'documentos/'+name,{method:'HEAD'});assert.equal(r.status,200,name);assert.match(r.headers.get('content-type'),/markdown/);assert.ok(Number(r.headers.get('content-length'))>0,name);}
 const pdfs=[...new Set(c.records.map(r=>r.pdfUrl.split('#')[0]))];for(const pdf of pdfs){const r=await fetch(base+pdf);assert.equal(r.status,200,pdf);assert.equal(r.headers.get('content-type'),'application/pdf');const bytes=Buffer.from(await r.arrayBuffer());assert.equal(bytes.subarray(0,5).toString(),'%PDF-');}
 const index=createIndex(c);const queries=['membresía','membros','actas','atas','disciplina','diáconos','Art. 84','Artigo 84'];
 for(const query of queries){const hits=search(index,query,/84/.test(query)?{norm:'CI'}:{});assert.ok(hits.length>0,query);for(const lang of ['es','pt']){const answer=makeAnswer(query,hits,c,{language:lang,integrated:true});assert.ok(answer.length>100);}}
 const specific=search(index,'membresía en iglesia local');assert.ok(specific.some(r=>r.id==='CI-art-21'));assert.ok(!specific.some(r=>r.id==='CI-art-88'));assert.ok(specific.slice(0,2).some(r=>r.id==='CI-art-11'));
 const live=search(index,'carta de transf',{mode:'words'});assert.ok(live.some(r=>r.id==='CI-art-16'));assert.ok(suggestQueries('carta de transf',live).includes('carta de transferencia'));assert.ok(highlightParts('COMUNIÓN','comunion').some(p=>p.match));
 const article=c.records.find(r=>r.id==='CI-art-84');assert.notEqual(reading(article,'es',true).text,reading(article,'es',false).text);
 assert.equal((await fetch(base+'no-existe.md')).status,404);assert.equal((await fetch(base,{method:'POST'})).status,405);assert.equal((await fetch(base+'%2e%2e%2fpackage.json')).status,403);
 const corpusBytes=(await stat(root+'build/corpus.json')).size;
 console.log(JSON.stringify({status:'passed',html:true,initialAssets:assets.length,documentDownloads:docs.length,pdfDownloads:pdfs.length,bilingualQueries:queries.length,records:c.records.length,normativeEffects:c.normativeEffects.length,integratedReading:true,documentaryIssuesReviewed:7,documentaryIssuesClosed:2,documentaryIssuesRemaining:5,missingFile404:true,method405:true,traversalBlocked:true,corpusBytes,liveWordSearch:true,sourceAutocomplete:true,accentInsensitiveHighlights:true,browserVisualCheck:'pending'},null,2));
}finally{child.kill('SIGTERM');await once(child,'exit');}
