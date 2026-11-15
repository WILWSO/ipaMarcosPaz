import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {compile} from 'svelte/compiler';
import {render} from 'svelte/server';
import {createIndex,search,highlightParts,suggestQueries,normalize} from '../src/lib/search.mjs';
const record=(id,textEs,textOriginal='')=>({id,title:id,kind:'articulo',norm:'TEST',article:1,page:1,pages:[1],source:'manual',textEs,textOriginal,links:[],notes:[],status:'texto-base-2025'});
const indexOf=records=>createIndex({records,amendments:[],normativeEffects:[]});
test('typing updates prefix matches and adding a word narrows results without pressing enter',()=>{
 const ix=indexOf([record('one','La membresía en iglesia local.'),record('two','La membresía nacional.'),record('other','La disciplina local.')]);
 assert.deepEqual(new Set(search(ix,'memb',{mode:'words'}).map(r=>r.id)),new Set(['one','two']));
 assert.deepEqual(search(ix,'membresía en iglesia lo',{mode:'words'}).map(r=>r.id),['one']);
 assert.equal(search(ix,'membresía en iglesia lo',{mode:'words',literal:true}).length,0);
 assert.equal(search(ix,'',{mode:'words'}).length,0);
});
test('same phrase ranks before same sentence and words separated inside the same article',()=>{
 const ix=indexOf([record('article','La carta fue expedida. '+('Otra información. '.repeat(100))+'La transferencia llegó.'),record('sentence','La transferencia se documenta mediante una carta.'),record('phrase','Carta de transferencia recibida.')]);
 const hits=search(ix,'carta de transferencia',{mode:'words'});assert.deepEqual(hits.map(r=>r.id),['phrase','sentence','article']);assert.deepEqual(hits.map(r=>r.matchTier),['phrase','sentence','article']);
});
test('all query words must occur in one original or translated source, never just in effects or chapter context',()=>{
 const records=[record('cross','La carta.','A transferencia.'),record('effect','Una norma distinta.'),record('member','Son miembros de la iglesia.')];
 const ix=createIndex({records,amendments:[],normativeEffects:[{source:'effect',targets:[],noteEs:'Carta de transferencia',notePt:'',limitsEs:'',limitsPt:''}]});
 assert.equal(search(ix,'carta transferencia',{mode:'words'}).length,0);assert.equal(search(ix,'membresía',{mode:'words'}).length,0);
});
test('quotation marks require an exact phrase and inline norm article lookup remains available',()=>{
 const ix=indexOf([record('yes','Carta de transferencia.'),record('no','Carta recibida. Transferencia confirmada.')]);assert.deepEqual(search(ix,'"carta de transferencia"',{mode:'words'}).map(r=>r.id),['yes']);
 const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));assert.deepEqual(search(createIndex(c),'CI Art. 84',{mode:'words'}).map(r=>r.id),['CI-art-84']);
});
test('highlights preserve every source character, ignore accents and complete the last typed word',()=>{
 const original='La COMUNIÓN y la membresía; sin control ni transformación.';const parts=highlightParts(original,'comunion membres');
 assert.equal(parts.map(p=>p.text).join(''),original);assert.deepEqual(parts.filter(p=>p.match).map(p=>p.text),['COMUNIÓN','membresía']);
 assert.deepEqual(highlightParts('control y rol','rol').filter(p=>p.match).map(p=>p.text),['rol']);
 assert.equal(highlightParts('membresía','memb',{prefixLast:false}).some(p=>p.match),false);
 const decomposed='comunio\u0301n';assert.equal(highlightParts(decomposed,'comunion').map(p=>p.text).join(''),decomposed);
});
test('rendered highlights are mark elements and source markup stays escaped',async()=>{
 const path=new URL('../src/lib/.highlight-ssr-test.mjs',import.meta.url);
 try{
  const source=readFileSync(new URL('../src/lib/Highlight.svelte',import.meta.url),'utf8');writeFileSync(path,compile(source,{generate:'server',filename:'Highlight.svelte'}).js.code);
  const {default:Highlight}=await import(path.href);const result=render(Highlight,{props:{text:'<script>alert(1)</script> membresía',query:'memb'}});assert.match(result.body,/<mark[^>]*>membresía<\/mark>/);assert.ok(result.body.includes('&lt;script>'));assert.ok(!result.body.includes('<script>'));
 }finally{try{unlinkSync(path);}catch{}}
});
test('autocomplete suggestions come from matching sources and avoid accent-only duplicates',()=>{
 const hits=search(indexOf([record('one','La membresía en iglesia local.'),record('two','La membresia en otra iglesia.')]),'memb',{mode:'words'});
 const suggestions=suggestQueries('memb',hits);assert.ok(suggestions.includes('membresía'));assert.equal(new Set(suggestions.map(normalize)).size,suggestions.length);
 assert.ok(suggestQueries('membresía en',hits).some(q=>normalize(q)==='membresia en iglesia'));assert.deepEqual(suggestQueries('"memb"',hits),[]);
});
test('matching language and excerpt point to the text containing the typed words',()=>{
 const hits=search(indexOf([record('one','Son miembros de la iglesia.','Os membros da igreja local.')]),'membros local',{mode:'words',language:'es'});assert.equal(hits.length,1);assert.equal(hits[0].matchLanguage,'pt');assert.deepEqual(hits[0].matchedLanguages,['pt']);assert.ok(hits[0].matchExcerptPt.includes('membros'));
});
