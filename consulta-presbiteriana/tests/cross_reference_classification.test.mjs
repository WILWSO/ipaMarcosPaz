import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeAnswer,makeBilingualAnswer} from '../src/lib/search.mjs';
const read=n=>readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');
const corpus=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));const by=new Map(corpus.records.map(r=>[r.id,r]));const data=JSON.parse(read('compatibilidad_transversal_lote_02_2026.json'));const inventory=JSON.parse(read('inventario_referencias_transversales_2026.json'));const sha=s=>createHash('sha256').update(s).digest('hex');
test('second batch disambiguates 40 candidates without treating them as amendments or general validity approvals',()=>{
 assert.equal(data.items.length,40);assert.equal(inventory.reviewedCandidateNotes,142);assert.equal(inventory.comparedReformRelatedNotes,102);assert.equal(inventory.excludedOtherReferenceNotes,40);assert.equal(inventory.pendingCandidateNotes,0);assert.equal(inventory.candidateNotes,142);assert.equal(inventory.globalCompatibilityReviewComplete,false);
 for(const item of data.items){const r=by.get(item.id);assert.equal(sha(r.textOriginal),item.originalHash);assert.equal(sha(r.textEs),item.translationHash);assert.equal(r.crossReferenceClassification.requiresReformWarning,false);assert.equal(r.crossHistoricalCompatibilityReview,undefined);assert.equal(r.crossReferenceClassification.officialApproval,false);assert.equal(inventory.candidateNotesInventory.find(x=>x.id===item.id).classificationStatus,'resolved-other-body');assert.ok(!inventory.pendingIds.includes(item.id));for(const target of item.resolvedTargets)assert.ok(by.has(target));}
 assert.equal(inventory.candidateNotesInventory.filter(x=>x.classificationStatus==='pending').length,0);
});
test('civil, disciplinary, liturgical and model homonyms remain distinct from the eight reformed articles',()=>{
 assert.deepEqual(by.get('CI-nota-23').crossReferenceClassification.resolvedTargets,[]);assert.match(by.get('CI-nota-23').crossReferenceClassification.resolvedBodyEs,/Código Civil/);
 assert.deepEqual(by.get('CD-nota-52').crossReferenceClassification.resolvedTargets,['CD-art-27']);assert.deepEqual(by.get('CI-nota-157').crossReferenceClassification.resolvedTargets,['PL-art-27']);assert.deepEqual(by.get('CI-nota-221').crossReferenceClassification.resolvedTargets,['EST-IG-art-27']);
 assert.deepEqual(by.get('CI-nota-356').crossReferenceClassification.resolvedTargets,[]);assert.match(by.get('CI-nota-356').crossReferenceClassification.findingEs,/No se equipara/);
 assert.match(by.get('CI-nota-54').crossReferenceClassification.findingEs,/art.10/);
});
test('classification reports preserve all complete notes and expose exact body identification in UI and exports',()=>{
 for(const language of ['es','pt']){const text=read(`compatibilidad_transversal_lote_02_2026_${language}.md`);assert.equal((text.match(/<a id="/g)||[]).length,40);for(const item of data.items)assert.ok(text.includes(by.get(item.id)[language==='es'?'textEs':'textOriginal']));}
 const r=by.get('CI-nota-23');assert.ok(makeAnswer('estatuto',[r],corpus).includes(r.crossReferenceClassification.resolvedBodyEs));for(const language of ['es','pt'])assert.ok(makeBilingualAnswer('estatuto',[r],corpus,{language}).includes(r.crossReferenceClassification[language==='es'?'resolvedBodyEs':'resolvedBodyPt']));
 assert.ok(JSON.parse(read('estado_bilingue.json')).bilingualMarkdownDocuments.some(x=>x.es==='compatibilidad_transversal_lote_02_2026_es.md'));const ui=readFileSync(new URL('../src/routes/+page.svelte',import.meta.url),'utf8');assert.ok(ui.includes('selected.crossReferenceClassification.resolvedBodyEs'));assert.ok(ui.includes('compatibilidad_transversal_lote_02_2026_pt'));
});
