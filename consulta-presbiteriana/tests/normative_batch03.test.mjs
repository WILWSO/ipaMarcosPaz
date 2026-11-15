import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeAnswer,reading,effectsFor,related} from '../src/lib/search.mjs';
const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const by=new Map(c.records.map(r=>[r.id,r]));
const batch=JSON.parse(readFileSync(new URL('../documentos/integracion_lote_03.json',import.meta.url)));
const effects=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));
const sha=s=>createHash('sha256').update(s).digest('hex');
test('lote 03 documenta veinte decisiones y conserva plazos individuales de nombramientos',()=>{
 assert.equal(batch.ids.length,20);assert.equal(new Set(batch.ids).size,20);assert.equal(effects.filter(e=>e.kind.startsWith('appointment')).length,15);assert.ok(effects.every(e=>e.patchApplied===false));
 assert.match(by.get('SC-2026-CCXXI').textOriginal,/Uziel Firmino de Assis Júnior[\s\S]+CE 2028/);assert.match(effects.find(e=>e.source==='SC-2026-CCXV').limitsEs,/lista incluye tres nombres/);
 assert.ok(effects.find(e=>e.source==='SC-2026-CCIX').targets.includes('SC-2026-CXXIII'));assert.match(effects.find(e=>e.source==='SC-2026-CCIX').limitsEs,/no acredita la aprobación/);
 for(const lang of ['es','pt']){const text=readFileSync(new URL('../documentos/integracion_normativa_lote_03_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...text.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(text,/50\/398/);assert.match(text,/348/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);
});
test('rechazos y estudios no reemplazan plazos de membresía, aspirantes ni representación',()=>{
 for(const id of ['CI-art-13','CI-art-87','CI-art-90','CI-art-115','CI-art-116','CI-art-119','CI-art-120']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined,id);assert.equal(r.integratedTextPt,undefined,id);assert.equal(reading(r,'es',true).text,r.textEs,id);assert.equal(sha(r.textEs),r.translationReview.translationHash,id);}
 assert.match(by.get('CI-art-13').textOriginal,/o prazo é de um ano/);assert.match(by.get('CI-art-87').textOriginal,/quatro ministros/);assert.match(by.get('CI-art-90').textOriginal,/dois ministros e dois presbíteros/);
 assert.equal(effects.find(e=>e.source==='SC-2026-CCV').kind,'rejection-and-study');assert.match(effects.find(e=>e.source==='SC-2026-CCV').limitsEs,/no promulga un mínimo/);assert.equal(effects.find(e=>e.source==='SC-2026-CCII').kind,'premature-proposal');
 for(const id of ['CD-art-30','CD-art-31','CD-art-44']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
 assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);
});
test('CCB tiene anotación específica atribuida al acuerdo, sin reescribir la nota histórica ni generalizar su alcance',()=>{
 const e=effects.find(e=>e.source==='SC-2026-CCIV');assert.equal(e.kind,'amends-prior-decision');assert.deepEqual(e.targets,['CI-art-16','CI-nota-62','PL-art-12']);assert.match(e.noteEs,/acuerdo suministrado/);assert.match(e.noteEs,/no juzga la salvación individual/);assert.match(e.limitsEs,/SC-2022-DOC\. XX/);assert.match(e.limitsEs,/Doc\. 064/);
 const note=by.get('CI-nota-62');assert.equal(sha(note.textOriginal),note.translationReview.sourceHash);assert.equal(sha(note.textEs),note.translationReview.translationHash);assert.equal(note.integratedTextEs,undefined);assert.ok(effectsFor(note,c).some(x=>x.source==='SC-2026-CCIV'));
 assert.ok(related(by.get('CI-art-16'),c).some(x=>x.id==='SC-2026-CCIV'));const es=makeAnswer('membresía',[by.get('CI-art-16')],c,{language:'es'});const pt=makeAnswer('membros',[by.get('CI-art-16')],c,{language:'pt'});assert.match(es,/instrucción previa, pública profesión de fe y bautismo/);assert.match(pt,/instrução prévia, pública profissão de fé e batismo/);assert.doesNotMatch(pt,/El acuerdo suministrado/);
 assert.equal(c.metadata.translationComplete,true);assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);assert.equal(c.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
