import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_18.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('seminarios distingue aprobación de diez informes y examen pendiente Noroeste sin fecha inventada',()=>{
 assert.match(effect('LXIV').noteEs,/diez seminarios/);assert.match(effect('LXIV').noteEs,/Noroeste queda fuera/);assert.match(effect('LXIV').noteEs,/60 días/);assert.match(effect('LXIV').limitsEs,/no se aprueban por inferencia/);assert.match(effect('LXIV').limitsEs,/no se convierte en fecha final/);assert.match(effect('LXV').limitsEs,/No fija valores de alçadas/);assert.match(effect('LXX').noteEs,/SOHO/);
});
test('Guará conserva validez Eixo Sul y nulidad limitada; diligencias no anticipan mérito posterior',()=>{
 const e=effect('LXIII');assert.match(e.noteEs,/Reconoce legalidad/);assert.match(e.noteEs,/disolución PRGU/);assert.match(e.limitsEs,/no alcanza por extensión creación Eixo Sul/);assert.ok(e.targets.includes('SC-2026-XCV'));assert.match(effect('LXII').noteEs,/no aprueba, acoge o rechaza/);assert.match(effect('LXII').limitsEs,/No anticipa juicio doctrinal/);assert.match(effect('LXI').limitsEs,/No aprueba escuela/);assert.match(effect('LX').limitsEs,/no es aprobación de carta nueva/);
 for(const id of ['CI-art-87','CI-art-94']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
});
test('Recife es excepción a remisión general y siete jubilaciones no crean pensión o voto general',()=>{
 assert.match(effect('LIX').limitsEs,/no es elección CE de todas las JURETs/);assert.match(effect('LIX').noteEs,/por dos años/);const retires=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id)).filter(e=>e.kind==='individual-retirement-without-ipb-charge');assert.equal(retires.length,7);assert.ok(retires.every(e=>/sin carga para IPB/.test(e.noteEs)&&/no crea pensión/.test(e.limitsEs)));assert.match(effect('LVII').limitsEs,/considerando omite Filho/);assert.equal(by.get('CI-art-49').integratedTextEs,undefined);
 assert.equal(batch.ids.length,20);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_18_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/350\/398/);assert.match(t,/48/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
