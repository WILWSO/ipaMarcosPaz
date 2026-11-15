import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_08.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='SC-2026-'+id),sha=s=>createHash('sha256').update(s).digest('hex');
test('calendario y consejo distinguen decisión efectiva, propuesta y reglamento pendiente',()=>{
 assert.equal(effect('CXI').kind,'calendar-date-established');assert.match(effect('CXI').noteEs,/14 de febrero/);assert.match(effect('CV').noteEs,/tercer domingo de octubre/);assert.match(effect('CV').limitsEs,/No adopta 15 de octubre/);assert.match(effect('CV').limitsEs,/septiembre/);
 assert.equal(effect('CVI').kind,'council-created-with-workplan');assert.match(effect('CVI').noteEs,/CE 2027/);assert.match(effect('CVI').noteEs,/comisión de siete/);assert.match(effect('CVI').limitsEs,/Composición de tres/);assert.match(effect('CVI').limitsEs,/No crea las secretarías/);assert.equal(effect('CXIV').kind,'rejection-and-study');assert.match(effect('CXIV').limitsEs,/No crea la UPJ/);assert.match(effect('CVII').limitsEs,/No aprueba construcción/);assert.match(effect('CVII').limitsEs,/encargo efectivo atribuido a JPEF/);
});
test('orientación pastoral y diez exámenes sinodales preservan límites y reglas históricas',()=>{
 assert.match(effect('CXV').limitsEs,/sin verificación clínica o histórica independiente/);assert.match(effect('CXV').limitsEs,/no impone sanción automática/);
 const es=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));assert.equal(es.filter(e=>e.kind==='minutes-approved-with-observations').length,10);assert.ok(es.every(e=>!e.patchApplied));assert.match(effect('XCVII').limitsEs,/No prohíbe toda acta por sesión/);assert.match(effect('XCVI').limitsEs,/no elimina elección pastoral/);assert.match(effect('XCVI').limitsEs,/ni prohíbe identificar cargos, nombres/);assert.match(effect('CIV').limitsEs,/No impone escribir por extenso absolutamente todo numeral/);assert.match(effect('CI').limitsEs,/0,9%/);assert.match(effect('XCV').limitsEs,/No declara nulas todas las actuaciones/);assert.ok(effect('XCV').targets.includes('CE-2026-LXIII'));
 for(const id of ['ATAS-art-10','RI-SIN-art-4','RI-SIN-art-11','CI-art-33','CI-art-67']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('lote 08 documenta veinte fuentes completas y mantiene progreso y cambios textuales separados',()=>{
 assert.equal(batch.ids.length,20);assert.ok(!batch.ids.includes('SC-2026-CIX'));assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_08_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/150\/398/);assert.match(t,/248/);}
});
