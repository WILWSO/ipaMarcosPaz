import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_16.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('sustento disciplinar preserva facultad aprobada y no convierte solicitud indemnizatoria en condena',()=>{
 const e=effect('CIV');assert.match(e.noteEs,/puede buscar proveer sustento/);assert.match(e.noteEs,/valores\/tiempo/);assert.match(e.noteEs,/plazo razonable/);assert.match(e.limitsEs,/hasta un año/);assert.match(e.limitsEs,/No declara revocación íntegra/);assert.match(effect('CXIII').noteEs,/continúe el compromiso/);assert.match(effect('CXIII').limitsEs,/no adjudica expresamente monto/);
 for(const id of ['CD-art-9','CI-art-35','CI-art-71']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
});
test('carta conciliar, comisiones SAF y libros distintos mantienen límites sin reformar textos generales',()=>{
 assert.match(effect('CXII').noteEs,/distinta de carta ordinaria/);assert.match(effect('CXII').limitsEs,/no sustituye CI125/);assert.match(effect('CXI').noteEs,/es facultativo/);assert.match(effect('CXI').limitsEs,/I\/II\/III\/VI\/V/);assert.match(effect('CVIII').noteEs,/cada uno debe tener su propio libro/);assert.match(effect('CIX').limitsEs,/sin eliminar excepción/);assert.match(effect('CX').limitsEs,/Remisión no impone/);assert.ok(effect('CX').targets.includes('SC-2026-CLII'));assert.match(effect('CVI').limitsEs,/No cambia elegibilidad/);assert.match(effect('CVII').limitsEs,/CE no aprueba listado de himnos/);
 const r=by.get('CI-art-125');assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);
});
test('registro SE conserva siglas condicionadas, PCEM y variantes documentales, sin asignaciones inventadas',()=>{
 const entries=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id)).filter(e=>e.kind==='presbytery-registry-update');assert.equal(entries.length,10);assert.ok(entries.every(e=>!e.patchApplied));assert.match(effect('CI').noteEs,/PRSG sugerida si es posible/);assert.match(effect('XCIX').limitsEs,/No consigna sigla sugerida/);assert.match(effect('XCIII').noteEs,/conservando PCEM/);assert.match(effect('XCVI').noteEs,/33\.172\.422\/0001-01/);assert.match(effect('XCII').limitsEs,/no unifica silenciosamente/);assert.match(effect('XCIV').limitsEs,/variantes del documento/);
 assert.equal(batch.ids.length,20);assert.ok(!batch.ids.includes('CE-2026-CIII'));assert.ok(!batch.ids.includes('CE-2026-CII'));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_16_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/310\/398/);assert.match(t,/88/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
