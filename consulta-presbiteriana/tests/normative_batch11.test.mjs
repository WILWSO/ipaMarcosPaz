import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=n=>JSON.parse(readFileSync(new URL('../'+n,import.meta.url)));
const c=read('static/corpus.json'),by=new Map(c.records.map(r=>[r.id,r])),batch=read('documentos/integracion_lote_11.json');
const effect=id=>c.normativeEffects.find(e=>e.source==='SC-2026-'+id),sha=s=>createHash('sha256').update(s).digest('hex');
test('referencias de Tribunal, plazos y quórum conservan alcance y fuente',()=>{
 assert.match(effect('LI').noteEs,/cuatro ministros y tres presbíteros/);assert.match(effect('LI').limitsEs,/CD art\. 26, pero corresponde a art\. 25/);assert.match(effect('LIII').noteEs,/tres meses, máximo cuatro meses y 90 días/);assert.match(effect('LIII').limitsEs,/No crea un plazo único nuevo/);assert.match(effect('LIV').noteEs,/informe cuatrienal a CE 2027/);assert.match(effect('XLVIII').noteEs,/11 pastores\/12 presbíteros/);assert.match(effect('XLVIII').limitsEs,/conjetura/);
 for(const id of ['CD-art-24','CD-art-25','CD-art-26','RI-SIN-art-10']){const r=by.get(id);assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);}
});
test('correcciones, informes incompletos y privacidad no reescriben las fuentes',()=>{
 assert.match(effect('XLIII').noteEs,/reimprimir acta 49/);assert.match(effect('XLIII').limitsEs,/no transforma la reunión/);assert.match(effect('XLI').limitsEs,/No reconstruye texto cortado/);assert.match(effect('XLII').limitsEs,/Campos vacíos no equivalen a actividad inexistente/);assert.match(effect('LII').limitsEs,/no prueban que no hubo actividades/);assert.match(effect('XLIV').limitsEs,/datos de recepción que ATAS art\. 12 prescribe/);assert.match(effect('XXXVIII').limitsEs,/No anula automáticamente elección/);assert.match(effect('XL').limitsEs,/no se convierte en aprobación expresa adicional/);assert.match(effect('XXXVI').limitsEs,/cinco Presbiterios/);
 const r=by.get('ATAS-art-12');assert.equal(r.integratedTextEs,undefined);assert.equal(sha(r.textEs),r.translationReview.translationHash);assert.match(r.textOriginal,/endereço completo/);
});
test('lote 11 conserva veinte textos completos y distingue efectos de artículos sustituidos',()=>{
 assert.equal(batch.ids.length,20);assert.ok(batch.ids.every(id=>!c.normativeEffects.find(e=>e.source===id).patchApplied));
 for(const lang of ['es','pt']){const t=readFileSync(new URL('../documentos/integracion_normativa_lote_11_2026_'+lang+'.md',import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(m=>m[1]),batch.ids);assert.match(t,/210\/398/);assert.match(t,/188/);}
 assert.equal(c.metadata.normativeIntegrationProgress.reviewedDecisions,398);assert.equal(c.metadata.normativeIntegrationProgress.pendingDecisions,0);assert.equal(c.metadata.normativeIntegrationProgress.nextId,null);assert.equal(c.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(c.amendments.length,6);assert.equal(c.metadata.normativeIntegrationProgress.integrationComplete,false);
});
