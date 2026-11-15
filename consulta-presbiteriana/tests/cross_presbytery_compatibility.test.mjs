import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeBilingualAnswer} from '../src/lib/search.mjs';
const read=n=>readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));const by=new Map(c.records.map(r=>[r.id,r]));const data=JSON.parse(read('compatibilidad_transversal_lote_03_2026.json'));const inv=JSON.parse(read('inventario_referencias_transversales_2026.json'));const sha=s=>createHash('sha256').update(s).digest('hex');
test('third batch covers 30 distinct notes with source hashes and cumulative progress 90/142',()=>{
 assert.equal(data.items.length,30);assert.equal(inv.reviewedCandidateNotes,142);assert.equal(inv.comparedReformRelatedNotes,102);assert.equal(inv.excludedOtherReferenceNotes,40);assert.equal(inv.pendingCandidateNotes,0);assert.equal(inv.globalCompatibilityReviewComplete,false);
 for(const item of data.items){const r=by.get(item.id);assert.equal(sha(r.textOriginal),item.originalHash);assert.equal(sha(r.textEs),item.translationHash);assert.equal(r.crossHistoricalCompatibilityReview.officialApproval,false);assert.ok(!inv.pendingIds.includes(item.id));for(const p of item.parents)assert.ok(by.get(p).crossCompatibilityNoteIds.includes(item.id));}
 for(const [rid,proof] of Object.entries(data.reformProvenance)){assert.equal(sha(by.get(rid).textOriginal),proof.originalHash);assert.equal(sha(by.get(rid).textEs),proof.translationHash);}
});
test('clarifications preserve distinctions for support, candidates, planting and unresolved emeritus vote',()=>{
 assert.match(by.get('CD-nota-26').crossHistoricalCompatibilityReview.findingEs,/No imponer pago obligatorio/);assert.match(by.get('CI-nota-125').crossHistoricalCompatibilityReview.findingEs,/DOC.128 y DOC.129/);
 assert.match(by.get('CI-nota-271').crossHistoricalCompatibilityReview.findingEs,/No convertir esa comunicación en autorización previa general/);
 assert.match(by.get('CI-nota-333').crossHistoricalCompatibilityReview.findingEs,/no reintroducir esa palabra/);
 assert.match(by.get('CI-nota-297').crossHistoricalCompatibilityReview.findingEs,/confirmar su compatibilidad/);
 assert.match(by.get('CI-nota-293').crossHistoricalCompatibilityReview.findingEs,/no para integrar automáticamente comisiones/);
 assert.ok(!by.get('CI-art-49').integratedTextPt);
});
test('third dossier includes complete 30 notes and four sources with findings in integrated documents and exports',()=>{
 for(const language of ['es','pt']){const text=read(`compatibilidad_transversal_lote_03_2026_${language}.md`);assert.equal((text.match(/<a id="/g)||[]).length,34);for(const item of data.items)assert.ok(text.includes(by.get(item.id)[language==='es'?'textEs':'textOriginal']));for(const rid of Object.keys(data.reformProvenance))assert.ok(text.includes(by.get(rid)[language==='es'?'textEs':'textOriginal']));
 const note=by.get('CD-nota-26');const finding=note.crossHistoricalCompatibilityReview[language==='es'?'findingEs':'findingPt'];assert.ok(read(`manual_integrado_${language}.md`).includes(finding));assert.ok(makeBilingualAnswer('sustento',[note],c,{language}).includes(finding));}
 assert.ok(JSON.parse(read('estado_bilingue.json')).bilingualMarkdownDocuments.some(p=>p.es==='compatibilidad_transversal_lote_03_2026_es.md'));
});
