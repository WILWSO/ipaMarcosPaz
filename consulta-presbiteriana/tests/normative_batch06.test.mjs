import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_06.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='SC-2026-'+id);
const sha=s=>createHash('sha256').update(s).digest('hex');
test('seminarios distinguen aprobación condicionada de parecer desfavorable y ejecución',()=>{
 for(const id of ['CLVII','CLVI']){assert.equal(effect(id).kind,'conditional-approval');assert.equal(effect(id).patchApplied,false);assert.match(effect(id).noteEs,/después/);}
 assert.match(effect('CLVII').limitsEs,/no equivale a rechazo/);assert.match(effect('CLVI').limitsEs,/No declara consumada/);
 assert.match(effect('CLV').noteEs,/2027/);assert.match(effect('CLV').noteEs,/2030/);assert.match(effect('CLV').limitsEs,/no hay cierre automático/);
 assert.equal(batch.ids.length,20);assert.ok(!batch.ids.includes('SC-2026-CLIV'));assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);
});
test('Santa Cena, recepción y contribuciones conservan distinciones de la decisión',()=>{
 assert.match(effect('CXLVII').noteEs,/jugo de uva satisface/);assert.match(effect('CXLVII').limitsEs,/No obliga a uso exclusivo de vino alcohólico/);assert.match(effect('CXLIX').noteEs,/irregularidad contributiva no restringe/);assert.match(effect('CXLIX').noteEs,/inciso VI exige/);assert.match(effect('CLII').limitsEs,/art\. 18 trata de transferencia/);assert.match(effect('CLII').limitsEs,/No impone nuevo bautismo/);assert.match(effect('CXLVIII').limitsEs,/No resuelve el mérito/);
 for(const id of ['PL-art-17','CI-art-16','CI-art-18','CI-art-100']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('protección, misión y dossiers separan deberes, aplicación concreta y proyectos pendientes',()=>{
 assert.match(effect('CXLIII').noteEs,/comunicación inmediata/);assert.match(effect('CXLIII').noteEs,/cuando reconocida/);assert.match(effect('CXLIII').limitsEs,/No emite interpretación civil vinculante/);assert.match(effect('CXL').limitsEs,/No aprueba incorporación inmediata/);assert.match(effect('CXXXVII').limitsEs,/no acredita liquidación de todos los pasivos/);assert.match(effect('CXXXVIII').limitsEs,/No concede automáticamente apoyo financiero/);
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_06_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/110\/398/);assert.match(t,/288/);}
 assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
