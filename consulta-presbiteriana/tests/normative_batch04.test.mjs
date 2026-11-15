import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeAnswer,effectsFor} from '../src/lib/search.mjs';
const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const by=new Map(c.records.map(r=>[r.id,r]));
const batch=JSON.parse(readFileSync(new URL('../documentos/integracion_lote_04.json',import.meta.url)));
const effects=batch.ids.map(id=>c.normativeEffects.find(e=>e.source===id));
const sha=s=>createHash('sha256').update(s).digest('hex');
test('lote 04 registra veinte decisiones y distingue nombramientos, informes y actos específicos',()=>{
 assert.equal(batch.ids.length,20);assert.equal(new Set(batch.ids).size,20);assert.ok(!batch.ids.includes('SC-2026-CLXXXI'));assert.equal(effects.filter(e=>e.kind==='appointment').length,6);assert.equal(effects.filter(e=>e.kind==='administrative-archive').length,3);assert.equal(effects.filter(e=>e.kind.startsWith('report-approved')).length,8);assert.ok(effects.every(e=>!e.patchApplied));
 for(const lang of ['es','pt']){const text=readFileSync(new URL('../documentos/integracion_normativa_lote_04_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...text.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(text,/70\/398/);assert.match(text,/328/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);
});
test('educación teológica conserva los 29 ajustes y distingue revocación JET de transición de otros reglamentos',()=>{
 const e=effects.find(e=>e.source==='SC-2026-CLXXXV');const markers=[...'abcdefghijklmnopqrstuvwxyz','aa','bb','cc'];assert.deepEqual(e.regulatoryAdjustments.map(x=>x.marker),markers);const source=by.get(e.source);
 for(const a of e.regulatoryAdjustments){assert.ok(source.textOriginal.includes(a.textPt));assert.ok(source.textEs.includes(a.textEs));assert.deepEqual(a.textPt.match(/\d+/g),a.textEs.match(/\d+/g));}
 assert.equal(e.externalRevocations.length,1);assert.equal(e.externalRevocations[0].reference,'RI-JET anterior');assert.match(e.limitsEs,/no posterga toda la aprobación/);assert.match(e.limitsEs,/sólo en lo que no contradiga/);assert.ok(e.targets.includes('SC-2026-CCXXI'));assert.ok(e.targets.includes('SC-2026-CC'));
 for(const id of ['CI-art-97','CI-nota-331']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);assert.ok(effectsFor(r,c).some(x=>x.source===e.source));}
 assert.notEqual(by.get('SC-2026-CC').status,'revocada-2026');assert.match(makeAnswer('Educación teológica',[by.get('CI-art-97')],c,{language:'es'}),/29 ajustes a–cc/);
});
test('SNTA, himno y FEP conservan autorización, condiciones y observaciones sin presumir ejecución',()=>{
 const s=effects.find(e=>e.source==='SC-2026-CLXXXII');assert.equal(s.kind,'structure-and-budget-approved');assert.match(s.noteEs,/aprobación de la CE/);assert.match(s.noteEs,/0,28% a 1,0%/);assert.match(s.limitsEs,/0,72 puntos porcentuales/);assert.match(s.limitsEs,/No acredita nombramientos efectivos ni desembolsos/);
 assert.equal(by.get('CI-art-106').integratedTextEs,undefined);assert.equal(by.get('RI-SC-art-47').integratedTextEs,undefined);assert.match(makeAnswer('Secretarías',[by.get('CI-art-106')],c,{language:'pt'}),/0,28% a 1,0%/);
 assert.match(effects.find(e=>e.source==='SC-2026-CLXXXIV').limitsEs,/ni acredita que una edición material/);const f=effects.find(e=>e.source==='SC-2026-CLXXVIII');assert.match(f.limitsEs,/2022–2024/);assert.match(f.limitsEs,/sin inventar atestado externo/);assert.match(effects.find(e=>e.source==='SC-2026-CLXXXIX').limitsEs,/no se presenta como reforma ya promulgada/);
 assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);assert.equal(c.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
