import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_07.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='SC-2026-'+id),sha=s=>createHash('sha256').update(s).digest('hex');
test('seis aprobaciones de libros CE mantienen observaciones sin reformar reglas de actas',()=>{
 const es=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));assert.equal(es.filter(e=>e.kind==='minutes-approved-with-observations').length,6);assert.ok(es.every(e=>!e.patchApplied));assert.equal(batch.ids.length,20);assert.ok(!batch.ids.includes('SC-2026-CXXIII'));
 assert.match(effect('CXXXIII').noteEs,/113 páginas/);assert.match(effect('CXXXII').noteEs,/03 páginas/);assert.match(effect('CXXXII').limitsEs,/CE-E2 y referencia interna CE-1E/);assert.match(effect('CXXVIII').limitsEs,/No se rellena resolución incompleta/);
 for(const id of ['ATAS-art-2','ATAS-art-8','ATAS-art-9']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_07_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/130\/398/);assert.match(t,/268/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);
});
test('culto, enseñanza, recursos y afiliación conservan alcance específico y debido proceso',()=>{
 assert.match(effect('CXXVI').noteEs,/otros contextos bajo supervisión/);assert.match(effect('CXXVI').limitsEs,/No prohíbe absolutamente enseñanza femenina/);assert.match(effect('CXXVI').limitsEs,/sin fusionar licenciatura y ordenación/);assert.equal(effect('CXXV').kind,'appeal-denied');assert.match(effect('CXXV').limitsEs,/presentación tempestiva/);assert.match(effect('CXXIV').limitsEs,/no es cláusula pétrea/);
 assert.match(effect('CXXII').noteEs,/SC 2030/);assert.match(effect('CXXII').noteEs,/Item X/);assert.match(effect('CXXII').limitsEs,/prohibición general de afiliación ni disciplina automática/);assert.match(effect('CXXI').limitsEs,/únicamente nombres de Presbiterios/);assert.match(effect('CXXI').noteEs,/sin vincular elección/);
 for(const id of ['PL-art-15','PL-art-16','PL-art-31','CI-art-100','CD-art-8']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('casamiento, memoria, disolución y conducta digital distinguen presencia, función y proceso',()=>{
 assert.match(effect('CXX').noteEs,/mera asistencia no constituye por sí sola falta/);assert.match(effect('CXX').noteEs,/testigo, padrino, oficiante/);assert.match(effect('CXIX').limitsEs,/No concede emerencia póstuma/);assert.match(effect('CXVIII').noteEs,/salvo fecha futura expresa/);assert.match(effect('CXVIII').limitsEs,/No hace cesar el vínculo por mera asamblea/);assert.match(effect('CXVIII').limitsEs,/art\. 82/);assert.match(effect('CXVII').noteEs,/deliberadamente/);assert.match(effect('CXVII').limitsEs,/toda pena requiere sentencia/);assert.match(effect('CXVI').limitsEs,/considerandos, no como nueva orden/);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
