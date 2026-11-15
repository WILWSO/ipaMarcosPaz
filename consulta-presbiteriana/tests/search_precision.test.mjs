import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createIndex,search,related} from '../src/lib/search.mjs';
const corpus=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const index=createIndex(corpus);
const query='membresía en iglesia local';
const fixture=(id,textEs,textOriginal='')=>({id,title:id,kind:'nota',norm:'TEST',source:'manual',page:1,pages:[1],textEs,textOriginal,links:[],notes:[],status:'texto-base-2025'});
const tiny=records=>createIndex({records,amendments:[],normativeEffects:[]});
test('local membership phrase prioritizes definitions and keeps the full constitutional membership section',()=>{
 const rows=search(index,query);const ids=new Set(rows.map(r=>r.id));
 for(const n of [11,12,13,14,16,18,19,20,21,22,23,24])assert.ok(ids.has(`CI-art-${n}`),`Missing constitutional membership provision ${n}`);
 assert.deepEqual(new Set(rows.slice(0,2).map(r=>r.id)),new Set(['CI-art-11','EST-IG-art-5']));
 for(const id of ['CI-art-88','CI-art-97','RI-CE-art-8','ATAS-art-6','SC-2026-L'])assert.ok(!ids.has(id),`Unrelated administrative/statistical result ${id}`);
 assert.ok(ids.has('SC-2026-CLII'));assert.ok(related(rows.find(r=>r.id==='CI-art-23'),corpus).some(r=>r.id==='CI-nota-82'));
});
test('specific Spanish and Portuguese queries retrieve the same documentary sources',()=>{
 assert.deepEqual(search(index,query).map(r=>r.id),search(index,'membros da igreja local').map(r=>r.id));
 assert.deepEqual(search(index,query).map(r=>r.id),search(index,'¿Cómo es la membresía en una iglesia local?').map(r=>r.id));
 assert.ok(search(index,'admisión de miembros').some(r=>r.id==='CI-art-16'));
 assert.ok(search(index,'bautismo de niños').some(r=>r.id==='PL-art-11'));
});
test('precise search requires concepts near each other in one source passage',()=>{
 const rows=tiny([fixture('near','La membresía en la iglesia local se registra por el Consejo.'),fixture('distant','La membresía. '+'Texto separado sin relación. '.repeat(90)+'La iglesia local.'),fixture('cross-language','La membresía.','A igreja local.')]);
 assert.deepEqual(search(rows,query).map(r=>r.id),['near']);
 assert.ok(search(rows,query,{mode:'expanded'}).some(r=>r.id==='distant'));
});
test('editorial effects do not create a direct match absent from source text',()=>{
 const records=[fixture('unrelated','Normas de mantenimiento del edificio.')];
 const rows=createIndex({records,amendments:[],normativeEffects:[{source:'unrelated',targets:[],noteEs:'La membresía en iglesia local.',notePt:'',limitsEs:'',limitsPt:''}]});
 assert.equal(search(rows,query).length,0);assert.equal(search(rows,query,{mode:'expanded'}).length,1);
});
test('source excerpts show the matching passage rather than the unrelated opening',()=>{
 const text='Información introductoria sin relación. '.repeat(80)+'CI/IPB: La membresía en iglesia local se registra en el libro de miembros.';
 const rows=search(tiny([fixture('excerpt',text)]),query);assert.equal(rows.length,1);
 assert.ok(rows[0].matchExcerptEs.includes('membresía en iglesia local'));assert.ok(rows[0].matchExcerptEs.length<text.length/2);
 assert.ok(text.includes(rows[0].matchExcerptEs.replace(/^… /,'')));
});
test('quoted phrases keep word boundaries and all quoted requirements',()=>{
 const rows=tiny([fixture('yes','Membresía en iglesia local. Plena comunión.'),fixture('no','Membresía en iglesia local. Sin la otra frase.'),fixture('substring','El rol fue anotado; el control sigue vigente.')]);
 assert.deepEqual(search(rows,'"membresía en iglesia local" "plena comunión"').map(r=>r.id),['yes']);
 assert.equal(search(tiny([fixture('word','control administrativo')]),'"rol"').length,0);
});
test('expanded search and explicit page filtering retain complementary material without an arbitrary result cap',()=>{
 const page={...fixture('page','Membresía en iglesia local.'),kind:'pagina'};const rows=tiny([page,...Array.from({length:65},(_,i)=>fixture('note-'+i,'Membresía en iglesia local.'))]);
 assert.equal(search(rows,query).length,65);assert.ok(search(rows,query,{mode:'expanded'}).some(r=>r.id==='page'));
 assert.deepEqual(search(rows,query,{kind:'pagina'}).map(r=>r.id),['page']);
});
