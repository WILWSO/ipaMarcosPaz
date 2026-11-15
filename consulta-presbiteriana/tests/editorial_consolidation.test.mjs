import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeBilingualAnswer} from '../src/lib/search.mjs';
const corpus=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const read=name=>readFileSync(new URL(`../documentos/${name}`,import.meta.url),'utf8');
test('consolidated supplements cover every decision once, preserve full texts and flag revoked antecedent',()=>{
 const records=corpus.records.filter(r=>r.source==='digesto');
 for(const lang of ['es','pt']){
  const text=read(`suplemento_normativo_2026_${lang}.md`);
  assert.equal((text.match(/<a id="/g)||[]).length,398);
  for(const r of records){assert.ok(text.includes(`<a id="${r.id}"></a>`));assert.ok(text.includes(r[lang==='es'?'textEs':'textOriginal']));}
  assert.match(text,lang==='es'?/Antecedente revocado por CE-2026-CXIX/:/Antecedente revogado por CE-2026-CXIX/);
 }
 assert.equal(corpus.metadata.editorialConsolidationProgress.editorialFinalReviewComplete,false);
});
test('editorial correction restores source meaning with valid review hash and does not corrupt proper names',()=>{
 const r=corpus.records.find(r=>r.id==='CI-nota-259');assert.match(r.textEs,/sínodos interesados e involucrados realizar las gestiones/);
 assert.ok(!r.textEs.includes('interesados e interesados'));assert.ok(r.textOriginal.includes('interessados e envolvidos'));
 assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash);
 assert.ok(read('constitucion_2025_es_revisada.md').includes(r.textEs));
 const audit=JSON.parse(read('revision_editorial_consolidacion_2026.json'));assert.equal(audit.automaticSignalReviews.length,9);
 assert.ok(audit.automaticSignalReviews.every(x=>x.classification==='proper-name-preserved'));
 const manualAudit=JSON.parse(read('auditoria_revision_manual.json'));assert.equal(manualAudit.manualPageAnnexReviewComplete,true);assert.equal(manualAudit.approvedAsDefinitiveSource,false);
});
test('current reports, downloads and exports reflect completed examination while preserving editorial limits',()=>{
 assert.ok(!read('revision_manual_2025_pt.md').includes('tem 260 decisões traduzidas'));
 assert.ok(!read('revision_manual_2025_es.md').includes('aún no tiene revisión integral'));
 for(const language of ['es','pt'])assert.match(makeBilingualAnswer('consulta',[],corpus,{language}),/398\/398/);
 const catalog=JSON.parse(read('estado_bilingue.json'));
 assert.ok(catalog.bilingualMarkdownDocuments.some(x=>x.es==='suplemento_normativo_2026_es.md'));
 const app=readFileSync(new URL('../src/routes/+page.svelte',import.meta.url),'utf8');
 for(const name of ['suplemento_normativo_2026_es','suplemento_normativo_2026_pt','revision_editorial_consolidacion_2026_es','revision_editorial_consolidacion_2026_pt'])assert.ok(app.includes(name));
});
