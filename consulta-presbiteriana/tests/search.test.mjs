import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createIndex,search,related,makeAnswer} from '../src/lib/search.mjs';
const corpus=JSON.parse(fs.readFileSync(new URL('../static/corpus.json',import.meta.url)));
const index=createIndex(corpus);
test('membresía recupera artículos sobre recepción y salida junto con sus notas',()=>{
 const r=search(index,'membresía',{norm:'CI'});const ids=new Set(r.map(x=>x.id));
 for(const n of [11,12,13,14,16,18,19,20,21,22,23,24])assert.ok(ids.has(`CI-art-${n}`),`Falta CI art. ${n}`);
 const art=r.find(x=>x.id==='CI-art-23');const ids2=related(art,corpus).map(x=>x.id);
 assert.ok(ids2.includes('CI-nota-82'));assert.ok(ids2.includes('SC-2026-CCVI'));
});
test('consulta de artículo desambigua por normativa y enlaza reforma',()=>{
 const r=search(index,'Art. 84',{norm:'CI'});assert.equal(r.length,1);assert.equal(r[0].id,'CI-art-84');
 assert.equal(r[0].status,'modificado-2026');assert.ok(related(r[0],corpus).some(x=>x.id==='SC-2026-CCI'));
 const md=makeAnswer('Art. 84',r,corpus);assert.match(md,/até|anualmente/);assert.match(md,/hasta cinco años/);
});
test('las propuestas pendientes no se convierten en enmiendas',()=>{
 assert.equal(corpus.records.find(x=>x.id==='SC-2026-CCXXXIX').status,'procedimiento-pendiente');
 assert.equal(corpus.records.find(x=>x.id==='SC-2026-CCVI').status,'procedimiento-pendiente');
 assert.equal(corpus.amendments.length,6);assert.ok(!corpus.amendments.some(a=>a.article===23));
});
test('todas las notas referenciadas tienen registro y fuente',()=>{
 const ids=new Set(corpus.records.map(x=>x.id));for(const r of corpus.records)for(const n of r.notes)assert.ok(ids.has(n),n);
});
test('la cobertura traducida está completa y cada fuente conserva identidad',()=>{
 assert.equal(corpus.metadata.translationComplete,true);assert.equal(corpus.metadata.manualPages,560);assert.equal(corpus.metadata.digestoPages,355);
 for(const source of Object.values(corpus.metadata.sources))assert.match(source.sha256,/^[0-9a-f]{64}$/);
});
test('búsqueda de frases y filtros no devuelve palabras ajenas',()=>{
 const r=search(index,'"paradeiro ignorado"',{norm:'CI'});assert.ok(r.some(x=>x.id==='CI-art-23'));
 const none=search(index,'zzzzinexistente');assert.equal(none.length,0);
});

test('los dos artículos 44 del Estatuto se recuperan sin inventar un art. 45',()=>{
 const result=search(index,'Art. 44',{norm:'EST-IPB'});assert.deepEqual(new Set(result.map(r=>r.id)),new Set(['EST-IPB-art-44','EST-IPB-art-44-2']));
 assert.equal(search(index,'Art. 45',{norm:'EST-IPB'}).length,0);
});
