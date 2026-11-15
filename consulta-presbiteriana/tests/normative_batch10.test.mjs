import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_10.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='SC-2026-'+id),sha=s=>createHash('sha256').update(s).digest('hex');
test('aprobación de actos distingue libro a rehacer, ratificación y Tribunal pendiente',()=>{
 assert.equal(effect('LXXI').kind,'minutes-rewrite-required');assert.match(effect('LXXI').noteEs,/rehacer las actas/);assert.match(effect('LXXI').noteEs,/CE 2027/);assert.match(effect('LXXI').limitsEs,/Aprobar actos no equivale/);
 assert.match(effect('LXVII').noteEs,/Mesa anterior permanece hasta posesión/);assert.match(effect('LXVII').noteEs,/ratificar actos/);assert.match(effect('LXVII').limitsEs,/siete titulares y siete suplentes/);assert.match(effect('LXVII').limitsEs,/cuatro ministros y tres presbíteros/);assert.match(effect('LXIX').limitsEs,/no nombramiento del Tribunal/);
 for(const id of ['CI-art-67','CD-art-24','CD-art-25','CI-art-145']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('tesorería, estatutos y formato conservan alternativas y límites de la fuente',()=>{
 assert.match(effect('LX').noteEs,/60 días o justificar/);assert.match(effect('LX').noteEs,/bloqueo unilateral/);assert.match(effect('LIX').limitsEs,/la permite si software carece de justificación/);assert.match(effect('LIX').limitsEs,/sin dictamen sobre exigibilidad vigente/);assert.match(effect('LVIII').limitsEs,/tensión con otras decisiones/);assert.match(effect('LV').noteEs,/aprobar estatutos en próxima ordinaria/);assert.match(effect('LV').limitsEs,/No declara aprobado por plenario/);
 assert.match(effect('LXI').noteEs,/22\.480,05 debe ser R\$ 19\.480,05/);assert.match(by.get('SC-2026-LXI').textOriginal,/R\$22\.480,05/);assert.match(effect('LXVIII').limitsEs,/estadísticas solo 2023–2025/);assert.match(effect('LVII').limitsEs,/no resuelve jurisdicción de Porto Belo/);
 for(const id of ['ATAS-art-6','ATAS-art-10']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('lote 10 registra veinte fuentes sin sustituciones y conserva progreso separado de traducción',()=>{
 assert.equal(batch.ids.length,20);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_10_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/190\/398/);assert.match(t,/208/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
