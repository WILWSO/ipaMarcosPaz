import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_19.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('veinte jubilaciones conservan referencia propia y no crean pensión, voto o reforma CI49',()=>{
 const es=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));assert.equal(es.length,20);assert.ok(es.every(e=>e.kind==='individual-retirement-without-ipb-charge'&&!e.patchApplied&&e.retirementLegalReferencePt));assert.ok(es.every(e=>/sin carga para IPB/.test(e.noteEs)&&/no crea pensión/.test(e.limitsEs)&&/ni concede voto general/.test(e.limitsEs)));assert.match(effect('XLV').retirementLegalReferencePt,/§ 3º/);assert.match(effect('XLI').retirementLegalReferencePt,/§ 1º/);assert.match(effect('XLIII').retirementLegalReferencePt,/Art\. 49, § 6º/);
 for(const id of ['CI-art-49','CI-art-97']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
});
test('discrepancias de edad, numeración y biografía se señalan sin corregir fuente o declarar invalidez',()=>{
 assert.match(effect('XLIV').limitsEs,/15\.02\.1965/);assert.match(effect('XLIV').limitsEs,/61 años/);assert.match(effect('L').limitsEs,/ordenación en 2011/);assert.match(effect('L').limitsEs,/ni se concluye invalidez/);assert.match(effect('XLVIII').limitsEs,/repite V/);assert.match(effect('XXXIX').limitsEs,/2206\/2010/);assert.match(effect('XXXIV').limitsEs,/PNTR\/PNRT/);assert.match(effect('XXXII').limitsEs,/sin inferir identidad/);
 for(const e of batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id)))assert.ok(by.get(e.source).textOriginal.includes(e.retirementLegalReferencePt));
});
test('dossiers íntegros conservan orden y avance sin certificación externa',()=>{
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_19_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/370\/398/);assert.match(t,/28/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).externalCertification));
});
