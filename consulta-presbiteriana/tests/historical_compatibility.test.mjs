import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeAnswer,makeBilingualAnswer} from '../src/lib/search.mjs';
const read=name=>readFileSync(new URL('../documentos/'+name,import.meta.url),'utf8');
const corpus=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const by=new Map(corpus.records.map(r=>[r.id,r]));const data=JSON.parse(read('compatibilidad_notas_historicas_2026.json'));
const hash=s=>createHash('sha256').update(s).digest('hex');
test('compatibility inventory covers all direct notes and verifies unchanged documentary texts',()=>{
 assert.equal(data.changedArticles.length,8);assert.equal(data.directNoteIds.length,25);
 const actual=data.changedArticles.flatMap(id=>by.get(id).notes);assert.deepEqual(new Set(actual),new Set(data.directNoteIds));
 for(const item of data.items){const r=by.get(item.id);assert.equal(hash(r.textOriginal),item.originalHash);assert.equal(hash(r.textEs),item.translationHash);assert.equal(r.historicalCompatibilityReview.externalCertification,false);if(item.kind==='article'){assert.equal(hash(r.integratedTextPt),item.integratedHashPt);assert.equal(hash(r.integratedTextEs),item.integratedHashEs);}}
 assert.equal(corpus.metadata.historicalCompatibilityProgress.globalCompatibilityReviewComplete,false);
});
test('mixed historical notes retain full contents and warn only within the documented change',()=>{
 assert.match(by.get('CI-nota-139').historicalCompatibilityReview.findingEs,/tampoco inferir firma o presidencia automática/);
 assert.match(by.get('CI-nota-140').historicalCompatibilityReview.findingEs,/no se declaran revocadas/);
 assert.match(by.get('CI-nota-163').historicalCompatibilityReview.findingEs,/EC5 no sustituye el §2/);
 assert.match(by.get('CI-nota-180').historicalCompatibilityReview.findingEs,/no sustituye los 90 días/);
 assert.match(by.get('CI-nota-247').historicalCompatibilityReview.findingEs,/§4/);
 assert.equal(by.get('EST-IG-art-28').integratedTextPt,undefined);
 for(const lang of ['es','pt']){const text=read(`compatibilidad_notas_historicas_2026_${lang}.md`);assert.equal((text.match(/<a id="/g)||[]).length,35);for(const id of data.directNoteIds)assert.ok(text.includes(by.get(id)[lang==='es'?'textEs':'textOriginal']));}
});
test('compatibility findings are visible in exports, integrated documents, UI and bilingual catalog',()=>{
 const r=by.get('CI-nota-247');assert.match(makeAnswer('tesorero',[r],corpus),/Compatibilidad histórica/);
 for(const language of ['es','pt'])assert.ok(makeBilingualAnswer('tesorero',[r],corpus,{language}).includes(r.historicalCompatibilityReview[language==='es'?'findingEs':'findingPt']));
 for(const language of ['es','pt'])assert.ok(read(`manual_integrado_${language}.md`).includes(r.historicalCompatibilityReview[language==='es'?'findingEs':'findingPt']));
 const catalog=JSON.parse(read('estado_bilingue.json'));assert.ok(catalog.bilingualMarkdownDocuments.some(p=>p.es==='compatibilidad_notas_historicas_2026_es.md'));
 const ui=readFileSync(new URL('../src/routes/+page.svelte',import.meta.url),'utf8');assert.ok(ui.includes('selected.historicalCompatibilityReview.findingEs'));assert.ok(ui.includes('compatibilidad_notas_historicas_2026_pt'));
});
