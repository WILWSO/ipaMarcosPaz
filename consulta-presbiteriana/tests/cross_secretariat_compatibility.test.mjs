import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeBilingualAnswer} from '../src/lib/search.mjs';
const read=n=>readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));const by=new Map(c.records.map(r=>[r.id,r]));const data=JSON.parse(read('compatibilidad_transversal_lote_04_2026.json'));const inv=JSON.parse(read('inventario_referencias_transversales_2026.json'));const sha=s=>createHash('sha256').update(s).digest('hex');
test('fourth batch verifies 24 unique notes and cumulative classification 142/142 without definitive approval',()=>{
 assert.equal(data.items.length,24);assert.equal(inv.reviewedCandidateNotes,142);assert.equal(inv.comparedReformRelatedNotes,102);assert.equal(inv.excludedOtherReferenceNotes,40);assert.equal(inv.pendingCandidateNotes,0);assert.equal(inv.globalCompatibilityReviewComplete,false);
 for(const item of data.items){const r=by.get(item.id);assert.equal(sha(r.textOriginal),item.originalHash);assert.equal(sha(r.textEs),item.translationHash);assert.equal(r.crossHistoricalCompatibilityReview.officialApproval,false);assert.ok(!inv.pendingIds.includes(item.id));for(const parent of item.parents)assert.ok(by.get(parent).crossCompatibilityNoteIds.includes(item.id));}
 for(const [id,proof] of Object.entries(data.reformProvenance)){assert.equal(sha(by.get(id).textOriginal),proof.originalHash);assert.equal(sha(by.get(id).textEs),proof.translationHash);}
});
test('archive repeal leaves correction, correspondence and signature distinct, and voting issue remains open',()=>{
 assert.match(by.get('EST-IPB-nota-6').crossHistoricalCompatibilityReview.findingEs,/inciso XI: no es el inciso X/);assert.match(by.get('ATAS-nota-5').crossHistoricalCompatibilityReview.findingEs,/no ATAS10 §9/);assert.match(by.get('CI-nota-302').crossHistoricalCompatibilityReview.findingEs,/inciso II/);
 assert.match(by.get('CI-nota-152').crossHistoricalCompatibilityReview.findingEs,/No resolver por inferencia/);assert.match(by.get('CI-nota-188').crossHistoricalCompatibilityReview.findingEs,/EC3 no lo revive/);assert.match(by.get('CI-nota-210').crossHistoricalCompatibilityReview.findingEs,/no extiende automáticamente a la Mesa/);
 assert.match(by.get('CI-nota-218').crossHistoricalCompatibilityReview.findingEs,/90 días donde §1 dice tres meses/);
 assert.ok(!by.get('CI-art-49').integratedTextPt);assert.ok(by.get('RI-CE-art-8').integratedTextPt.includes('XI - corrigir erros materiais'));
});
test('fourth report preserves 24 full notes and three sources with annotations in integrated documents and exports',()=>{
 for(const language of ['es','pt']){const text=read(`compatibilidad_transversal_lote_04_2026_${language}.md`);assert.equal((text.match(/<a id="/g)||[]).length,27);for(const item of data.items)assert.ok(text.includes(by.get(item.id)[language==='es'?'textEs':'textOriginal']));for(const id of Object.keys(data.reformProvenance))assert.ok(text.includes(by.get(id)[language==='es'?'textEs':'textOriginal']));
 const note=by.get('EST-IPB-nota-6');const finding=note.crossHistoricalCompatibilityReview[language==='es'?'findingEs':'findingPt'];assert.ok(read(`manual_integrado_${language}.md`).includes(finding));assert.ok(makeBilingualAnswer('actas',[note],c,{language}).includes(finding));}
 assert.ok(JSON.parse(read('estado_bilingue.json')).bilingualMarkdownDocuments.some(x=>x.es==='compatibilidad_transversal_lote_04_2026_es.md'));
});
