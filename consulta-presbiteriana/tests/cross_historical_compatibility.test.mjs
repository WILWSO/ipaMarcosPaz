import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeAnswer,makeBilingualAnswer} from '../src/lib/search.mjs';
const read=n=>readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');
const corpus=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));const by=new Map(corpus.records.map(r=>[r.id,r]));
const data=JSON.parse(read('compatibilidad_transversal_lote_01_2026.json'));const inventory=JSON.parse(read('inventario_referencias_transversales_2026.json'));const sha=s=>createHash('sha256').update(s).digest('hex');
test('cross inventory scans all 816 notes, excludes 25 direct notes and keeps raw candidates distinct from reviews',()=>{
 assert.equal(inventory.notesScanned,816);assert.equal(inventory.directNotesExcluded,25);assert.equal(inventory.crossNotesEligible,791);assert.equal(data.items.length,20);
 assert.equal(inventory.candidateNotes,inventory.candidateNotesInventory.length);assert.equal(inventory.pendingCandidateNotes,inventory.candidateNotes-inventory.reviewedCandidateNotes);
 assert.equal(inventory.globalCompatibilityReviewComplete,false);assert.equal(inventory.candidateReviewComplete,true);
 for(const item of data.items){const r=by.get(item.id);assert.equal(sha(r.textOriginal),item.originalHash);assert.equal(sha(r.textEs),item.translationHash);assert.equal(r.crossHistoricalCompatibilityReview.officialApproval,false);for(const id of item.parents)assert.ok(by.get(id).crossCompatibilityNoteIds.includes(item.id));}
 assert.ok(inventory.candidateNotesInventory.some(x=>x.id==='CI-nota-23'));assert.equal(by.get('CI-nota-23').crossHistoricalCompatibilityReview,undefined);
 for(const candidate of inventory.candidateNotesInventory)for(const hit of candidate.hits)assert.equal(by.get(candidate.id).textOriginal.slice(hit.start,hit.end),hit.citation);
});
test('historical forwarding deadline, in fine locator and judicial regime are warned without rewriting notes',()=>{
 const n=by.get('CI-nota-179');assert.match(n.textOriginal,/prazo é de 90/);assert.match(n.crossHistoricalCompatibilityReview.findingEs,/30 días desde recepción/);assert.match(n.crossHistoricalCompatibilityReview.findingEs,/no reemplazar todos sus 90 días/);
 assert.match(by.get('CI-nota-250').crossHistoricalCompatibilityReview.findingEs,/El localizador requiere confirmar el pasaje/);
 assert.match(by.get('CD-nota-85').crossHistoricalCompatibilityReview.findingEs,/no sustituye por ese plazo los recursos judiciales/);
 assert.match(by.get('CI-nota-169').crossHistoricalCompatibilityReview.findingEs,/no autoriza expresamente emerencia póstuma/);
 assert.equal(by.get('EST-IG-art-28').integratedTextPt,undefined);
});
test('complete cross notes and warnings remain visible on parent articles and bilingual exports',()=>{
 for(const lang of ['es','pt']){const text=read(`compatibilidad_transversal_lote_01_2026_${lang}.md`);assert.equal((text.match(/<a id="/g)||[]).length,20);for(const item of data.items)assert.ok(text.includes(by.get(item.id)[lang==='es'?'textEs':'textOriginal']));}
 const parent=by.get('CI-art-63');const n=by.get('CI-nota-179');assert.ok(makeAnswer('recursos',[parent],corpus).includes(n.crossHistoricalCompatibilityReview.findingEs));
 for(const language of ['es','pt']){const finding=n.crossHistoricalCompatibilityReview[language==='es'?'findingEs':'findingPt'];assert.ok(makeBilingualAnswer('recursos',[parent],corpus,{language}).includes(finding));assert.ok(read(`manual_integrado_${language}.md`).includes(finding));}
 assert.ok(JSON.parse(read('estado_bilingue.json')).bilingualMarkdownDocuments.some(p=>p.es==='compatibilidad_transversal_lote_01_2026_es.md'));
});
