import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_13.json');
const effect=id=>c.normativeEffects.find(e=>e.source===id),sha=s=>createHash('sha256').update(s).digest('hex');
test('gobierno conserva rechazo de límites, registro administrativo y competencias distintas',()=>{
 assert.match(effect('SC-2026-VIII').limitsEs,/No crea inelegibilidad/);assert.match(effect('SC-2026-VII').noteEs,/sin aprobación previa/);assert.match(effect('SC-2026-VII').limitsEs,/No transfiere organización conciliar a SE/);assert.match(effect('SC-2026-XI').noteEs,/excluyendo miembros de Mesa/);assert.match(effect('SC-2026-XIV').noteEs,/No aprueba informe cadastral financiero/);
 for(const id of ['CI-art-67','CI-art-94','CI-art-103','EST-SIN-art-22']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('drogas, jubilados y orientaciones doctrinales no crean beneficios o reformas automáticas',()=>{
 const drugs=effect('SC-2026-X');assert.match(drugs.noteEs,/informes anuales CE/);assert.match(drugs.noteEs,/materiales oficiales requieren apreciación CE/);assert.match(drugs.limitsEs,/No crea autarquía/);assert.ok(drugs.targets.includes('SC-2026-CCXIII'));assert.match(effect('SC-2026-IX').limitsEs,/No crea salario mínimo/);assert.match(effect('SC-2026-IX').noteEs,/CE 2027/);assert.match(effect('SC-2026-V').limitsEs,/No reescribe PL art\. 15/);assert.match(effect('SC-2026-IV').limitsEs,/No incorpora reforma de CI arts\. 53\/84/);assert.match(effect('SC-2026-VI').limitsEs,/sin corroboración independiente/);
 for(const id of ['CI-art-49','PL-art-15','CI-art-53','CI-art-83']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('CE presupuesto, estudios y patrimonio distinguen autorización, ejecución y revocación externa parcial',()=>{
 assert.match(effect('CE-2026-CLXIII').noteEs,/5%/);assert.match(effect('CE-2026-CLXIII').limitsEs,/Planilla integral no figura/);assert.match(effect('CE-2026-CLXII').noteEs,/Saúde 8,78%/);assert.match(effect('CE-2026-CLX').limitsEs,/No resuelve mérito/);assert.match(effect('CE-2026-CLVII').limitsEs,/No autoriza compra inmediata/);assert.match(effect('CE-2026-CLVI').limitsEs,/SC-CXLVI posterior/);const property=effect('CE-2026-CLV');assert.match(property.limitsEs,/Revocación parcial afecta decisión externa de 2022/);assert.match(property.noteEs,/no vender\/ceder/);assert.match(property.limitsEs,/mitad de costos/);assert.equal(property.externalRevocations.length,1);assert.ok(by.get('CE-2026-CLV').textOriginal.includes(property.externalRevocations[0].evidencePt));
 assert.equal(batch.ids.length,20);assert.equal(batch.ids.filter(id=>id.startsWith('CE-')).length,9);assert.ok(batch.ids.every(id=>!effect(id).patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_13_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/250\/398/);assert.match(t,/148/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
