import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {confirmationsFor,makeAnswer,makeBilingualAnswer,reading} from '../src/lib/search.mjs';
const c=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const by=new Map(c.records.map(r=>[r.id,r]));
const data=JSON.parse(readFileSync(new URL('../documentos/pendientes_confirmacion_documental_2026.json',import.meta.url)));
test('seven reviewed issue groups are associated only with their declared documentary sources',()=>{
 assert.deepEqual(c.documentaryConfirmations,data.items);
 assert.equal(c.metadata.documentaryConfirmationProgress.resolvedSelectedGroups,2);assert.equal(c.metadata.documentaryConfirmationProgress.openSelectedGroups,5);
 for(const item of data.items.filter(x=>['open','partially-resolved'].includes(x.status)))for(const source of item.sources)assert.ok(confirmationsFor(by.get(source.id),c).some(x=>x.id===item.id));
 assert.deepEqual(confirmationsFor(by.get('CI-art-1'),c),[]);assert.deepEqual(confirmationsFor(by.get('CI-art-84'),c),[]);assert.deepEqual(confirmationsFor(by.get('SC-2026-CXXIII'),c),[]);
 assert.deepEqual(confirmationsFor(by.get('CI-art-49'),c).map(x=>x.id),['P01']);
 const closed={...c,documentaryConfirmations:c.documentaryConfirmations.map(x=>({...x,status:'closed'}))};assert.deepEqual(confirmationsFor(by.get('CI-art-49'),closed),[]);
 assert.deepEqual(confirmationsFor(by.get('CI-art-49'),{...c,documentaryConfirmations:undefined}),[]);
});
test('historical and integrated exports preserve pending interpretation in each language',()=>{
 const issue=data.items.find(x=>x.id==='P01');
 for(const lang of ['es','pt'])for(const integrated of [false,true]){
  const article=by.get('CI-art-49');const text=makeBilingualAnswer('voto jubilado',[article],c,{language:lang,integrated});
  assert.ok(text.includes(issue[lang==='pt'?'findingPt':'findingEs']));assert.ok(text.includes('— P01'));assert.ok(text.includes(reading(article,lang,integrated).text));
 }
 assert.ok(makeAnswer('voto jubilado',[by.get('CI-art-49')],c).includes(issue.findingEs));
 const plain=makeBilingualAnswer('Art. 1',[by.get('CI-art-1')],c,{language:'es'});assert.ok(!plain.includes('Confirmación documental pendiente — P01'));
});
test('seminary limitations and source discrepancies remain explicit without changing normative text',()=>{
 const semin=by.get('SC-2026-CLXXXV');const text=makeBilingualAnswer('seminarios',[semin],c,{language:'es',integrated:true});
 assert.ok(text.includes(data.items.find(x=>x.id==='P04').findingEs));assert.ok(text.includes(semin.textEs));
 assert.ok(makeAnswer('jubilación',[by.get('CE-2026-XLIV')],c).includes(data.items.find(x=>x.id==='P07').findingEs));
 assert.equal(c.metadata.documentaryConfirmationProgress.confirmationComplete,false);assert.equal(c.metadata.crossHistoricalCompatibilityProgress.candidateReviewComplete,true);assert.equal(c.metadata.crossHistoricalCompatibilityProgress.globalCompatibilityReviewComplete,false);
});
