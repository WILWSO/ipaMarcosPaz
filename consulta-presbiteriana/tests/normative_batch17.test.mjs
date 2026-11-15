import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_17.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('creación de sínodos conserva comisiones, siglas condicionadas y discrepancia entre documentos',()=>{
 const entries=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));assert.equal(entries.filter(e=>e.kind==='synod-creation-and-commission').length,4);assert.match(effect('XCI').limitsEs,/PMAS es sugerencia condicionada/);assert.match(effect('LXXXIX').limitsEs,/no a sus iglesias o ministros/);assert.match(effect('LXXXVIII').limitsEs,/Inciso V repetido/);assert.match(effect('LXXXVI').limitsEs,/PRCV\/PRER/);assert.match(effect('LXXXVI').limitsEs,/PBCV\/PBER/);assert.ok(effect('LXXXVI').targets.includes('CE-2026-XCVIII'));assert.match(effect('LXXXV').limitsEs,/que permanece en SPE/);
 for(const id of ['CI-art-94','CI-art-97']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
});
test('estatutos y contrato específicos conservan quórums, condiciones e instrumentos sin reformar modelos',()=>{
 const e=effect('LXXXIII');assert.match(e.limitsEs,/2\/3 de asociados/);assert.match(e.limitsEs,/2\/3 del Consejo/);assert.match(e.limitsEs,/no está transcrito/);assert.match(e.limitsEs,/32/);assert.match(effect('LXXXII').limitsEs,/no autoriza alquiler irrestricto/);assert.match(effect('LXXXII').noteEs,/exclusivamente/);assert.match(effect('LXXXI').limitsEs,/sin dividirlo/);assert.match(effect('LXXXI').noteEs,/antes de registro/);assert.match(effect('LXXX').limitsEs,/no eliminan notas históricas/);assert.match(effect('LXXIX').limitsEs,/ni demuestra inscripción civil/);assert.match(effect('LXXVIII').limitsEs,/Minutas íntegras no reproducidas/);
 assert.ok([e,effect('LXXXII'),effect('LXXXI')].every(e=>!e.patchApplied&&e.externalTargets.length));
});
test('aprobación contable conserva exceso y falta de autorización previa; IBAA no decide mérito',()=>{
 assert.match(effect('LXXIV').noteEs,/44,59%/);assert.match(effect('LXXIV').noteEs,/no fue analizado\/aprobado previamente/);assert.match(effect('LXXIV').limitsEs,/no borra observación/);assert.match(effect('LXXIV').limitsEs,/tolerancia nacional automática/);assert.match(effect('LXXXIV').limitsEs,/No aprueba o rechaza cuentas por su mérito/);assert.match(effect('LXXVII').limitsEs,/no crea presupuesto nuevo/);
 assert.equal(batch.ids.length,20);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_17_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/330\/398/);assert.match(t,/68/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
