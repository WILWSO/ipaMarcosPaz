import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_15.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('consulta ministerial conserva discrepancia CI88 y participación emérita mantiene exclusión del voto',()=>{
 const e=effect('CXVII');assert.match(e.noteEs,/poderes específicos/);assert.match(e.noteEs,/en el acto/);assert.match(e.noteEs,/independientemente de lectura/);assert.match(e.limitsEs,/l trata evangelización y c/);assert.match(effect('CXVI').noteEs,/únicamente votar/);assert.match(effect('CXVI').limitsEs,/No restablece mandato/);
 for(const id of ['CI-art-57','CI-art-88']){const r=by.get(id);if(id==='CI-art-57')assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
 assert.match(by.get('CI-art-88').integratedTextEs,/l\) establecer y mantener trabajos de evangelización/);
 assert.match(by.get('CI-art-88').textOriginal,/l\) estabelecer e manter trabalhos de evangelização/);
});
test('decisión tecnológica revocada conserva antecedente sin extender revocación al estudio estadístico',()=>{
 const r=by.get('CE-2026-CXIX');assert.equal(r.status,'revocada-2026');assert.deepEqual(r.revokedBy,['SC-2026-CIX']);assert.match(effect('CXIX').limitsEs,/no se presenta como encargo vigente autónomo/);assert.ok(effect('CXIX').targets.includes('SC-2026-CIX'));assert.match(effect('CXVIII').limitsEs,/no CE-CXVIII/);assert.notEqual(by.get('CE-2026-CXVIII').status,'revocada-2026');assert.match(effect('CXVIII').limitsEs,/no contrata\/desarrolla automáticamente/);assert.match(effect('CXX').limitsEs,/No formaliza asociación/);assert.match(effect('CXXVI').limitsEs,/Angola/);
});
test('aprobación hospitalaria y recepción de informes distinguen formalización y cuentas, con fuentes íntegras',()=>{
 assert.match(effect('CXXXIII').noteEs,/sucesión de activos, pasivos/);assert.match(effect('CXXXIII').limitsEs,/no acredita incorporación formal concluida/);assert.match(effect('CXXIX').limitsEs,/no equivalen a aprobación expresa de cuentas/);assert.match(effect('CXXVII').limitsEs,/no se cambia por aprobar cuentas/);assert.match(effect('CXXI').noteEs,/seis meses/);assert.match(effect('CXXI').limitsEs,/se refiere a supervisión local/);assert.match(effect('CXXX').limitsEs,/no fija fecha inicial/);assert.match(effect('CXIV').limitsEs,/No responde consulta/);
 assert.equal(batch.ids.length,20);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_15_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/290\/398/);assert.match(t,/108/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
