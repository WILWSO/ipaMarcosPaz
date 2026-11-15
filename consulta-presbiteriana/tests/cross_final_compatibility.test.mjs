import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');
const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const by=new Map(c.records.map(r=>[r.id,r]));
const data=JSON.parse(read('compatibilidad_transversal_lote_05_2026.json'));
const inv=JSON.parse(read('inventario_referencias_transversales_2026.json'));
const sha=s=>createHash('sha256').update(s).digest('hex');
test('last 28 notes close the exact candidate inventory without approving global compatibility',()=>{
 assert.equal(data.items.length,28);assert.equal(new Set(data.items.map(x=>x.id)).size,28);
 assert.equal(inv.reviewedCandidateNotes,142);assert.equal(inv.comparedReformRelatedNotes,102);assert.equal(inv.excludedOtherReferenceNotes,40);assert.equal(inv.pendingCandidateNotes,0);assert.deepEqual(inv.pendingIds,[]);assert.equal(inv.nextId,null);assert.equal(inv.candidateReviewComplete,true);assert.equal(inv.globalCompatibilityReviewComplete,false);
 assert.equal(inv.candidateNotesInventory.length,142);assert.ok(inv.candidateNotesInventory.every(x=>x.classificationStatus!=='pending'));
 for(const item of data.items){const r=by.get(item.id);assert.equal(sha(r.textOriginal),item.originalHash);assert.equal(sha(r.textEs),item.translationHash);assert.equal(r.crossHistoricalCompatibilityReview.officialApproval,false);for(const parent of item.parents)assert.ok(by.get(parent).crossCompatibilityNoteIds.includes(item.id));}
 assert.equal(Object.keys(data.reformProvenance).length,7);for(const [id,p] of Object.entries(data.reformProvenance)){assert.equal(sha(by.get(id).textOriginal),p.originalHash);assert.equal(sha(by.get(id).textEs),p.translationHash);}
});
test('selected documentary confirmations remain open and retain grounded provenance',()=>{
 const pending=JSON.parse(read('pendientes_confirmacion_documental_2026.json'));assert.equal(pending.items.length,7);assert.equal(pending.exhaustive,false);assert.equal(c.metadata.documentaryConfirmationProgress.confirmationComplete,false);
 for(const item of pending.items){assert.ok(['open','partially-resolved','resolved-editorially','resolved-documentarily'].includes(item.status));for(const p of item.sources){assert.equal(sha(by.get(p.id).textOriginal),p.originalHash);assert.equal(sha(by.get(p.id).textEs),p.translationHash);}}
 assert.match(pending.items.find(x=>x.id==='P01').findingEs,/no se declara por inferencia/);
 assert.match(pending.items.find(x=>x.id==='P02').findingEs,/mandato anual está dentro/);
 assert.match(pending.items.find(x=>x.id==='P04').findingEs,/no posterga toda la aprobación/);
 assert.match(pending.items.find(x=>x.id==='P04').findingEs,/No se certifica/);
 assert.equal(c.normativeEffects.length,398);assert.equal(c.metadata.editorialConsolidationProgress.editorialFinalReviewComplete,false);
});
test('closing reports contain all full notes and seven full sources in both languages',()=>{
 const manifest=JSON.parse(read('estado_bilingue.json'));
 for(const lang of ['es','pt']){const field=lang==='es'?'textEs':'textOriginal';const text=read(`compatibilidad_transversal_lote_05_2026_${lang}.md`);assert.equal((text.match(/<a id="/g)||[]).length,35);assert.ok(text.includes('142/142'));for(const item of data.items){assert.ok(text.includes(by.get(item.id)[field]));assert.ok(read(`manual_integrado_${lang}.md`).includes(item[lang==='es'?'findingEs':'findingPt']));}for(const id of Object.keys(data.reformProvenance))assert.ok(text.includes(by.get(id)[field]));assert.ok(read(`pendientes_confirmacion_documental_2026_${lang}.md`).includes('P07'));}
 assert.ok(manifest.bilingualMarkdownDocuments.some(x=>x.es==='pendientes_confirmacion_documental_2026_es.md'));assert.equal(manifest.crossHistoricalCompatibilityProgress.candidateReviewComplete,true);
 const ui=readFileSync(new URL('../src/routes/+page.svelte',import.meta.url),'utf8');assert.ok(ui.includes('Clasificación del rastreo concluida; confirmaciones documentales pendientes.'));
});
