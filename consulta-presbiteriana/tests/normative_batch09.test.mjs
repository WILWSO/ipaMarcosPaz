import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_09.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='SC-2026-'+id),sha=s=>createHash('sha256').update(s).digest('hex');
test('reenvíos en sesenta días preservan originales y no se extienden a todo Sínodo',()=>{
 for(const id of ['XCIV','XCIII']){assert.match(effect(id).noteEs,/60 días/);assert.match(effect(id).noteEs,/CE 2027/);assert.match(effect(id).noteEs,/original/);}
 assert.match(effect('XCIV').limitsEs,/No inventa fecha inicial/);assert.match(effect('XCIII').limitsEs,/No declara anulada automáticamente/);assert.match(effect('XCII').limitsEs,/ni impone aquí reenvío en 60 días/);
 assert.match(effect('LXXXV').limitsEs,/no elimina actas distintas de sesiones regulares/);assert.match(effect('LXXIX').noteEs,/actas distintas de sesión preparatoria/);
 for(const id of ['RI-SIN-art-10','RI-SIN-art-11','ATAS-art-10']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('rectificaciones estadísticas distinguen cifras prescritas, discrepancias y datos ausentes',()=>{
 assert.match(effect('LXXXI').noteEs,/de 66 a 4/);assert.match(effect('LXXXI').noteEs,/35 menos 31/);assert.match(effect('LXXIX').noteEs,/de 321 a 47/);assert.match(effect('LXXX').limitsEs,/no fija cifra de reemplazo/);assert.match(effect('XC').limitsEs,/5\.360/);assert.match(effect('LXXXIX').limitsEs,/No inventa membresía real/);
 assert.match(by.get('SC-2026-XC').textOriginal,/5\.360/);assert.match(by.get('SC-2026-LXXXI').textOriginal,/e não 66/);assert.match(by.get('SC-2026-LXXIX').textOriginal,/de 321 para 47/);assert.match(effect('LXXXI').limitsEs,/no se altera texto original del Digesto/);
});
test('corrección estatutaria, proyectos futuros y dossiers no se convierten en nuevas reformas',()=>{
 assert.match(effect('LXXV').limitsEs,/no es organización, instalación ni inicio/);assert.match(effect('LXXVI').limitsEs,/No constituye nuevamente Sínodo en marzo 2025/);assert.match(effect('LXXVIII').limitsEs,/no acredita instalación/);assert.ok(effect('LXXVIII').targets.includes('SC-2026-CLV'));assert.match(effect('LXXVII').noteEs,/CE\/PSPR a CE\/SMD/);
 const es=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));assert.equal(es.length,20);assert.ok(es.every(e=>e.kind==='minutes-approved-with-observations'&&!e.patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_09_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/170\/398/);assert.match(t,/228/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
