import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_20.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('jubilaciones individuales conservan referencia propia, sin pensión o supresión de privilegios CI49',()=>{
 const es=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));assert.equal(es.length,20);assert.ok(es.every(e=>e.kind==='individual-retirement-without-ipb-charge'&&!e.patchApplied));assert.ok(es.every(e=>/sin carga para IPB/.test(e.noteEs)&&/no crea pensión/.test(e.limitsEs)&&/ni concede voto general/.test(e.limitsEs)));assert.match(effect('XXX').retirementLegalReferencePt,/§ 3º e 6º/);assert.match(effect('XXVIII').retirementLegalReferencePt,/§ 1º/);assert.match(effect('XV').retirementLegalReferencePt,/§ 2º/);
 for(const id of ['CI-art-49','CI-art-97']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
});
test('cronologías y variantes documentales se señalan sin elegir corrección o cambiar acto',()=>{
 assert.match(effect('XXXI').limitsEs,/Wagner frente a Vagner/);assert.match(effect('XXIII').limitsEs,/Elizier\/Eliezier/);assert.match(effect('XXIV').limitsEs,/03\.03\.1957/);assert.match(effect('XXIV').limitsEs,/69/);assert.match(effect('XIV').limitsEs,/02\.08\.1958/);assert.match(effect('XXI').limitsEs,/11\.03\.2012/);assert.match(effect('XII').limitsEs,/17\.03\.1978/);assert.match(effect('XII').limitsEs,/08\.01\.1989/);assert.match(effect('XII').limitsEs,/sin sustituirlas/);assert.match(effect('XII').limitsEs,/No se declara invalidez/);assert.match(effect('XVIII').limitsEs,/no se igualan ambos plazos/);
 for(const e of batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id)))assert.ok(by.get(e.source).textOriginal.includes(e.retirementLegalReferencePt));
});
test('dossiers íntegros conservan orden y ocho decisiones pendientes sin cierre definitivo',()=>{
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_20_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/390\/398/);assert.match(t,/8 (?:pendientes|pendentes)/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);assert.equal(c.metadata.normativeIntegrationProgress.reviewComplete,true);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).externalCertification));
});
