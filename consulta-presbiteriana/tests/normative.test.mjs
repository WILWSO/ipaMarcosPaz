import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {reading,makeAnswer,effectsFor,createIndex,search} from '../src/lib/search.mjs';
const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const by=new Map(c.records.map(r=>[r.id,r]));
const hash=s=>createHash('sha256').update(s).digest('hex');
test('Actas art. 3 sustituye sólo el encabezamiento aprobado y preserva todos los párrafos de 2025',()=>{
 const r=by.get('ATAS-art-3');const effect=c.normativeEffects.find(e=>e.source==='CE-2026-CII');
 for(const [lang,key,patch] of [['pt','textOriginal','patchTextPt'],['es','textEs','patchTextEs']]){
  const integrated=reading(r,lang,true).text;assert.equal(integrated.split('\n')[0],effect[patch]);assert.equal(integrated.split('\n').slice(1).join('\n'),r[key].split('\n').slice(1).join('\n'));assert.equal(reading(r,lang,false).text,r[key]);
  assert.equal((integrated.match(/^§ [123]º/gm)||[]).length,3);
 }
 assert.match(r.integratedTextEs,/primera hoja, que no será numerada/);assert.match(r.integratedTextEs,/última hoja, que tampoco será numerada/);assert.match(effect.limitsEs,/modelos todavía dicen/);assert.match(effect.limitsEs,/conservando los §§ 1–3/);
 assert.equal(by.get('ATAS-art-20').integratedTextEs,undefined);assert.equal(hash(r.textEs),r.translationReview.translationHash);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);
 assert.match(makeAnswer('Art. 3',[r],c,{language:'es',integrated:true}),/CE-2026-CII/);
});
test('lote 02 registra nombramientos, archivo y políticas específicas sin convertirlos en artículos generales',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/integracion_lote_02.json',import.meta.url)));assert.equal(batch.ids.length,20);assert.equal(new Set(batch.ids).size,20);assert.ok(!batch.ids.includes('SC-2026-CCXXXIX'));
 const effects=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));assert.equal(effects.filter(e=>e.kind==='appointment').length,16);assert.equal(effects.filter(e=>e.patchApplied).length,1);
 for(const e of effects.filter(e=>e.kind==='appointment')){const r=by.get(e.source);assert.equal(r.integratedTextEs,undefined);assert.ok(!e.targets.some(id=>by.get(id).source==='manual'));}
 assert.equal(effects.find(e=>e.source==='SC-2026-CCXXVII').kind,'administrative-archive');assert.match(effects.find(e=>e.source==='SC-2026-CCXXVI').noteEs,/21\/01\/2027 al 20\/01\/2031/);assert.match(effects.find(e=>e.source==='SC-2026-CCXL').limitsEs,/no libera fondos/);
 for(const lang of ['es','pt']){const doc=readFileSync(new URL('../documentos/integracion_normativa_lote_02_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...doc.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(doc,/30\/398/);assert.match(doc,/368/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);
});
test('revocación elimina únicamente el inciso X principal y conserva el X del párrafo único en ambos idiomas',()=>{
 const r=by.get('RI-CE-art-8');
 for(const lang of ['pt','es']){
  const original=lang==='pt'?r.textOriginal:r.textEs;const integrated=reading(r,lang,true).text;
  const separator=lang==='pt'?'Parágrafo único.':'Párrafo único.';
  assert.equal(integrated.split(separator)[1],original.split(separator)[1]);
  assert.doesNotMatch(integrated.split(separator)[0],/^X - /m);assert.match(integrated.split(separator)[1],/^X - /m);
  assert.equal(integrated,original.replace(/^X - [^\n]*\n/m,''));assert.equal(reading(r,lang,false).text,original);
 }
 assert.deepEqual(r.integrationSources,['SC-2026-CXXIII']);
 assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);
});
test('procedimientos e interpretaciones no sustituyen las normas, y la decisión revocada conserva su original',()=>{
 for(const id of ['CI-art-23','CI-art-33','CI-art-34','CI-art-141','CI-art-10','EST-IG-art-22','ATAS-art-10','ATAS-art-8']){
  const r=by.get(id);assert.equal(r.integratedTextPt,undefined,id);assert.equal(r.integratedTextEs,undefined,id);assert.equal(hash(r.textEs),r.translationReview.translationHash,id);assert.equal(reading(r,'es',true).text,r.textEs,id);
 }
 assert.match(by.get('CI-art-23').textEs,/durante un año/);assert.match(by.get('CI-art-23').textEs,/dos años después/);
 const revoked=by.get('CE-2026-CXIX');assert.equal(revoked.status,'revocada-2026');assert.deepEqual(revoked.revokedBy,['SC-2026-CIX']);assert.equal(hash(revoked.textOriginal),revoked.translationReview.sourceHash);assert.equal(hash(revoked.textEs),revoked.translationReview.translationHash);
 assert.ok(!by.get('ATAS-art-13').links.includes('SC-2026-CLXXXI'));assert.ok(by.get('ATAS-art-10').links.includes('SC-2026-CLXXXI'));
});
test('inventario normativo separa trescientos noventa y ocho exámenes de las 398 traducciones y acredita cada fuente',()=>{
 const matrix=JSON.parse(readFileSync(new URL('../documentos/matriz_integracion_2026.json',import.meta.url)));
 assert.equal(matrix.decisions.length,398);assert.equal(new Set(matrix.decisions.map(x=>x.source)).size,398);
 assert.equal(matrix.decisions.filter(x=>x.status==='cotejado-efectos').length,398);assert.equal(matrix.decisions.filter(x=>x.status==='pendiente-examen-efectos').length,0);
 assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.reviewComplete,true);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
 assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.metadata.spanishManualApprovedAsDefinitiveSource,false);
 for(const e of c.normativeEffects){const r=by.get(e.source);assert.equal(hash(r.textOriginal),e.sourceHash);assert.equal(hash(r.textEs),e.translationHash);assert.ok(r.textOriginal.includes(e.evidencePt));assert.equal(e.sourcePDFSHA256,c.metadata.sources.digesto.sha256);assert.ok(e.targets.every(id=>by.has(id)));}
 assert.ok(c.normativeEffects.find(e=>e.source==='SC-2026-CXXIII').externalTargets.some(t=>t.reference.includes('RI-SE')));
});
test('consulta y documentos muestran efectos en el idioma elegido y conservan la procedencia de la revocación',()=>{
 const r=by.get('RI-CE-art-8');const es=makeAnswer('Art. 8',[r],c,{language:'es',integrated:true});const pt=makeAnswer('Artigo 8',[r],c,{language:'pt',integrated:true});
 assert.match(es,/Revoca únicamente el inciso X/);assert.match(pt,/Revoga somente o inciso X/);assert.doesNotMatch(pt,/Revoca únicamente/);
 assert.match(makeAnswer('Art. 8',[r],c),/Efecto documentado 2026/);
 assert.ok(effectsFor(by.get('CE-2026-CXIX'),c).some(e=>e.source==='SC-2026-CIX'));
 assert.ok(search(createIndex(c),'revocada',{norm:'CE'}).some(x=>x.id==='CE-2026-CXIX'));
 for(const lang of ['es','pt']){const doc=readFileSync(new URL('../documentos/manual_integrado_'+lang+'.md',import.meta.url),'utf8');assert.match(doc,/SC-2026-CIX/);assert.match(doc,/CE-2026-CXIX/);assert.match(doc,/398/);}
});
