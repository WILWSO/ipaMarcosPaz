import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_21.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('reforma de sentencia conserva afastamento y restauración no fusiona variantes nominales',()=>{
 assert.match(effect('VIII').noteEs,/de deposición a afastamento/);assert.match(effect('VIII').limitsEs,/sin convertir afastamento en absolución/);assert.match(effect('VII').noteEs,/CD134 d/);assert.match(effect('VII').limitsEs,/sin identificar automáticamente/);assert.match(effect('VII').limitsEs,/Cavalcanti/);assert.ok(effect('VII').targets.includes('CE-2026-V'));assert.match(effect('IX').limitsEs,/Carlim en título y Carlin/);
});
test('bajas bajo CI48 distinguen exoneración y deposición sin condenas o cambio de membresía inferidos',()=>{
 assert.match(effect('VI').limitsEs,/exoneración administrativa/);assert.match(effect('VI').limitsEs,/sin atribuir condena/);assert.match(effect('V').noteEs,/21 nombres/);assert.match(effect('V').noteEs,/quórum de dos tercios/);assert.match(effect('V').limitsEs,/No deduce falta disciplinaria/);assert.match(effect('IV').noteEs,/15 nombres/);assert.match(effect('IV').limitsEs,/cierre editorial del Digesto/);
 for(const id of ['CI-art-48','CD-art-9','CD-art-134','CI-art-49']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
});
test('examen alcanza todas las 398 fuentes y cero pendientes, sin certificar edición definitiva',()=>{
 const p=c.metadata.normativeIntegrationProgress;assert.equal(p.reviewedDecisions,398);assert.equal(p.pendingDecisions,0);assert.equal(p.nextId,null);assert.equal(p.reviewComplete,true);assert.equal(p.integrationComplete,false);assert.equal(p.externalCertification,false);assert.equal(c.metadata.spanishManualApprovedAsDefinitiveSource,false);assert.deepEqual(p.pendingIds,[]);assert.equal(new Set(c.normativeEffects.map(e=>e.source)).size,398);assert.deepEqual(new Set(p.reviewedIds),new Set(c.records.filter(r=>r.source==='digesto').map(r=>r.id)));
 assert.equal(batch.ids.length,8);assert.equal(batch.nextId,null);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));assert.equal(c.amendments.length,6);assert.equal(p.textPatches.additionalClauseRepeals,1);assert.equal(p.textPatches.additionalCaputReplacements,1);
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_21_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/398\/398/);assert.match(t,/0 (?:pendientes|pendentes)/);assert.doesNotMatch(t,/(?:Siguiente examen|Próximo exame): None/);}
 assert.match(by.get('CE-2026-IV').textOriginal,/Foram encontradas 398 resoluções/);
});
