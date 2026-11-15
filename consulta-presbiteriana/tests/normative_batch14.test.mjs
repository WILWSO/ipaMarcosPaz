import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_14.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='CE-2026-'+id);
test('autorizaciones patrimoniales conservan objeto concreto y distinguen escritura de autorización',()=>{
 assert.match(effect('CLIII').limitsEs,/rerratificación/);assert.match(effect('CLI').limitsEs,/garantía inmobiliaria/);assert.match(effect('CXLVI').limitsEs,/No transfiere propiedad/);assert.match(effect('CXLIV').limitsEs,/no aprueban donación/);assert.match(effect('CXLIII').limitsEs,/no acredita escritura/);assert.match(effect('CXLVII').noteEs,/12 asientos/);assert.match(effect('CXLVII').limitsEs,/no cambia régimen contable/);
 assert.match(effect('CXXXVI').limitsEs,/no equivale a rechazo definitivo/);assert.match(effect('CXXXVI').noteEs,/CE2027/);
});
test('procedimientos constitucionales y estatuto IBN no sustituyen artículos generales del Manual',()=>{
 assert.match(effect('CXLII').limitsEs,/no aprueba reforma/);assert.match(effect('CXLII').limitsEs,/quórum de CI141/);assert.match(effect('CXLI').noteEs,/31 artículos/);assert.match(effect('CXLI').limitsEs,/registro y publicación/);assert.match(effect('CXLI').limitsEs,/artículo 4 transcrito difiere/);assert.match(effect('CXXXVII').noteEs,/secreto, seguridad/);assert.match(effect('CXXXVII').limitsEs,/no elimina voto secreto/);assert.match(effect('CXXXIX').limitsEs,/no elimina la excepción/);assert.match(effect('CXXXVIII').limitsEs,/no se transforma en autorización previa/);
 for(const id of ['CI-art-141','CI-art-47','CI-art-63','CI-art-64','CI-art-67','RI-SC-art-3','CI-art-104','CI-art-106']){const r=by.get(id);if(id!=='CI-art-64')assert.equal(r.integratedTextEs,undefined);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);}
});
test('revocación externa GTSI preserva discrepancia LXXIII y no declara reformas aprobadas',()=>{
 const e=effect('CXXXV');assert.match(e.limitsEs,/LXXIII/);assert.match(e.limitsEs,/no aprueba reformas GTSI/);assert.equal(e.externalRevocations.length,2);for(const rev of e.externalRevocations)assert.ok(by.get(e.source).textOriginal.includes(rev.evidencePt));assert.match(effect('CXL').limitsEs,/No prohíbe toda transferencia/);
 assert.equal(batch.ids.length,20);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));
 for(const lang of ['es','pt']){const doc=readFileSync(new URL('../documentos/integracion_normativa_lote_14_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...doc.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(doc,/270\/398/);assert.match(doc,/128/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalClauseRepeals,1);assert.equal(c.metadata.normativeIntegrationProgress.textPatches.additionalCaputReplacements,1);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
