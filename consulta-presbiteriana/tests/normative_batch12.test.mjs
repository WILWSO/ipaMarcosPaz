import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_12.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='SC-2026-'+id),sha=s=>createHash('sha256').update(s).digest('hex');
test('correcciones estadísticas y envíos distinguen cifras expresas, plazo y documentación ausente',()=>{
 assert.match(effect('XXXII').noteEs,/TOTAL estadístico a \+183/);assert.match(effect('XXXI').noteEs,/TOTAL estadístico \+43/);assert.match(effect('XXXI').noteEs,/reenvío del informe/);assert.match(effect('XXXII').limitsEs,/no prueba inexistencia en original/);
 assert.match(effect('XXVIII').noteEs,/30 días/);assert.match(effect('XXVII').noteEs,/XVI a SE-SC en 30 días/);assert.match(effect('XXVII').limitsEs,/no se añade envío obligatorio XVIII/);assert.match(effect('XXVIII').limitsEs,/después de firma/);assert.match(by.get('SC-2026-XXXII').textOriginal,/\?35/);assert.match(by.get('SC-2026-XXXI').textOriginal,/\?39/);
});
test('Tropical, comunicaciones y contradicciones no se convierten en aprobación o armonización',()=>{
 assert.equal(effect('XXV').kind,'corrections-pending-examination');assert.match(effect('XXV').limitsEs,/No contiene aprobación/);assert.equal(by.get('SC-2026-XXV').status,'procedimiento-pendiente');assert.match(effect('XXII').limitsEs,/deposição y dispositivo despojamento/);assert.match(effect('XXII').limitsEs,/no es condena independiente/);assert.match(effect('XXIV').limitsEs,/4 frente a 44 candidatos/);assert.match(effect('XXIII').limitsEs,/numeración continua correcta contradice/);assert.match(effect('XV').limitsEs,/diverge de preparatoria única/);assert.match(effect('XVI').limitsEs,/No atribuye silenciosamente datos/);assert.match(effect('XIX').limitsEs,/tres ministros\/dos presbíteros/);
 for(const id of ['CI-art-99','ATAS-art-5','ATAS-art-10','RI-SIN-art-10']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('lote 12 conserva veinte textos y el avance normativo separado de sustituciones y traducción',()=>{
 assert.equal(batch.ids.length,20);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_12_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/230\/398/);assert.match(t,/168/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
