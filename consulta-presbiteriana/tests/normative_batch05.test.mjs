import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeAnswer,effectsFor} from '../src/lib/search.mjs';
const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const by=new Map(c.records.map(r=>[r.id,r]));
const batch=JSON.parse(readFileSync(new URL('../documentos/integracion_lote_05.json',import.meta.url)));
const effects=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));
const sha=s=>createHash('sha256').update(s).digest('hex');
test('lote 05 documenta veinte acuerdos sin añadir sustituciones de artículos',()=>{
 assert.equal(batch.ids.length,20);assert.equal(new Set(batch.ids).size,20);assert.equal(effects.filter(e=>e.kind.startsWith('report')).length,11);assert.equal(effects.filter(e=>e.kind==='academic-cooperation-approved').length,2);assert.equal(effects.filter(e=>e.kind==='seminary-extension-approved').length,2);assert.ok(effects.every(e=>!e.patchApplied));
 for(const lang of ['es','pt']){const text=readFileSync(new URL('../documentos/integracion_normativa_lote_05_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...text.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(text,/90\/398/);assert.match(text,/308/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);
});
test('cooperaciones y extensiones conservan instrumentos, financiación y supervisión sin presumir ejecución',()=>{
 const phd=effects.find(e=>e.source==='SC-2026-CLXVI');assert.match(phd.limitsEs,/No acredita firma/);assert.match(phd.noteEs,/contrapartida de servicio docente/);
 const thm=effects.find(e=>e.source==='SC-2026-CLXV');assert.match(thm.limitsEs,/Dos becas anuales del 90%/);assert.match(thm.limitsEs,/10% y viajes/);assert.match(thm.limitsEs,/no es una beca universal/);
 const sl=effects.find(e=>e.source==='SC-2026-CLIX');assert.match(sl.noteEs,/STNE/);assert.match(sl.noteEs,/costeo íntegro/);assert.match(sl.noteEs,/cuatro años/);assert.match(sl.limitsEs,/No es un seminario autónomo/);
 const es=effects.find(e=>e.source==='SC-2026-CLVIII');assert.match(es.noteEs,/sínodos proponentes/);assert.match(es.noteEs,/sin aporte central/);assert.match(es.limitsEs,/no constituye por sí solo una clausura automática/);
 const article=by.get('CI-art-97');assert.equal(article.integratedTextEs,undefined);assert.equal(sha(article.textEs),article.translationReview.translationHash);assert.match(makeAnswer('Educación teológica',[article],c,{language:'es'}),/SC-2026-CLXVI/);assert.match(makeAnswer('Educação teológica',[article],c,{language:'pt'}),/SC-2026-CLVIII/);
});
test('Credo, traducción oral y consultas denominacionales distinguen conservación, estudio y recepción específica',()=>{
 const credo=effects.find(e=>e.source==='SC-2026-CLXIV');assert.equal(credo.kind,'rejected-proposal');assert.match(credo.limitsEs,/No se modifica el Credo/);const oral=effects.find(e=>e.source==='SC-2026-CLXIII');assert.equal(oral.kind,'study-commission');assert.match(oral.noteEs,/CE 2027/);assert.match(oral.limitsEs,/No adopta todavía un posicionamiento final/);
 const iasd=effects.find(e=>e.source==='SC-2026-CLXI');assert.equal(iasd.kind,'denominational-reception');assert.match(iasd.noteEs,/acuerdo suministrado/);assert.match(iasd.limitsEs,/no se presenta como revocación/);assert.equal(effects.find(e=>e.source==='SC-2026-CLX').kind,'study-commission');assert.match(effects.find(e=>e.source==='SC-2026-CLX').limitsEs,/No constituye una clasificación definitiva nueva de IECLB/);
 const eca=effects.find(e=>e.source==='SC-2026-CLXII');assert.equal(eca.kind,'reaffirmation');assert.ok(eca.targets.includes('SC-2026-CXLIII'));assert.match(eca.limitsEs,/no crea por sí sola una obligación civil uniforme/);
 for(const id of ['CI-art-1','CI-art-16','CI-nota-62','PL-art-12']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
 assert.ok(effectsFor(by.get('CI-art-16'),c).some(e=>e.source==='SC-2026-CLXI'));assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);assert.equal(c.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
