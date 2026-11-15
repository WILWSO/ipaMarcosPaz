import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reading,createIndex,search,makeAnswer} from '../src/lib/search.mjs';
const corpus=JSON.parse(readFileSync(new URL('../static/corpus.json',import.meta.url)));
const byid=new Map(corpus.records.map(r=>[r.id,r]));
const pendingFixture={...byid.get('CE-2026-X'),textEs:null,translationReview:undefined};
test('Digesto 372–391: jubilaciones completas, fechas incompatibles y siglas',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_372_391.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);assert.match(r.textEs,/sin cargas para la IPB/);assert.match(r.textEs,/Diploma de Jubilación y la Medalla del Mérito/);assert.match(r.textEs,/Medalla de la Gratitud/);assert.equal(r.status,'aprobada');}
 assert.match(byid.get('CE-2026-XXVI').textEs,/§ 2º y § 6º/);assert.match(byid.get('CE-2026-XXIII').textEs,/Elizier[\s\S]+Eliezier/);assert.match(byid.get('CE-2026-XXIII').textEs,/2015 2025/);assert.match(byid.get('CE-2026-XX').textEs,/Belo Horizaonte/);assert.match(byid.get('CE-2026-XX').textEs,/1959- 2009/);assert.match(byid.get('CE-2026-XIX').textEs,/FRAF/);assert.match(byid.get('CE-2026-XVIII').textEs,/42 años/);assert.match(byid.get('CE-2026-XIV').textEs,/PAIP de Messejana/);assert.match(byid.get('CE-2026-XIII').textEs,/D\?Oeste/);assert.match(byid.get('CE-2026-XII').textEs,/17\/03\/1978/);assert.match(byid.get('CE-2026-XII').textEs,/08\/01\/1989/);assert.match(byid.get('CE-2026-XI').textEs,/c\. Actividades Conciliares: V\./);
 for(const n of ['digesto_lote_372_391_2026_es_revisado.md','digesto_lote_372_391_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/391\/398/);assert.match(t,/7 pendientes|7 pendentes/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 352–371: jubilaciones íntegras y anomalías sin armonizar',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_352_371.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);assert.match(r.textEs,/sin cargas para la IPB/);assert.match(r.textEs,/Diploma de Jubilación y la Medalla del Mérito/);assert.match(r.textEs,/Medalla de la Gratitud/);assert.equal(r.status,'aprobada');}
 assert.match(byid.get('CE-2026-L').textEs,/§s 1º y 2º/);assert.match(byid.get('CE-2026-XLIII').textEs,/Art\. 49, § 6º/);assert.match(byid.get('CE-2026-XLIX').textEs,/Clovis[\s\S]+Clóvis/);assert.match(byid.get('CE-2026-XLIX').textEs,/en memoria/);assert.equal((byid.get('CE-2026-XLVIII').textEs.match(/\bV\. /g)||[]).length,2);assert.match(byid.get('CE-2026-XLI').textEs,/Melbose/);assert.match(byid.get('CE-2026-XXXIX').textEs,/2206\/2010/);assert.match(byid.get('CE-2026-XXXVI').textEs,/Alexandria, RH/);assert.match(byid.get('CE-2026-XXXVI').textEs,/PNOM/);assert.equal((byid.get('CE-2026-XXXVI').textEs.match(/medalla de la Gratitud/gi)||[]).length,2);assert.match(byid.get('CE-2026-XXXIV').textEs,/PNTR[\s\S]+PNRT/);assert.match(byid.get('CE-2026-XXXIV').textEs,/Antônio Leandro Milena/);assert.match(byid.get('CE-2026-XXXII').textEs,/Pau D\?alho/);assert.match(byid.get('CE-2026-XXXII').textEs,/sus hijas[\s\S]+Luiz Fernando/);assert.match(byid.get('CE-2026-XXXI').textEs,/Wagner[\s\S]+Vagner/);assert.match(byid.get('CE-2026-XXXI').textEs,/c\. Actividades Conciliares: V\./);
 for(const n of ['digesto_lote_352_371_2026_es_revisado.md','digesto_lote_352_371_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/371\/398/);assert.match(t,/27/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 332–351: excepciones contables, Guará, suspensión y jubilaciones completas',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_332_351.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 assert.match(byid.get('CE-2026-LXV').textEs,/registro formal de la jornada de trabajo/);assert.match(byid.get('CE-2026-LXIV').textEs,/no contiene un informe concluyente/);assert.match(byid.get('CE-2026-LXIV').textEs,/plazo de 60 días/);assert.doesNotMatch(byid.get('CE-2026-LXIV').textEs.split('II. Aprobar')[1].split('III.')[0],/Noroeste/);
 const appeal=byid.get('CE-2026-LXIII').textEs;assert.match(appeal,/Reconocer la legalidad del procedimiento/);assert.match(appeal,/Declarar nulos los demás actos/);assert.match(appeal,/disolución del Presbitério de Guará/);assert.match(appeal,/transfiera el Presbitério do Guará al Sínodo de Brasília \(SBS\)/);assert.match(appeal,/20h00 y 22h55/);assert.match(appeal,/b\)[\s\S]+d\) acto seguido/);assert.equal(byid.get('CE-2026-LXII').status,'procedimiento-pendiente');assert.match(byid.get('CE-2026-LXII').textEs,/no implica aprobación, acogida ni rechazo/);assert.match(byid.get('CE-2026-LXI').textEs,/sin que permita[\s\S]+una decisión concluyente/);assert.match(byid.get('CE-2026-LX').textEs,/no remitir la materia/);assert.match(byid.get('CE-2026-LIX').textEs,/todos para un mandato de dos años/);
 for(const id of ['LVIII','LVII','LVI','LV','LIV','LIII','LII','LI']){const t=byid.get('CE-2026-'+id).textEs;assert.match(t,/sin cargas para la IPB/);assert.match(t,/Diploma de Jubilación y la Medalla del Mérito/);assert.match(t,/Medalla de la Gratitud/);assert.equal(byid.get('CE-2026-'+id).status,'aprobada');}assert.match(byid.get('CE-2026-LVIII').textEs,/§ 1º y 2º/);assert.match(byid.get('CE-2026-LVII').textEs,/§ 2º y 6º/);assert.match(byid.get('CE-2026-LVI').textEs,/§ 3º/);assert.match(byid.get('CE-2026-LIV').textEs,/PRMT/);assert.match(byid.get('CE-2026-LIII').textEs,/Cláudio Reis[\s\S]+Claudio Reis/);assert.match(byid.get('CE-2026-LI').textEs,/Riveiro Fagundes/);
 for(const n of ['digesto_lote_332_351_2026_es_revisado.md','digesto_lote_332_351_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/351\/398/);assert.match(t,/47/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 312–331: sínodos, ratificación, registro y exceso contable',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_312_331.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 assert.match(byid.get('CE-2026-LXXXIX').textEs,/excluya al PCEC/);assert.match(byid.get('CE-2026-LXXXVIII').textEs,/Aprobar la creación del Sínodo Alphaville São Paulo/);assert.equal((byid.get('CE-2026-LXXXVIII').textEs.match(/\bV - /g)||[]).length,2);assert.match(byid.get('CE-2026-LXXXVI').textEs,/PRCV/);assert.match(byid.get('CE-2026-LXXXVI').textEs,/PRER/);assert.equal(byid.get('CE-2026-LXXXIV').status,'procedimiento-pendiente');assert.doesNotMatch(byid.get('CE-2026-LXXXIV').textEs,/Aprobar/);
 const school=byid.get('CE-2026-LXXXIII').textEs;assert.match(school,/CNPJ 32/);assert.match(school,/\?\?\? 34/);assert.match(school,/2\/3 \(dos tercios\) de los Asociados/);assert.match(school,/entidades benéficas certificadas o a entidades públicas/);assert.match(school,/ratificar la decisión/);const lease=byid.get('CE-2026-LXXXII').textEs;assert.match(lease,/Mackenzie - IPB/);assert.match(lease,/siempre que sean compatibles/);assert.match(lease,/exclusivamente a financiar actividades institucionales/);
 const missions=byid.get('CE-2026-LXXXI').textEs;assert.match(missions,/ya fue anotada en el registro/);assert.match(missions,/futuras modificaciones estatutarias/);assert.match(missions,/antes de llevar el documento al registro/);assert.match(missions,/liquidado el pasivo/);assert.match(missions,/parte fiel a la Igreja Presbiteriana do Brasil/);const acre=byid.get('CE-2026-LXXX').textEs;assert.match(acre,/Secretário-Executivo/);assert.match(acre,/antes de registrar/);assert.match(acre,/notas al pie deben excluirse/);
 const audit=byid.get('CE-2026-LXXIV').textEs;assert.match(audit,/44,59%/);assert.match(audit,/Aprobar los informes/);assert.match(audit,/no fue analizado ni aprobado previamente/);assert.equal(byid.get('CE-2026-LXXIV').status,'aprobada');assert.match(byid.get('CE-2026-LXXI').textEs,/Tesorero del Supremo Concilio/);
 for(const n of ['digesto_lote_312_331_2026_es_revisado.md','digesto_lote_312_331_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/331\/398/);assert.match(t,/67/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 292–311: sustento discrecional, modificación actas y siglas sugeridas',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_292_311.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 assert.match(byid.get('CE-2026-CIX').textEs,/vicio de tramitación/);assert.match(byid.get('CE-2026-CVIII').textEs,/uno para la Dirección y otro para la Comisión Ejecutiva/);assert.equal(byid.get('CE-2026-CVII').status,'procedimiento-pendiente');assert.equal(byid.get('CE-2026-CVI').status,'procedimiento-pendiente');
 const support=byid.get('CE-2026-CIV').textEs.split('RESUELVE:')[1];assert.match(support,/pudiendo este procurar proveer su sustento/);assert.match(support,/realidad financiera del concilio/);assert.match(support,/a su exclusivo criterio/);assert.match(support,/plazo razonable/);assert.doesNotMatch(support,/hasta un año/);assert.match(support,/próxima RO SC\/IPB 2026/);
 const draft=byid.get('CE-2026-CIII').textEs;assert.match(draft,/elaboren mediante diálogo el anteproyecto/);assert.match(draft,/en 2027/);assert.match(draft,/II - determinar[\s\S]+IV - determinar[\s\S]+V - rogar/);assert.equal(byid.get('CE-2026-CIII').status,'procedimiento-pendiente');const change=byid.get('CE-2026-CII').textEs;assert.match(change,/promover la modificación del art\. 3º/);assert.match(change,/primera hoja, que no será numerada/);assert.match(change,/última hoja, que tampoco será numerada/);assert.match(change,/publicación de la modificación/);assert.match(byid.get('ATAS-art-3').textEs,/primera página numerada/);
 assert.match(byid.get('CE-2026-CI').textEs,/si es posible[\s\S]+PRSG/);assert.match(byid.get('CE-2026-XCVI').textEs,/33\.172\.422\/0001-01/);assert.match(byid.get('CE-2026-XCIII').textEs,/manteniendo la misma Sigla PCEM/);assert.match(byid.get('CE-2026-XCII').textEs,/Leste Metropolitano de Campinas/);assert.match(byid.get('CE-2026-XCII').textEs,/Metropolitano Leste de Campinas/);assert.match(byid.get('CE-2026-XCI').textEs,/PMAS/);
 for(const n of ['digesto_lote_292_311_2026_es_revisado.md','digesto_lote_292_311_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/311\/398/);assert.match(t,/87/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 282–291: planes, competencia, membresía y voz sin voto',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_282_291.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,10);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 assert.match(byid.get('CE-2026-CXX').textEs,/Remitir la materia a la CRIE/);assert.match(byid.get('CE-2026-CXIX').textEs,/elabore un plan/);assert.match(byid.get('CE-2026-CXIX').textEs,/no remitir al SC\/IPB - 2026/);assert.match(byid.get('CE-2026-CXVIII').textEs,/antes de cualquier contratación o desarrollo/);assert.match(byid.get('CE-2026-CXVIII').textEs,/elabore un estudio de viabilidad técnica y financiera/);assert.equal(byid.get('CE-2026-CXVIII').status,'procedimiento-pendiente');
 assert.match(byid.get('CE-2026-CXVII').textEs,/no puede solicitar la transferencia/);assert.match(byid.get('CE-2026-CXVII').textEs,/membresía conciliar se produce en el propio acto/);assert.match(byid.get('CE-2026-CXVII').textEs,/independientemente de la lectura/);assert.match(byid.get('CE-2026-CXVI').textEs,/prohibido únicamente el ejercicio del voto/);assert.match(byid.get('CE-2026-CXVI').textEs,/manifestaciones y argumentos/);assert.match(byid.get('CE-2026-CXV').textEs,/REPARI/);assert.match(byid.get('CE-2026-CXV').textEs,/REPAPI/);assert.match(byid.get('CE-2026-CXV').textEs,/Devolver el documento/);assert.match(byid.get('CE-2026-CXIV').textEs,/59-A/);assert.match(byid.get('CE-2026-CXIV').textEs,/Remitir la materia/);assert.match(byid.get('CE-2026-CXIII').textEs,/continúe con el compromiso de transferencia mensual/);assert.match(byid.get('CE-2026-CXII').textEs,/no es una carta de membresía común/);assert.match(byid.get('CE-2026-CXI').textEs,/facultad, y no la obligatoriedad/);assert.match(byid.get('CE-2026-CXI').textEs,/VI\. Aclarar[\s\S]+V\. Rogar/);
 for(const n of ['digesto_lote_282_291_2026_es_revisado.md','digesto_lote_282_291_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/291\/398/);assert.match(t,/107/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 272–281: cifras documentales, archivo y estudio sin aprobación definitiva',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_272_281.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,10);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 const college=byid.get('CE-2026-CXXIX').textEs;assert.match(college,/-13,98%/);assert.match(college,/13,6%/);assert.match(college,/41% \(76 profesores\)/);assert.match(college,/32% \(86 empleados/);assert.match(college,/informe de 2025 tampoco llegó/);assert.match(college,/Recibir el documento/);assert.doesNotMatch(college,/Aprobar las cuentas/);assert.match(byid.get('CE-2026-CXXVIII').textEs,/2026\/2032/);assert.match(byid.get('CE-2026-CXXVIII').textEs,/2026\/2030/);assert.match(byid.get('CE-2026-CXXVII').textEs,/103,36%/);assert.match(byid.get('CE-2026-CXXVII').textEs,/Tomar conocimiento íntegramente/);
 assert.equal(byid.get('CE-2026-CXXVI').status,'archivada-sin-objeto');assert.equal(byid.get('CE-2026-CXXV').status,'rechazada');assert.equal(byid.get('CE-2026-CXXIV').status,'archivada-sin-objeto');assert.match(byid.get('CE-2026-CXXIV').textEs,/25 años \(renovables\)/);assert.equal(byid.get('CE-2026-CXXIII').status,'procedimiento-pendiente');assert.match(byid.get('CE-2026-CXXIII').textEs,/estudios complementarios/);assert.match(byid.get('CE-2026-CXXII').textEs,/autorizando y facilitando el lanzamiento/);assert.match(byid.get('CE-2026-CXXI').textEs,/estudio de viabilidad técnica y financiera/);assert.match(byid.get('CE-2026-CXXI').textEs,/últimos 06 meses/);assert.match(byid.get('CE-2026-CXXI').textEs,/hasta 05 años/);assert.match(byid.get('CE-2026-CXXI').textEs,/sin cargas financieras para la JMN/);
 for(const n of ['digesto_lote_272_281_2026_es_revisado.md','digesto_lote_272_281_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/281\/398/);assert.match(t,/117/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 262–271: admisibilidad, competencias y formalización patrimonial',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_262_271.json',import.meta.url),'utf8'));assert.equal(batch.ids.length,10);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 assert.match(byid.get('CE-2026-CXL').textEs,/Recibir y estimar el recurso/);assert.match(byid.get('CE-2026-CXL').textEs,/declarar nulo el acto/);assert.match(byid.get('CE-2026-CXL').textEs,/como aspirante al Ministerio/);assert.match(byid.get('CE-2026-CXL').textEs,/Jonatas/);assert.match(byid.get('CE-2026-CXL').textEs,/Jônatas/);assert.match(byid.get('CE-2026-CXXXIX').textEs,/No admitir el recurso/);assert.match(byid.get('CE-2026-CXXXIX').textEs,/agotamiento del plazo/);assert.match(byid.get('CE-2026-CXXXVIII').textEs,/con antelación una comunicación formal/);
 const electoral=byid.get('CE-2026-CXXXVII').textEs;assert.match(electoral,/no acoger la propuesta/);assert.match(electoral,/uso regular del sistema iCalvinus/);assert.match(electoral,/secreto del voto/);assert.match(byid.get('CE-2026-CXXXVI').textEs,/no decidir sobre la implementación/);assert.match(byid.get('CE-2026-CXXXVI').textEs,/al menos diez años/);assert.equal(byid.get('CE-2026-CXXXVI').status,'procedimiento-pendiente');assert.match(byid.get('CE-2026-CXXXV').textEs,/Docs\. LXXIII, LXXXIV/);assert.match(byid.get('CE-2026-CXXXV').textEs,/Docs\. LXXXIII, LXXXIV/);assert.match(byid.get('CE-2026-CXXXV').textEs,/práctica recomendable, pero no una exigencia formal/);
 const manual=byid.get('CE-2026-CXXXIV').textEs;assert.match(manual,/quedando revocada, en este punto/);assert.match(manual,/publique también una edición/);assert.match(manual,/acceso gratuito al pueblo presbiteriano/);assert.match(byid.get('CE-2026-CXXXIII').textEs,/sucesión de activos, pasivos y obligaciones/);assert.match(byid.get('CE-2026-CXXXIII').textEs,/necesarios para formalizar el acto/);assert.match(byid.get('CE-2026-CXXXII').textEs,/hasta el año 2038/);assert.match(byid.get('CE-2026-CXXXII').textEs,/cuatro parcelas/);assert.match(byid.get('CE-2026-CXXXI').textEs,/enero de 2027 \(2027\/2030\)/);
 for(const n of ['digesto_lote_262_271_2026_es_revisado.md','digesto_lote_262_271_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/271\/398/);assert.match(t,/127/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 261: IBN íntegro, 31 artículos, responsabilidad y vigencia condicionada',()=>{
 const r=byid.get('CE-2026-CXLI'),v=r.translationReview;const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_261.json',import.meta.url),'utf8'));
 assert.deepEqual(batch.ids,['CE-2026-CXLI']);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);
 const s=r.textEs.split('TRANSCRIPCIÓN DEL ESTATUTO')[1];assert.ok(s);assert.deepEqual([...s.matchAll(/Art\. (\d+)[º. ]/g)].map(x=>+x[1]),Array.from({length:31},(_,i)=>i+1));assert.equal((s.match(/CAPÍTULO [IVX]+ - /g)||[]).length,9);
 assert.match(s,/mediante dictamen previo de la Junta de Educación Teológica/);assert.match(s,/haberes mensuales/);assert.doesNotMatch(s,/siempre que sean civilmente capaces/);assert.match(s,/cuórum mínimo de 05 \(cinco\) miembros/);assert.match(s,/voto favorable de 06 \(seis\)/);assert.match(s,/ant[e]?lación mínima de 08 \(ocho\) días/);assert.match(s,/antelación mínima de treinta \(30\) días/);assert.match(s,/oposición formal registrada en acta/);assert.match(s,/derecho de repetición/);assert.match(s,/ni siquiera subsidiariamente/);assert.match(s,/junto con el Capellán/);assert.match(s,/cada trimestre/);assert.match(s,/aprobación final por el asociado vitalicio/);assert.match(s,/previa manifestación favorable del asociado vitalicio/);assert.match(s,/una vez registrado en el Registro competente, en la fecha de su publicación/);assert.match(r.textEs,/Art\. 28 - 0 Estatuto/);assert.equal(r.status,'aprobada-con-transicion');
 for(const n of ['digesto_lote_261_2026_es_revisado.md','digesto_lote_261_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/261\/398/);assert.match(t,/137/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Digesto 251–260: garantías, remisiones y prórroga sin reforma aprobada',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_251_260.json',import.meta.url),'utf8'));
 assert.equal(batch.ids.length,10);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const r=byid.get(id),v=r.translationReview;assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),v.translationHash);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g));assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 assert.match(byid.get('CE-2026-CLI').textEs,/dar en garantía el inmueble/);assert.match(byid.get('CE-2026-CL').textEs,/No atender, por ahora/);assert.match(byid.get('CE-2026-CL').textEs,/\? conveniencia/);assert.equal(byid.get('CE-2026-CXLIX').status,'procedimiento-pendiente');assert.match(byid.get('CE-2026-CXLIX').textEs,/aprobación, si corresponde/);assert.match(byid.get('CE-2026-CXLVIII').textEs,/41ª Reunión/);assert.match(byid.get('CE-2026-CXLVII').textEs,/continúa siendo de devengo/);assert.match(byid.get('CE-2026-CXLVII').textEs,/mínimo de 12 asientos anuales/);
 assert.match(byid.get('CE-2026-CXLVI').textEs,/excepto respecto al área/);assert.equal(byid.get('CE-2026-CXLV').status,'rechazada');assert.match(byid.get('CE-2026-CXLV').textEs,/compete al Consejo de Acción Social/);assert.equal(byid.get('CE-2026-CXLIV').status,'procedimiento-pendiente');assert.match(byid.get('CE-2026-CXLIV').textEs,/Reglamento Interno de la SE-SC/);assert.match(byid.get('CE-2026-CXLIII').textEs,/sin cargas para la IPB/);assert.match(byid.get('CE-2026-CXLII').textEs,/Prorrogar hasta el 30 de junio de 2026/);assert.match(byid.get('CE-2026-CXLII').textEs,/48,58%/);assert.match(byid.get('CE-2026-CXLII').textEs,/90,86%/);assert.equal(byid.get('CE-2026-CXLII').status,'procedimiento-pendiente');
 for(const n of ['digesto_lote_251_260_2026_es_revisado.md','digesto_lote_251_260_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/260\/398/);assert.match(t,/138/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Artigo y Artículo resuelven el mismo identificador en ambos idiomas',()=>{
 const index=createIndex(corpus);
 assert.deepEqual(search(index,'Artigo 84',{norm:'CI'}).map(x=>x.id),search(index,'Artículo 84',{norm:'CI'}).map(x=>x.id));
});
test('Digesto 392–398 cierra la cobertura sin aprobar la integración ni la revisión editorial',()=>{
 const batch=JSON.parse(readFileSync(new URL('../documentos/digesto_lote_392_398.json',import.meta.url),'utf8'));
 assert.deepEqual(batch.ids,['CE-2026-X','CE-2026-IX','CE-2026-VIII','CE-2026-VII','CE-2026-VI','CE-2026-V','CE-2026-IV']);assert.deepEqual(batch.pages,[352,353,354,355]);assert.equal(batch.nextId,null);
 const decisions=corpus.records.filter(r=>r.source==='digesto');assert.equal(decisions.length,398);
 assert.deepEqual(new Set(corpus.metadata.digestoReviewProgress.reviewedIds),new Set(decisions.map(r=>r.id)));assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);assert.equal(corpus.metadata.digestoReviewProgress.reviewComplete,true);assert.equal(corpus.metadata.translationComplete,true);
 for(const r of decisions){assert.ok(r.textEs,r.id);assert.equal(createHash('sha256').update(r.textOriginal).digest('hex'),r.translationReview.sourceHash,r.id);assert.equal(createHash('sha256').update(r.textEs).digest('hex'),r.translationReview.translationHash,r.id);assert.equal(reading(r,'es').pending,false);assert.equal(r.translationReview.externalCertification,false);}
 for(const id of batch.ids){const r=byid.get(id);assert.deepEqual(r.textEs.match(/\d+/g),r.textOriginal.match(/\d+/g),id);assert.equal((r.textEs.match(/§/g)||[]).length,(r.textOriginal.match(/§/g)||[]).length,id);}
 assert.match(byid.get('CE-2026-IX').textEs,/Carlim[\s\S]+Carlin/);assert.match(byid.get('CE-2026-VIII').textEs,/Tribunal del Sínodo Mojiana/);assert.match(byid.get('CE-2026-VIII').textEs,/suspensión por tiempo indeterminado/);assert.match(byid.get('CE-2026-VIII').textEs,/Sínodo Mojyana/);
 assert.match(byid.get('CE-2026-VII').textEs,/Cavalcante/);assert.match(byid.get('CE-2026-V').textEs,/Cavalcanti/);assert.match(byid.get('CE-2026-V').textEs,/Correa[\s\S]+Corrêa/);assert.match(byid.get('CE-2026-V').textEs,/Pedregosa[\s\S]+Pedregoza/);assert.match(byid.get('CE-2026-IV').textEs,/Nickson Rezende[\s\S]+Nickson Resende/);assert.match(byid.get('CE-2026-IV').textEs,/Luís Sérgio[\s\S]+Luiz Sergio/);assert.match(byid.get('CE-2026-IV').textEs,/Se encontraron 398 resoluciones\.$/);
 for(const [id,count] of [['CE-2026-VI',2],['CE-2026-V',21],['CE-2026-IV',15]]){const text=byid.get(id).textEs;assert.equal((text.match(/Comunicado de Exoneración Inciso/g)||[]).length,count);assert.match(text,/Registrar las siguientes deposiciones/);assert.equal((text.split('a saber:')[1].match(/\b[a-u]\. /g)||[]).length,count);}
 assert.equal(corpus.metadata.linguisticReviewComplete,false);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);assert.equal(corpus.amendments.length,6);
 const state=JSON.parse(readFileSync(new URL('../documentos/estado_bilingue.json',import.meta.url),'utf8'));assert.ok(state.documents.every(d=>d.translationComplete));assert.ok(state.documents.filter(d=>d.filename.includes('integrado')).every(d=>d.integrationComplete===false));
 assert.match(makeAnswer('CE-2026-IV',[byid.get('CE-2026-IV')],corpus,{language:'es'}),/398\/398 decisiones traducidas y cotejadas; revisión editorial final pendiente/);
 for(const name of state.digestoTwentySixthBatchDocuments){const text=readFileSync(new URL('../documentos/'+name,import.meta.url),'utf8');assert.deepEqual([...text.matchAll(/^## (CE-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(text,/398\/398/);assert.match(text,/0 pendientes|0 pendentes/);}
});
test('faltantes de español se muestran explícitamente como portugués',()=>{
 assert.equal(reading(pendingFixture,'es').pending,true);
 assert.equal(reading(pendingFixture,'es').language,'pt');
 assert.equal(reading(byid.get('CI-art-1'),'es').pending,false);
});
test('la integración conserva párrafos no sustituidos y todos los incisos',()=>{
 const a=byid.get('CI-art-84');
 assert.match(a.integratedTextPt,/até cinco anos/);
 assert.match(a.integratedTextPt,/Parágrafo único/);
 assert.match(a.integratedTextEs,/hasta cinco años/);
 assert.match(a.integratedTextEs,/Párrafo único/);
 const b=byid.get('CI-art-88');
 assert.match(b.integratedTextPt,/cassar suas candidaturas/);
 assert.match(b.integratedTextPt,/b\) conceder licença/);
 assert.match(b.integratedTextPt,/p\) eleger representantes/);
 assert.doesNotMatch(b.integratedTextPt,/a\) admitir, transferir, disciplinar/);
 assert.match(byid.get('CI-art-54').integratedTextPt,/§ 3º/);
});
test('exportación en portugués no introduce el texto español de las enmiendas',()=>{
 const output=makeAnswer('Artigo 84',[byid.get('CI-art-84')],corpus,{language:'pt',integrated:true});
 assert.match(output,/até cinco anos/);
 assert.doesNotMatch(output,/hasta cinco años/);
 const es=makeAnswer('CE-2026-X',[pendingFixture],corpus,{language:'es'});
 assert.match(es,/Traducción pendiente — original portugués/);
});
test('cada traducción conserva los marcadores de notas del original',()=>{
 for(const r of corpus.records.filter(r=>r.textEs))assert.deepEqual(r.textEs.match(/\[\d+\]/g),r.textOriginal.match(/\[\d+\]/g),r.id);
});
test('los seis documentos identifican su cobertura real',()=>{
 const state=JSON.parse(readFileSync(new URL('../documentos/estado_bilingue.json',import.meta.url)));
 assert.equal(state.documents.length,6);
 assert.equal(state.translationComplete,true);
 for(const doc of state.documents){
  const text=readFileSync(new URL('../documentos/'+doc.filename,import.meta.url),'utf8');
  if(doc.language==='es')assert.match(text,doc.translationComplete?/TRADUCCIÓN DE COBERTURA INTEGRAL/:/TRADUCCIÓN PARCIAL/);
  if(doc.filename.includes('integrado'))assert.equal(doc.integrationComplete,false);
 }
});
test('el Manual tiene cobertura integral y mantiene explícita la revisión pendiente',()=>{
 assert.equal(corpus.metadata.manualTranslationCoverageComplete,true);
 assert.equal(corpus.metadata.linguisticReviewComplete,false);
 assert.ok(corpus.records.filter(r=>r.source==='manual').every(r=>r.textEs || r.textOriginal === ''));
 const text=readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8');
 const pages=[...text.matchAll(/^## Página PDF (\d+)$/gm)].map(x=>Number(x[1]));
 assert.deepEqual(pages,Array.from({length:560},(_,i)=>i+1));
 assert.doesNotMatch(text,/\*\*Traducción pendiente\.\*\*/);
});

test('la revisión parcial no aprueba la traducción como fuente definitiva',()=>{
 assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
 assert.equal(corpus.metadata.semanticReviewProgress.reviewComplete,false);
 assert.equal(reading(byid.get('CI-art-49'),'es').approvedAsDefinitiveSpanishSource,false);
 assert.match(byid.get('CI-art-49').textEs,/no implica la pérdida/);
 assert.match(byid.get('CI-art-150').textEs,/copastores/);
 assert.doesNotMatch(byid.get('CI-art-150').textEs,/corazones/);
 assert.match(byid.get('CD-art-32').textEs,/manifiestamente improcedente/);
 const answer=makeAnswer('Artículo 49',[byid.get('CI-art-49')],corpus,{language:'es'});
 assert.match(answer,/NO APROBADO COMO FUENTE DEFINITIVA/);
});

test('Constitución histórica completa: artículos, notas, cotejo y enlaces',async()=>{
 const {createHash}=await import('node:crypto');
 const ci=corpus.records.filter(r=>r.norm==='CI');
 const hash=t=>createHash('sha256').update(t).digest('hex');
 assert.equal(ci.length,513);
 assert.equal(corpus.metadata.constitutionReviewProgress.reviewComplete,true);
 for(const r of ci){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 assert.equal(reading(byid.get('CI-art-84'),'es',true).comparativeReviewCompleteForUnit,false);
 const text=readFileSync(new URL('../documentos/constitucion_2025_es_revisada.md',import.meta.url),'utf8');
 assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:152},(_,i)=>i+1));
 assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),Array.from({length:361},(_,i)=>i+1));
 const anchors=new Set([...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]));
 for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.has(m[1]),m[1]);
 assert.match(text,/En nombre del Padre/);
 assert.doesNotMatch(text,/Página PDF 560|Anexo: traducción automática/);
});
test('se recuperan negaciones, sujetos y pasajes omitidos en notas',()=>{
 assert.match(byid.get('CI-nota-111').textEs,/CONSAGRACIÓN INTEGRAL/);
 assert.match(byid.get('CI-nota-122').textEs,/Rev\. \(Reverendo\)/);
 assert.match(byid.get('CI-nota-136').textEs,/Debe presentarse un informe médico/);
 assert.match(byid.get('CI-nota-191').textEs,/tres ministros y dos presbíteros/);
 assert.match(byid.get('CI-nota-263').textEs,/Congregaciones Presbiteriales también deberán remitir/);
 assert.match(byid.get('CI-nota-330').textEs,/REALICE UNA EVALUACIÓN/);
 assert.match(byid.get('CI-nota-350').textEs,/letra “a”/);
 assert.match(byid.get('CI-nota-351').textEs,/Secretario Ejecutivo/);
});

test('Código de Disciplina completo: cotejo, artículos, notas y enlaces',async()=>{
 const {createHash}=await import('node:crypto');
 const cd=corpus.records.filter(r=>r.norm==='CD');
 const hash=t=>createHash('sha256').update(t).digest('hex');
 assert.equal(cd.length,239);
 assert.equal(corpus.metadata.disciplineReviewProgress.reviewComplete,true);
 for(const r of cd){
  assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);
  assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);
  assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);
  assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);
 }
 const text=readFileSync(new URL('../documentos/codigo_disciplina_2025_es_revisado.md',import.meta.url),'utf8');
 assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:135},(_,i)=>i+1));
 assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),Array.from({length:104},(_,i)=>i+1));
 const anchors=new Set([...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]));
 for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.has(m[1]),m[1]);
 assert.match(text,/En nombre del Padre/);
 assert.match(text,/10ª — Del proceso sumarísimo ante el Consejo \[77\]\(#CD-nota-77\)/);
 assert.match(text,/Disposiciones finales \[103\]\(#CD-nota-103\)/);
 assert.doesNotMatch(text,/Anexo: traducción automática/);
 const manual=readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8');
 assert.ok(manual.includes(text));
});
test('disciplina: se restituyen requisitos, sujetos, plazos y excepción al efecto suspensivo',()=>{
 assert.match(byid.get('CD-art-48').textEs,/todos los escritos del proceso/);
 assert.match(byid.get('CD-art-42').textEs,/Toda queja o denuncia deberá hacerse por escrito/);
 assert.match(byid.get('CD-art-28').textEs,/se ha ausentado de las sesiones/);
 assert.doesNotMatch(byid.get('CD-art-28').textEs,/será detenido/);
 assert.match(byid.get('CD-nota-46').textEs,/concilio al que pertenece el denunciado, por medio del concilio al que pertenece el denunciante/);
 assert.match(byid.get('CD-art-121').textEs,/solo haya apelado el acusado, no podrá aumentarse la pena/);
 assert.match(byid.get('CD-art-122').textEs,/está impedido de votar/);
 assert.match(byid.get('CD-nota-86').textEs,/la omisión de ese acto impide que comience a correr el plazo/);
 assert.match(byid.get('CD-nota-95').textEs,/esta regla no se aplica al recurso extraordinario/);
 assert.match(byid.get('CD-nota-98').textEs,/a\) Que el artículo citado también se refiere/);
 assert.match(byid.get('CD-nota-104').textEs,/e\. Determinar/);
 assert.match(byid.get('CD-nota-100').textEs,/momentos y votaciones distintos/);
});

test('Liturgia completa: 44 artículos, 59 notas, revisión vigente e integración documental',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');
 const pl=corpus.records.filter(r=>r.norm==='PL');assert.equal(pl.length,103);assert.equal(corpus.metadata.liturgyReviewProgress.reviewComplete,true);assert.deepEqual(corpus.metadata.liturgyReviewProgress.pendingIds,[]);
 for(const r of pl){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);}
 const text=readFileSync(new URL('../documentos/principios_liturgia_2025_es_revisado.md',import.meta.url),'utf8');
 assert.equal([...text.matchAll(/^### Art\. \d+$/gm)].length,44);assert.equal([...text.matchAll(/^### Nota \d+$/gm)].length,59);assert.doesNotMatch(text,/Traducción automática; revisión comparada pendiente/);
 assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
});
test('Liturgia conserva cláusulas omitidas, prohibiciones, archivo y revocaciones históricas',()=>{
 assert.match(byid.get('PL-nota-15').textEs,/no los reciban si no aceptan las doctrinas/);
 assert.match(byid.get('PL-nota-15').textEs,/Declarar nula de pleno derecho la decisión CE-SC\/IPB/);
 assert.match(byid.get('PL-nota-28').textEs,/totalmente gratuito/);
 assert.match(byid.get('PL-nota-28').textEs,/parejas “mixtas” o no creyentes/);
 assert.match(byid.get('PL-nota-29').textEs,/celebrante archivará el certificado/);
 assert.match(byid.get('PL-nota-32').textEs,/no unjan personas o objetos/);
 assert.match(byid.get('PL-nota-40').textEs,/no a otras denominaciones presbiterianas/);
 assert.match(byid.get('PL-nota-50').textEs,/visados por abogados/);
});

test('Estatuto IPB completo: revisión vigente y 47 bloques con las 15 notas',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='EST-IPB');
 assert.equal(units.length,62);assert.equal(corpus.metadata.ipbStatuteReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);}
 const text=readFileSync(new URL('../documentos/estatuto_ipb_2025_es_revisado.md',import.meta.url),'utf8');assert.equal([...text.matchAll(/^### Art\. \d+/gm)].length,47);assert.equal([...text.matchAll(/^### Nota \d+$/gm)].length,15);
 assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 assert.match(text,/Texto introductorio\]?[\s\S]*EST-IPB-nota-1/);
});
test('Estatuto preserva la duplicación impresa y corrige cargos, poderes y prohibición',()=>{
 assert.match(byid.get('EST-IPB-art-21').textEs,/Secretario Ejecutivo/);assert.doesNotMatch(byid.get('EST-IPB-art-21').textEs,/Secretario de Estado|Secretario General/);
 assert.match(byid.get('EST-IPB-art-37').textEs,/Se prohíbe a la Comisión Ejecutiva/);
 assert.match(byid.get('EST-IPB-art-38').textEs,/otorgar un poder/);assert.match(byid.get('EST-IPB-art-43').textEs,/apoderado designado/);
 assert.match(byid.get('EST-IPB-art-44').textEs,/fiscalización|vigilancia/);assert.match(byid.get('EST-IPB-art-44-2').textEs,/podrá disolverse/);
 assert.match(byid.get('EST-IPB-art-44-2').textOriginal,/^Art\. 44\./);
});

test('RI-SC completo: 82 artículos y 3 notas con cotejo vigente y enlaces',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='RI-SC');
 assert.equal(units.length,85);assert.equal(corpus.metadata.supremeRulesReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['reglamento_sc_2025_es_revisado','regimento_sc_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');
  assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:82},(_,i)=>i+1));
  assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),[1,2,3]);
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);
  for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('RI-SC restituye dispensas, archivo, representación y excepción de plazos',()=>{
 assert.match(byid.get('RI-SC-art-12').textEs,/Se dispensará la lectura/);
 assert.match(byid.get('RI-SC-art-53').textEs,/apoderado creyente/);assert.doesNotMatch(byid.get('RI-SC-art-53').textEs,/fiscal/);
 assert.match(byid.get('RI-SC-art-74').textEs,/ordenará archivar el proceso/);
 assert.match(byid.get('RI-SC-art-78').textEs,/Salvo los plazos establecidos en el Código de Disciplina, los demás plazos podrán prorrogarse/);
 assert.match(byid.get('RI-SC-art-78').textEs,/Se suspende el curso del plazo/);
 assert.match(byid.get('RI-SC-nota-3').textEs,/siempre que se trate de una materia y posición ya decididas/);
 const numerals=t=>[...t.matchAll(/^([IVX]+)\s*-/gm)].map(m=>m[1]);assert.deepEqual(numerals(byid.get('RI-SC-art-35').textEs),['I','II','III','IV','V','IV','V']);
 const index=createIndex(corpus);const found=search(index,'plazos',{norm:'RI-SC'});assert.ok(found.some(r=>r.id==='RI-SC-art-78'));
 const answer=makeAnswer('plazos',found,corpus,{language:'es'});assert.match(answer,/Salvo los plazos establecidos/);assert.match(answer,/RI-SC-art-78/);
});

test('RI-CE completo: cotejo vigente, 37 artículos, tres notas y enlaces',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='RI-CE');
 assert.equal(units.length,40);assert.equal(corpus.metadata.executiveRulesReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['reglamento_ce_2025_es_revisado','regimento_ce_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');
  assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:37},(_,i)=>i+1));
  assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),[1,2,3]);
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);
  for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('RI-CE conserva prohibiciones, excepciones, mayorías y sujetos competentes',()=>{
 assert.match(byid.get('RI-CE-art-16').textEs,/Se prohíbe a la Comisión Ejecutiva/);
 assert.match(byid.get('RI-CE-art-16').textEs,/salvo cuando haya delegación del Supremo Concilio/);
 assert.match(byid.get('RI-CE-nota-3').textEs,/unanimidad de los votantes presentes/);
 assert.match(byid.get('RI-CE-nota-3').textEs,/no tiene competencia constitucional para dejar sin efecto/);
 assert.match(byid.get('RI-CE-art-22').textEs,/Se dispensará la lectura/);
 assert.match(byid.get('RI-CE-art-25').textEs,/entes autónomos y entidades paraeclesiásticas/);
 assert.match(byid.get('RI-CE-art-26').textEs,/Al ponente le corresponde encauzar el estudio/);
 assert.match(byid.get('RI-CE-art-9').textEs,/hasta treinta días/);
 assert.match(byid.get('RI-CE-art-9').textEs,/superior a treinta días/);
 const index=createIndex(corpus);const found=search(index,'Artículo 16',{norm:'RI-CE'});assert.ok(found.some(r=>r.id==='RI-CE-art-16'));
 const answer=makeAnswer('Artículo 16',found,corpus,{language:'es'});assert.match(answer,/Se prohíbe a la Comisión Ejecutiva/);assert.match(answer,/no tiene competencia constitucional para dejar sin efecto/);
});

test('Estatuto del Sínodo completo: 31 artículos, nueve notas, cotejo y espacios del modelo',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='EST-SIN');assert.equal(units.length,40);assert.equal(corpus.metadata.synodStatuteReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.deepEqual(r.textOriginal.match(/_+/g),r.textEs.match(/_+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['estatuto_sinodo_2025_es_revisado','estatuto_sinodo_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');
  assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:31},(_,i)=>i+1));
  assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),Array.from({length:9},(_,i)=>i+1));
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);
  for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('Estatuto del Sínodo restituye omisiones y conserva condiciones y referencias históricas',()=>{
 assert.match(byid.get('EST-SIN-art-2').textEs,/credenciales, el informe, la estadística y el libro de actas/);
 assert.match(byid.get('EST-SIN-art-7').textEs,/no responden solidaria ni subsidiariamente/);
 assert.match(byid.get('EST-SIN-art-7').textEs,/sin autorización expresa de su Plenario/);
 assert.match(byid.get('EST-SIN-art-31').textEs,/derecho adquirido, la cosa juzgada y el acto jurídico perfecto/);
 assert.match(byid.get('EST-SIN-art-18').textEs,/dos tercios de los presentes a la reunión especialmente convocada/);
 assert.match(byid.get('EST-SIN-art-30').textEs,/voto secreto de dos tercios de los miembros del Sínodo/);
 assert.match(byid.get('EST-SIN-nota-5').textEs,/no puede concederse a quien ejerce una función no remunerada/);
 assert.match(byid.get('EST-SIN-nota-5').textEs,/reembolsos por gastos realizados/);
 assert.match(byid.get('EST-SIN-nota-6').textEs,/siempre que no altere el sentido de las resoluciones/);
 assert.match(byid.get('EST-SIN-nota-9').textEs,/V - es inviolable la libertad de conciencia/);
 assert.match(byid.get('EST-SIN-nota-9').textEs,/están visados por abogados/);
 const index=createIndex(corpus);const found=search(index,'Artículo 7',{norm:'EST-SIN'});assert.ok(found.some(r=>r.id==='EST-SIN-art-7'));
 const answer=makeAnswer('Artículo 7',found,corpus,{language:'es'});assert.match(answer,/no responden solidaria ni subsidiariamente/);
});

test('Reglamento del Sínodo completo: 96 artículos, dos notas, cotejo y enlaces',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='RI-SIN');assert.equal(units.length,98);assert.equal(corpus.metadata.synodRulesReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['reglamento_sinodo_2025_es_revisado','regimento_sinodo_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');
  assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:96},(_,i)=>i+1));
  assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),[1,2]);
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);
  for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);
  assert.match(text,/\[Art\. 31\]\(#RI-SIN-art-31\)/);
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
 assert.equal(corpus.metadata.semanticReviewProgress.comparedUnits,1774);
 assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Reglamento del Sínodo conserva condiciones, excepciones y remisión del desempate',()=>{
 assert.match(byid.get('RI-SIN-art-31').textEs,/presencia mínima de dos tercios/);
 assert.match(byid.get('RI-SIN-art-39').textEs,/ingresos presupuestados/);
 assert.match(byid.get('RI-SIN-art-39').textEs,/pagos presupuestados/);
 assert.match(byid.get('RI-SIN-art-41').textEs,/Corresponde al Secretario Ejecutivo/);
 assert.match(byid.get('RI-SIN-art-44').textEs,/elegidos anualmente/);
 assert.match(byid.get('RI-SIN-art-44').textEs,/mandato de dos años/);
 assert.match(byid.get('RI-SIN-art-49').textEs,/Unión de la Juventud Presbiteriana/);
 assert.match(byid.get('RI-SIN-art-85').textEs,/quede demostrada la probabilidad de que el recurso sea estimado/);
 assert.match(byid.get('RI-SIN-art-92').textEs,/Exceptuados los plazos establecidos en el Código de Disciplina, los demás plazos podrán prorrogarse/);
 assert.match(byid.get('RI-SIN-nota-2').textEs,/aplicando por analogía/);
 const index=createIndex(corpus);const found=search(index,'Artículo 31',{norm:'RI-SIN'});assert.ok(found.some(r=>r.id==='RI-SIN-art-31'));
 const answer=makeAnswer('Artículo 31',found,corpus,{language:'es'});assert.match(answer,/presencia mínima de dos tercios/);assert.match(answer,/aplicando por analogía/);assert.match(answer,/RI-SIN-nota-2/);
});

test('Liturgia tiene cotejo completo y su encabezado no anuncia notas pendientes',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='PL');const progress=corpus.metadata.liturgyReviewProgress;
 assert.equal(progress.comparedArticles,44);assert.equal(progress.comparedNotes,59);assert.equal(progress.reviewComplete,true);assert.deepEqual(progress.pendingIds,[]);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);}
 const text=readFileSync(new URL('../documentos/principios_liturgia_2025_es_revisado.md',import.meta.url),'utf8');assert.match(text,/No quedan notas pendientes en esta sección/);assert.doesNotMatch(text,/Las notas pendientes se identifican/);
});
test('Estatuto del Presbiterio completo: 62 artículos, 135 notas, huellas y enlaces',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='EST-PRE');assert.equal(units.length,197);assert.equal(corpus.metadata.presbyteryStatuteReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['estatuto_presbiterio_2025_es_revisado','estatuto_presbiterio_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');
  assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:62},(_,i)=>i+1));
  assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),Array.from({length:135},(_,i)=>i+1));
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);
  for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('Estatuto del Presbiterio conserva negaciones, mayorías y condiciones procedimentales',()=>{
 assert.match(byid.get('EST-PRE-art-13').textEs,/comprometerse a aceptar/);
 assert.match(byid.get('EST-PRE-art-15').textEs,/ni se aceptará de ellos una solicitud de exoneración/);
 assert.match(byid.get('EST-PRE-art-24').textEs,/tres quintos de los miembros presentes/);
 assert.match(byid.get('EST-PRE-art-29').textEs,/presencia mínima de dos tercios/);
 assert.match(byid.get('EST-PRE-art-38').textEs,/convocado para ratificar la decisión/);
 assert.match(byid.get('EST-PRE-art-50').textEs,/La queja es la comunicación hecha por el propio ofendido; la denuncia es la comunicación hecha por cualquier otra persona/);
 assert.match(byid.get('EST-PRE-art-54').textEs,/en lo que resulte aplicable/);
 assert.match(byid.get('EST-PRE-nota-83').textEs,/no puede ser concedido a quien ejerce función no remunerada/);
 assert.match(byid.get('EST-PRE-nota-112').textEs,/movimiento financiero/);
 assert.match(byid.get('EST-PRE-nota-135').textEs,/Obligan a la persona jurídica los actos de los administradores/);
 assert.match(byid.get('EST-PRE-nota-135').textEs,/V - es inviolable la libertad de conciencia/);
 const index=createIndex(corpus);const found=search(index,'Artículo 46',{norm:'EST-PRE'});assert.ok(found.some(r=>r.id==='EST-PRE-art-46'));
 const answer=makeAnswer('Artículo 46',found,corpus,{language:'es'});assert.match(answer,/EST-PRE-nota-112/);assert.match(answer,/movimiento financiero/);
});

test('Reglamento del Presbiterio completo: 99 artículos y dos notas, números y enlaces',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='RI-PRE');assert.equal(units.length,101);assert.equal(corpus.metadata.presbyteryRulesReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['reglamento_presbiterio_2025_es_revisado','regimento_presbiterio_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');
  assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:99},(_,i)=>i+1));
  assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),[1,2]);
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);
  assert.match(text,/\[Art\. 31\]\(#RI-PRE-art-31\)/);if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('Consultas del Presbiterio conservan la remisión y las excepciones corregidas',()=>{
 assert.match(byid.get('RI-PRE-art-59').textEs,/aumento de la pena/);
 assert.match(byid.get('RI-PRE-art-62').textEs,/rechaza la alegación de incompetencia, el acusado podrá recurrir/);
 assert.match(byid.get('RI-PRE-art-67').textEs,/Si el ponente queda en minoría/);
 assert.match(byid.get('RI-PRE-art-76').textEs,/plazos sucesivos de tres días/);
 assert.match(byid.get('RI-PRE-art-87').textEs,/no tendrá efecto suspensivo/);
 assert.match(byid.get('RI-PRE-art-95').textEs,/Se suspende/);assert.match(byid.get('RI-PRE-art-95').textEs,/Exceptuados los plazos establecidos en el Código de Disciplina/);
 const index=createIndex(corpus);const es=search(index,'Artículo 31',{norm:'RI-PRE'});const pt=search(index,'Artigo 31',{norm:'RI-PRE'});assert.deepEqual(es.map(r=>r.id),pt.map(r=>r.id));
 const answer=makeAnswer('Artículo 31',es,corpus,{language:'es'});assert.match(answer,/RI-PRE-nota-2/);assert.match(answer,/aplicando por analogía/);
});
test('Descargas de Liturgia usan el nombre revisado y apuntan a un archivo disponible',()=>{
 const name='principios_liturgia_2025_es_revisado.md';const manifest=JSON.parse(readFileSync(new URL('../documentos/estado_bilingue.json',import.meta.url)));assert.ok(manifest.liturgyDocuments.includes(name));
 const text=readFileSync(new URL('../documentos/'+name,import.meta.url),'utf8');assert.equal(text,readFileSync(new URL('../static/documentos/'+name,import.meta.url),'utf8'));
 const page=readFileSync(new URL('../src/routes/+page.svelte',import.meta.url),'utf8');assert.match(page,/principios_liturgia_2025_es_revisado/);assert.doesNotMatch(page,/principios_liturgia_2025_es_en_revision/);
});

test('Estatuto de la Iglesia completo: 57 artículos, 116 notas y remisiones preservadas',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='EST-IG');assert.equal(units.length,173);assert.equal(corpus.metadata.churchStatuteReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['estatuto_iglesia_2025_es_revisado','estatuto_igreja_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:57},(_,i)=>i+1));assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),Array.from({length:116},(_,i)=>i+1));
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);
  assert.match(text,/\[Art\. 34\]\(#EST-IG-art-34\)/);if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('Estatuto de la Iglesia: negaciones, asamblea permanente y reconsideración recuperables',()=>{
 assert.match(byid.get('EST-IG-art-13').textEs,/ni se aceptará de ellos una solicitud de exclusión/);
 assert.match(byid.get('EST-IG-art-21').textEs,/urna inviolable/);assert.match(byid.get('EST-IG-art-21').textEs,/comprobación del quórum estatutario/);assert.match(byid.get('EST-IG-art-21').textEs,/condicionará el recuento/);
 assert.match(byid.get('EST-IG-art-27').textEs,/no implique admisión, transferencia o disciplina de miembros/);assert.match(byid.get('EST-IG-art-30').textEs,/Corresponde exclusivamente/);assert.match(byid.get('EST-IG-art-30').textEs,/libros de tesorería/);
 assert.match(byid.get('EST-IG-art-49').textEs,/La queja\[104\]/);assert.match(byid.get('EST-IG-art-53').textEs,/Las penas/);assert.match(byid.get('EST-IG-art-56').textEs,/primera votación/);assert.match(byid.get('EST-IG-art-56').textEs,/segunda votación/);
 const index=createIndex(corpus);const es=search(index,'Artículo 34',{norm:'EST-IG'});const pt=search(index,'Artigo 34',{norm:'EST-IG'});assert.deepEqual(es.map(r=>r.id),pt.map(r=>r.id));const answer=makeAnswer('Artículo 34',es,corpus,{language:'es'});assert.match(answer,/EST-IG-nota-85/);assert.match(answer,/No asegurar.*Voto Secreto/);assert.match(answer,/propuesta de uno que haya votado con la mayoría/);
});

test('Junta Diaconal: 34 artículos, nota de aprobación y referencias íntegras',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='RI-JD');assert.equal(units.length,35);assert.equal(corpus.metadata.deaconRulesReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['reglamento_junta_diaconal_2025_es_revisado','regimento_junta_diaconal_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:34},(_,i)=>i+1));assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),[1]);
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);assert.match(text,/CCXLIX/);
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('Junta Diaconal: fondos, excepciones de voto y Símbolos de Fe conservados en consultas',()=>{
 assert.match(byid.get('RI-JD-art-3').textEs,/votar y ser elegido/);assert.match(byid.get('RI-JD-art-3').textEs,/los turnos de servicio/);assert.match(byid.get('RI-JD-art-5').textEs,/entregarlas directamente a la Tesorería/);assert.match(byid.get('RI-JD-art-12').textEs,/al menos dos diáconos/);
 assert.match(byid.get('RI-JD-art-14').textEs,/al menos cinco días/);assert.match(byid.get('RI-JD-art-14').textEs,/concordancia de todos los miembros/);
 assert.match(byid.get('RI-JD-art-16').textEs,/empate.*rechazo/);assert.match(byid.get('RI-JD-art-16').textEs,/exceptuada la elección.*voto de desempate/);assert.match(byid.get('RI-JD-art-30').textEs,/sin derecho de voto/);assert.match(byid.get('RI-JD-art-34').textEs,/Símbolos de Fe \(Confesión de Fe y los Catecismos Mayor y Breve de Westminster\)/);
 const index=createIndex(corpus);const es=search(index,'Artículo 16',{norm:'RI-JD'});const pt=search(index,'Artigo 16',{norm:'RI-JD'});assert.deepEqual(es.map(r=>r.id),pt.map(r=>r.id));const answer=makeAnswer('Artículo 16',es,corpus,{language:'es'});assert.match(answer,/empate.*rechazo/);assert.match(answer,/voto de desempate/);
});

test('Reglamento de Actas: 24 artículos, seis notas y remisiones completas',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');const units=corpus.records.filter(r=>r.norm==='ATAS');assert.equal(units.length,30);assert.equal(corpus.metadata.minutesRulesReviewProgress.reviewComplete,true);
 for(const r of units){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.deepEqual(r.textOriginal.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 for(const name of ['reglamento_actas_2025_es_revisado','regulamento_atas_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');assert.deepEqual([...text.matchAll(/^### Art\. (\d+)$/gm)].map(m=>+m[1]),Array.from({length:24},(_,i)=>i+1));assert.deepEqual([...text.matchAll(/^### Nota (\d+)$/gm)].map(m=>+m[1]),[1,2,3,4,5,6]);
  const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length);for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]),m[1]);assert.match(text,/\[Art\. 10\]\(#ATAS-art-10\)/);
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
});
test('Actas: contenido, encuadernación y requisitos electrónicos recuperables',()=>{
 assert.match(byid.get('ATAS-art-3').textEs,/ACTA DE APERTURA/);assert.match(byid.get('ATAS-art-3').textEs,/ACTA DE CIERRE/);assert.match(byid.get('ATAS-art-6').textEs,/NEGRITA \(bold\), SUBRAYADO \(underline\)/);
 assert.match(byid.get('ATAS-art-8').textEs,/Se deberán encuadernar/);assert.match(byid.get('ATAS-art-8').textEs,/espiral no está permitido/);assert.match(byid.get('ATAS-art-12').textEs,/si sabe leer y escribir/);assert.match(byid.get('ATAS-art-12').textEs,/acta y libro específicos/);
 const n=byid.get('ATAS-nota-4').textEs;assert.match(n,/a\).*b\) acceso de todos los miembros.*c\).*d\) registro/s);assert.match(n,/dirección de la sede/);assert.match(n,/dirección electrónica \(enlace\)/);
 const index=createIndex(corpus);const es=search(index,'Artículo 10',{norm:'ATAS'});const pt=search(index,'Artigo 10',{norm:'ATAS'});assert.deepEqual(es.map(r=>r.id),pt.map(r=>r.id));const answer=makeAnswer('Artículo 10',es,corpus,{language:'es'});assert.match(answer,/ATAS-nota-4/);assert.match(answer,/ATAS-nota-5/);assert.match(answer,/b\) acceso de todos los miembros/);assert.match(answer,/obligatoriedad de la firma del Secretario Ejecutivo/);
});

test('Preliminares y separadores: cotejo completo del inventario y alcance del documento',async()=>{
 const {createHash}=await import('node:crypto');const hash=t=>createHash('sha256').update(t).digest('hex');
 const units=corpus.records.filter(r=>r.norm==='OTROS');const reviewed=units.filter(r=>r.translationReview);const pending=units.filter(r=>!r.translationReview);
 assert.equal(units.length,58);assert.equal(reviewed.length,58);assert.equal(corpus.metadata.frontMatterReviewProgress.reviewComplete,true);
 assert.deepEqual(pending,[]);
 for(const r of reviewed){assert.equal(r.translationReview.sourceHash,hash(r.textOriginal),r.id);assert.equal(r.translationReview.translationHash,hash(r.textEs),r.id);assert.equal(reading(r,'es').comparativeReviewCompleteForUnit,true);}
 const blank=reviewed.filter(r=>!r.textOriginal.trim());assert.equal(blank.length,19);
 for(const r of blank){assert.equal(r.textEs,'');assert.equal(r.translationReview.additionalEvidence.sourcePDFSHA256,corpus.metadata.sources.manual.sha256);assert.equal(r.translationReview.additionalEvidence.textCharacters,0);assert.equal(r.translationReview.additionalEvidence.images,0);}
 for(const name of ['preliminares_separadores_2025_es_revisado','preliminares_separadores_2025_pt']){
  const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,36);
  assert.deepEqual(anchors,[...reviewed].filter(r=>r.page<=4 || r.textOriginal.length<100).sort((a,b)=>a.page-b.page).map(r=>r.id));for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]));
  if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));
 }
 assert.equal(corpus.metadata.manualPageAnnexReviewComplete,true);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
test('Presentación: competencia, notas y nombres conservados sin heredar revisión del anexo',()=>{
 const p3=byid.get('manual-pagina-3').textEs;assert.match(p3,/no le corresponde alterar el contenido/);assert.match(p3,/resolver por delegación/);assert.match(p3,/sínodos y presbiterios/);assert.match(p3,/no se confunden con los textos legales ni los modifican/);assert.doesNotMatch(p3,/billetes|notadamente|recomposta/);
 const p2=byid.get('manual-pagina-2').textEs;assert.match(p2,/Misael Batista do Nascimento/);assert.match(p2,/OM Designers Gráficos/);assert.match(p2,/Cultura Cristã, 2025/);assert.match(p2,/ISBN 978-65-5989-256-3/);
 assert.match(byid.get('manual-pagina-4').textEs,/^4 MANUAL PRESBITERIANO/);assert.match(byid.get('manual-pagina-287').textEs,/REGLAMENTO INTERNO DEL/);assert.match(byid.get('manual-pagina-335').textEs,/COMISIÓN EJECUTIVA DEL/);
 const actas=readFileSync(new URL('../documentos/reglamento_actas_2025_es_revisado.md',import.meta.url),'utf8');assert.match(actas,/## REGLAMENTO PARA LA CONFECCIÓN DE ACTAS DE LOS CONCILIOS DE LA IPB/);assert.doesNotMatch(actas,/insertar nombre y sigla de la Iglesia/);
 const index=createIndex(corpus);const answer=makeAnswer('notas remisivas',search(index,'notas remisivas',{norm:'OTROS'}),corpus,{language:'es'});assert.match(answer,/manual-pagina-3/);assert.match(answer,/1774\/1774 registros cotejados/);assert.match(answer,/NO APROBADO COMO FUENTE DEFINITIVA/);
 const raw=JSON.parse(readFileSync(new URL('../documentos/manual_paginas_es.json',import.meta.url),'utf8'));assert.equal(raw['3'],p3);
});

test('Sumario e índices: cifras, incisos y anomalías históricas conservados en ambos Markdown',()=>{
 const pages=[5,6,7,8,9,10,11,12,157,158,159,160,161,162,163,213,214,215,216,217,265,266];
 const refs=text=>{text=text.replace(/([A-Za-zÀ-ÿ])-\s*\n\s*(?=[A-Za-zÀ-ÿ])/g,'$1').replace(/\s+/g,' ');return [...text.matchAll(/\b(\d+º?)\s+([a-z])(?![A-Za-zÀ-ÿ])/g)].filter(m=>!(['e','y'].includes(m[2])&&/^\s+(?:\d|§|par[aá]grafo|párrafo|único|seus|sus)/.test(text.slice(m.index+m[0].length)))).map(m=>[m[1],m[2]]);};
 for(const page of pages){const r=byid.get('manual-pagina-'+page);const src=r.textOriginal.split('\n').filter(l=>!['MANUALMANUAL','SUMÁRIOSUMÁRIO','ConstituiçãoConstituição','CódigoCódigo'].some(x=>l.includes(x))).join('\n');assert.deepEqual(src.match(/\d+/g),r.textEs.match(/\d+/g),r.id);assert.deepEqual(refs(src),refs(r.textEs),r.id);assert.equal((src.match(/§/g)||[]).length,(r.textEs.match(/§/g)||[]).length,r.id);}
 const structure=JSON.parse(readFileSync(new URL('../documentos/estructura_sumario_indices_2025.json',import.meta.url),'utf8'));assert.equal(structure.contents.length,331);assert.ok(structure.contents.every(e=>e.titlePt&&e.titleEs&&e.targetPage>=13&&e.targetPage<=559));
 for(const name of ['sumario_indices_2025_es_revisado','sumario_indices_2025_pt']){const text=readFileSync(new URL('../documentos/'+name+'.md',import.meta.url),'utf8');const anchors=[...text.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(anchors,pages.map(p=>'manual-pagina-'+p));for(const m of text.matchAll(/\]\(#([^)]*)\)/g))assert.ok(anchors.includes(m[1]));if(name.endsWith('revisado'))assert.ok(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8').includes(text));}
 assert.match(byid.get('manual-pagina-157').textEs,/141 e;/);assert.match(byid.get('manual-pagina-157').textEs,/10 e, párrafo único/);assert.match(byid.get('manual-pagina-160').textEs,/16 e, 20/);assert.match(byid.get('manual-pagina-161').textEs,/113 d 114/);assert.match(byid.get('manual-pagina-163').textEs,/70 e in fine/);assert.match(byid.get('manual-pagina-217').textEs,/91 e\./);
 assert.match(byid.get('manual-pagina-215').textEs,/los concilios ejecutan la: 113/);assert.equal(corpus.metadata.semanticReviewProgress.structuredUnitsReviewComplete,true);assert.equal(corpus.metadata.manualPageAnnexReviewComplete,true);
});
test('Todos los materiales del catálogo tienen archivos Markdown PT/ES y alcance explícito',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../documentos/estado_bilingue.json',import.meta.url),'utf8'));const pairs=manifest.bilingualMarkdownDocuments;assert.equal(pairs.length,105);
 for(const pair of pairs)for(const lang of ['es','pt']){assert.ok(pair[lang].endsWith('.md'));const text=readFileSync(new URL('../documentos/'+pair[lang],import.meta.url),'utf8');assert.ok(text.length>0);assert.equal(readFileSync(new URL('../static/documentos/'+pair[lang],import.meta.url),'utf8'),text);}
 assert.match(readFileSync(new URL('../documentos/estado_bilingue_es.md',import.meta.url),'utf8'),/Español completo y cotejado: 398\/398/);assert.match(readFileSync(new URL('../documentos/estado_bilingue_pt.md',import.meta.url),'utf8'),/Espanhol completo e conferido: 398\/398/);assert.match(readFileSync(new URL('../documentos/lista_trabalho_manual_presbiteriano_pt.md',import.meta.url),'utf8'),/páginas 141–160/);assert.match(readFileSync(new URL('../documentos/lista_trabalho_manual_presbiteriano_pt.md',import.meta.url),'utf8'),/pendentes 0\/560/);
});

 test('Anexo: hashes independientes y primer lote histórico 1–20',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_anexo_paginas_manual.json');const es=read('manual_paginas_es.json');const pt=read('manual_paginas_pt.json');
 assert.deepEqual(Object.keys(reviews).map(Number),Array.from({length:560},(_,i)=>i+1));assert.equal(Object.keys(es).length,560);assert.equal(Object.keys(pt).length,560);
 for(const [p,x] of Object.entries(reviews)){assert.equal(createHash('sha256').update(es[p]).digest('hex'),x.translationHash);assert.equal(createHash('sha256').update(pt[p]).digest('hex'),x.sourceHash);}
 assert.equal(corpus.metadata.pageAnnexReviewProgress.pendingPages,0);assert.deepEqual(corpus.metadata.pageAnnexReviewProgress.pendingArticleContinuation,null);assert.ok(reviews['21']);assert.ok(reviews['41']);assert.ok(reviews['61']);assert.ok(reviews['81']);assert.ok(reviews['101']);assert.ok(!reviews['561']);assert.match(es['19'],/profesantes/);assert.doesNotMatch(es['19'],/profesionales/);assert.match(es['20'],/en combinación$/);
 for(const name of ['anexo_paginas_001_020_2025_es_revisado.md','anexo_paginas_001_020_2025_pt.md']){const text=readFileSync(new URL('../documentos/'+name,import.meta.url),'utf8');assert.equal([...text.matchAll(/^## Página PDF /gm)].length,20);assert.match(text,/20\/560/);assert.match(text,/23/);}
 });

 test('Anexo 21–40: fuente, cifras, continuaciones y discrepancias preservadas',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),baseline=read('integridad_lote_anexo_021_040.json');
 for(const [p,hash] of Object.entries(baseline.pagesOutsideBatch).filter(([p])=>!(Number(p)>=41&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),hash,p);
 for(let p=21;p<=40;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['21'],/V — es inviolable la libertad/);assert.match(es['22'],/art\. art\. 15/);assert.match(es['27'],/31 de enero/);assert.match(es['27'],/1º de enero al 31 de diciembre/);assert.equal([...es['33'].matchAll(/3\. No atender la solicitud de reforma parcial/g)].length,2);
 assert.match(es['25'],/nunca con un plazo inferior a siete días/);assert.match(es['26'],/solamente continuará con el escrutinio si constata/);assert.match(es['36'],/por sí solo, no impide la admisión/);assert.match(es['40'],/sin la profesión$/);
 const progress=corpus.metadata.pageAnnexReviewProgress;assert.equal(progress.comparedPages,560);assert.equal(progress.pendingContinuation,null);assert.deepEqual(progress.pendingArticleContinuation,null);assert.ok(progress.completedContinuations.some(x=>x.note===23&&x.complete&&x.endsOnPage===22));
 for(const name of ['anexo_paginas_021_040_2025_es_revisado.md','anexo_paginas_021_040_2025_pt.md']){const text=readFileSync(new URL('../documentos/'+name,import.meta.url),'utf8');const headings=[...text.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1]));assert.deepEqual(headings,Array.from({length:20},(_,i)=>i+21));assert.match(text,/40\/560/);assert.match(text,/520/);for(const m of text.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(text.includes('id="'+m[1]+'"'));}
 });

test('Anexo 41–60: cifras, límites, notas y continuidad verificables',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),baseline=read('integridad_lote_anexo_041_060.json');
 for(const [p,h] of Object.entries(baseline.pagesOutsideBatch).filter(([p])=>!(Number(p)>=61&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=41;p<=60;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 const progress=corpus.metadata.pageAnnexReviewProgress;assert.ok(progress.completedContinuations.some(x=>x.note===66&&x.endsOnPage===41));assert.ok(progress.completedArticleContinuations.some(x=>x.article===17&&x.endsOnPage===41));assert.equal(progress.pendingContinuation,null);assert.deepEqual(progress.pendingArticleContinuation,null);assert.deepEqual(progress.pendingArticleContinuation,null);
 assert.match(es['48'],/pueblos en general/);assert.match(es['48'],/inexistente en la defensa/);assert.match(es['44'],/art\.\. 23/);assert.equal((es['55'].match(/\*/g)||[]).length,2);assert.match(es['60'],/Pastor evangelista/);
 for(const name of ['anexo_paginas_041_060_2025_es_revisado.md','anexo_paginas_041_060_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+name,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+41));assert.match(t,/60\/560/);assert.match(t,/500/);}
});

test('Anexo 61–80: condiciones, excepciones, referencias y límites de revisión',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),baseline=read('integridad_lote_anexo_061_080.json');
 for(const [p,h] of Object.entries(baseline.pagesOutsideBatch).filter(([p])=>!(Number(p)>=81&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=61;p<=80;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['63'],/50% del valor del INSS que deben ingresar los pastores/);assert.match(es['67'],/no podrá descontar/);assert.match(es['69'],/complemento hasta la integralidad/);assert.match(es['70'],/interrumpe la secuencia temporal/);assert.match(es['76'],/dos tercios de los miembros/);assert.equal([...es['76'].matchAll(/es administrativa y no punitiva/g)].length,2);assert.match(es['79'],/artículo 4º de los párrafos/);assert.match(es['78'],/no tiene derecho a voto en el pleno del Concilio, pero lo tiene en su Comisión Ejecutiva/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.ok(p.completedContinuations.some(x=>x.note===122&&x.endsOnPage===61));assert.ok(p.completedArticleContinuations.some(x=>x.article===34&&x.endsOnPage===61));assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.reviewComplete,true);assert.match(readFileSync(new URL('../documentos/manual_2025_es.md',import.meta.url),'utf8'),/quedan 0 páginas pendientes/);assert.match(readFileSync(new URL('../documentos/revision_manual_2025_pt.md',import.meta.url),'utf8'),/revisão por páginas concluída/);
 for(const n of ['anexo_paginas_061_080_2025_es_revisado.md','anexo_paginas_061_080_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+61));assert.match(t,/80\/560/);assert.match(t,/480/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 81–100: derechos, excepciones, remisiones históricas y notas abiertas',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),baseline=read('integridad_lote_anexo_081_100.json');
 for(const [p,h] of Object.entries(baseline.pagesOutsideBatch).filter(([p])=>!(Number(p)>=101&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=81;p<=100;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['81'],/Rechazar la propuesta de alteración de los mandatos/);assert.match(es['82'],/independientemente de la localidad, no siendo necesario oír a la asamblea/);assert.match(es['83'],/53 \(rectius 54\)/);assert.match(es['87'],/no tiene efecto suspensivo/);assert.match(es['88'],/mitad más uno/);assert.match(es['89'],/art\. art\. 17/);assert.match(es['92'],/hasta tres mandatos.*fue revocada/);assert.match(es['97'],/Artículo 7º/);assert.match(es['99'],/ex nunc o sea, hasta su raíz/);assert.match(es['100'],/capacidad financiera de las iglesias contribuyentes/);assert.match(es['100'],/en el$/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.ok(p.completedContinuations.some(x=>x.note===161&&x.endsOnPage===81));assert.ok(p.completedArticleContinuations.some(x=>x.article===54&&x.endsOnPage===82));assert.ok(p.completedArticleContinuations.some(x=>x.article===70&&x.endsOnPage===100));assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.reviewComplete,true);
 for(const n of ['anexo_paginas_081_100_2025_es_revisado.md','anexo_paginas_081_100_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+81));assert.match(t,/100\/560/);assert.match(t,/460/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 101–120: quórum, derechos, discrepancias y límites de notas',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),baseline=read('integridad_lote_anexo_101_120.json');
 for(const [p,h] of Object.entries(baseline.pagesOutsideBatch).filter(([p])=>!(Number(p)>=121&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=101;p<=120;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['101'],/no se incluye entre los requisitos constitucionales/);assert.match(es['102'],/devuelva al concilio signatario/);assert.match(es['107'],/mayoría absoluta/);assert.match(es['108'],/Respuesta: No/);assert.match(es['111'],/puede o no generar la nulidad/);assert.match(es['113'],/31 de enero/);assert.match(es['113'],/31 de diciembre/);assert.match(es['114'],/§ §/);assert.match(es['116'],/60%/);assert.match(es['120'],/antes de cualquier tratativa/);assert.match(es['120'],/considerando:$/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.ok(p.completedContinuations.some(x=>x.note===205&&x.endsOnPage===102));assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.reviewComplete,true);
 for(const n of ['anexo_paginas_101_120_2025_es_revisado.md','anexo_paginas_101_120_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+101));assert.match(t,/120\/560/);assert.match(t,/440/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 121–140: referencias, mayorías y continuación del artículo 114',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),baseline=read('integridad_lote_anexo_121_140.json');
 for(const [p,h] of Object.entries(baseline.pagesOutsideBatch).filter(([p])=>!(Number(p)>=141&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=121;p<=140;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['133'],/dos tercios/);assert.match(es['133'],/mitad más uno/);assert.match(es['137'],/pueblos en general/);assert.match(es['140'],/XXXVII/);assert.match(es['140'],/XXIX/);assert.match(es['140'],/Iglesia Presbiteriana de Brasil,$/m);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.ok(p.completedContinuations.some(x=>x.note===263&&x.endsOnPage===121));assert.ok(p.completedArticleContinuations.some(x=>x.article===88&&x.endsOnPage===122));assert.equal(p.reviewComplete,true);
 for(const n of ['anexo_paginas_121_140_2025_es_revisado.md','anexo_paginas_121_140_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+121));assert.match(t,/140\/560/);assert.match(t,/420/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 141–160: cierre constitucional y límites del índice',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_141_160.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=161&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=141;p<=160;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['145'],/40%/);assert.match(es['145'],/75%/);assert.match(es['145'],/7 \(siete\)/);assert.match(es['144'],/Sí\. Esto es posible/);assert.match(es['152'],/asamblea extraordinaria/);assert.match(es['153'],/tres cuartas partes/);assert.match(es['154'],/mayoría absoluta/);assert.match(es['154'],/dos tercios/);assert.match(es['160'],/Supremo$/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingIndexContinuation,null);assert.ok(p.completedArticleContinuations.some(x=>x.article===114&&x.endsOnPage===141));assert.equal(p.reviewComplete,true);
 for(const n of ['anexo_paginas_141_160_2025_es_revisado.md','anexo_paginas_141_160_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+141));assert.match(t,/160\/560/);assert.match(t,/400/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 161–180: inicio CD, plazos, nota 37 abierta y garantías',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_161_180.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=181&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=161;p<=180;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.equal(es['164'],'');assert.equal(es['166'],'');assert.match(es['167'],/investidos de toda la autoridad/);assert.doesNotMatch(es['167'],/invertidos/);assert.match(es['169'],/en situaciones excepcionales/);assert.match(es['171'],/AUMENTO DE LA PENA/);assert.match(es['173'],/en lo que les sea aplicable/);assert.match(es['176'],/derecho a defenderse/);assert.match(es['176'],/un año/);assert.match(es['176'],/dos años/);assert.match(es['180'],/hasta 5 \(cinco\) días/);assert.match(es['180'],/Ipólito de Campos Júnior$/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.equal(p.pendingIndexContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedContinuations.some(x=>x.note===25&&x.norm==='CD'&&x.endsOnPage===175));
 for(const n of ['anexo_paginas_161_180_2025_es_revisado.md','anexo_paginas_161_180_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+161));assert.match(t,/180\/560/);assert.match(t,/380/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 181–200: expedientes, plazos y nota 79 abierta',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_181_200.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=201&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=181;p<=200;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['185'],/queja, que es la comunicación hecha por el ofendido/);assert.match(es['185'],/denuncia, que es la comunicación hecha por cualquier otra persona/);assert.match(es['187'],/por escrito/);assert.match(es['190'],/ocho días/);assert.match(es['196'],/cuarenta y ocho horas/);assert.match(es['192'],/libro propio para el registro de procesos disciplinarios/);assert.match(es['200'],/CCLXXX/);assert.match(es['200'],/CCLXX/);assert.match(es['200'],/DICTAMEN$/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.equal(p.pendingContinuation,null);assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedContinuations.some(x=>x.note===37&&x.norm==='CD'&&x.endsOnPage===181));assert.ok(p.completedArticleContinuations.some(x=>x.article===22&&x.norm==='CD'&&x.endsOnPage===181));
 for(const n of ['anexo_paginas_181_200_2025_es_revisado.md','anexo_paginas_181_200_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+181));assert.match(t,/200\/560/);assert.match(t,/360/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 201–220: Código completo, límites de notas e integridad',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_201_220.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=221&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=201;p<=217;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['202'],/\*Art\. 96\./);assert.doesNotMatch(es['201'],/\*Art\. 96\./);assert.match(es['205'],/no podrá aumentarse la pena/);assert.match(es['212'],/SUMARIO Nº 10/);assert.equal(es['218'],'');assert.equal(es['220'],'');assert.equal(corpus.metadata.pageAnnexReviewProgress.pendingContinuation,null);
 for(const n of ['anexo_paginas_201_220_2025_es_revisado.md','anexo_paginas_201_220_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+201));for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 221–240: liturgia, correcciones, referencias históricas y continuaciones',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_221_240.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=241&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=221;p<=240;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));assert.doesNotMatch(es[p],/revulnerante|convulneranciante|divulnerante|Recomendarr/);}
 assert.match(es['225'],/salvo casos especiales, a juicio del Consejo/);assert.match(es['237'],/No se realizarán cultos en memoria de personas fallecidas/);assert.match(es['229'],/SC – 1970 – DOC\. II/);assert.match(es['233'],/SC\/IPB – 2007 – DOC\. II/);assert.match(es['239'],/Milfor/);assert.match(es['239'],/Milford/);assert.doesNotMatch(es['240'],/Declarar nula de pleno derecho/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.ok(p.completedContinuations.some(x=>x.note===7&&x.norm==='PL'&&x.endsOnPage===233));assert.ok(p.completedArticleContinuations.some(x=>x.article===8&&x.norm==='PL'&&x.endsOnPage===237));
 assert.doesNotMatch(byid.get('PL-nota-7').textEs,/revulnerante|convulneranciante|divulnerante/);
 for(const n of ['anexo_paginas_221_240_2025_es_revisado.md','anexo_paginas_221_240_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+221));assert.match(t,/240\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 241–260: revocaciones, sacramentos, actas y límites de página',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_241_260.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=261&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=241;p<=260;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['241'],/Declarar nula de pleno derecho la decisión CE-SC\/IPB – 2004/);assert.match(es['248'],/totalmente gratuito/);assert.match(es['248'],/un reembolso/);assert.match(es['251'],/celebrante archivará el certificado/);assert.match(es['253'],/Revocar las decisiones del SC-IPB/);assert.match(es['254'],/no unjan personas o objetos/);assert.match(es['256'],/Es imprescindible registrar en acta del Consejo/);assert.match(es['258'],/no a otras denominaciones presbiterianas/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.ok(p.completedContinuations.some(x=>x.note===15&&x.norm==='PL'&&x.endsOnPage===241));assert.ok(p.completedArticleContinuations.some(x=>x.article===11&&x.norm==='PL'&&x.endsOnPage===242));assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.reviewComplete,true);
 for(const n of ['anexo_paginas_241_260_2025_es_revisado.md','anexo_paginas_241_260_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+241));assert.match(t,/260\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 261–280: cierre litúrgico, Estatuto IPB y notas financieras de 2025',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_261_280.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=281&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=261;p<=280;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['261'],/V - es inviolable/);assert.match(es['261'],/inciso VI/);assert.doesNotMatch(es['261'],/ningún oficina/);assert.match(es['263'],/Arts\. 46 a 48/);assert.equal(es['268'],'');assert.match(es['269'],/00\.118\.331\/0001-20/);assert.match(es['273'],/presente Constitución/);assert.match(es['274'],/ocho años/);assert.match(es['272'],/sin derecho de votar/);assert.equal((es['280'].match(/CE – 2025 – DOC\. XCV/g)||[]).length,2);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.equal(p.pendingContinuation,null);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedContinuations.some(x=>x.note===50&&x.norm==='PL'&&x.endsOnPage===262));assert.ok(p.completedArticleContinuations.some(x=>x.article===39&&x.norm==='PL'&&x.endsOnPage===262));assert.ok(p.completedArticleContinuations.some(x=>x.article===28&&x.norm==='EST-IPB'&&x.endsOnPage===280));
 for(const n of ['anexo_paginas_261_280_2025_es_revisado.md','anexo_paginas_261_280_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+261));assert.match(t,/280\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 281–300: Estatuto completo, numeración histórica y continuación RI-SC',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_281_300.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=301&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=281;p<=300;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.equal((es['286'].match(/Art\. 44/g)||[]).length,2);assert.doesNotMatch(es['286'],/Art\. 45/);assert.match(es['285'],/Supremo Ejecutivo/);assert.equal(es['288'],'');assert.match(es['289'],/la Comisión Ejecutiva/);assert.match(es['294'],/de los entes autónomos/);assert.match(es['281'],/dos tercios/);assert.match(es['290'],/mayoría absoluta/);assert.match(es['300'],/tiempo necesario$/);
 assert.deepEqual(corpus.metadata.pageAnnexReviewProgress.pendingArticleContinuation,null);
 for(const n of ['anexo_paginas_281_300_2025_es_revisado.md','anexo_paginas_281_300_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+281));assert.match(t,/300\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 301–320: numeración histórica, quórum, actas y plazos',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_301_320.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=321&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=301;p<=320;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['307'],/IV - Tesorero/);assert.match(es['307'],/V - el presidente/);assert.match(es['302'],/tres por ciento/);assert.match(es['302'],/cinco por ciento/);assert.match(es['308'],/transcribir las actas/);assert.match(es['318'],/cinco miembros/);assert.match(es['319'],/cinco días/);assert.match(es['320'],/diez días/);assert.match(es['320'],/tres días/);assert.doesNotMatch(es['305'],/las encargos/);assert.doesNotMatch(es['319'],/La desistimiento/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.ok(p.completedArticleContinuations.some(x=>x.article===24&&x.norm==='RI-SC'&&x.endsOnPage===301));
 for(const n of ['anexo_paginas_301_320_2025_es_revisado.md','anexo_paginas_301_320_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+301));assert.match(t,/320\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 321–340: cierre RI-SC y continuidad RI-CE',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_321_340.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=341&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=321;p<=340;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['322'],/dos horas/);assert.match(es['331'],/cinco días/);assert.match(es['333'],/días hábiles/);assert.match(es['333'],/ocho días/);assert.match(es['327'],/tres ministros y dos presbíteros/);assert.match(es['328'],/dos días/);assert.equal(es['336'],'');assert.match(es['340'],/XII - elaborar/);assert.doesNotMatch(es['340'],/XIII - sustituir/);assert.doesNotMatch(es['323'],/para la aumento/);assert.match(es['324'],/uno de los cuales/);
 assert.deepEqual(corpus.metadata.pageAnnexReviewProgress.pendingArticleContinuation,null);
 for(const n of ['anexo_paginas_321_340_2025_es_revisado.md','anexo_paginas_321_340_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+321));assert.match(t,/340\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 341–360: RI-CE completo, decisiones históricas y Estatuto sinodal',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_341_360.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=361&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=341;p<=360;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['346'],/no tiene competencia constitucional/);assert.match(es['347'],/cuarenta y cinco días/);assert.match(es['348'],/veinte días/);assert.match(es['348'],/treinta días/);assert.match(es['350'],/exclusivamente a la primera subcomisión/);assert.equal(es['354'],'');assert.equal(es['356'],'');assert.match(es['360'],/reembolsos/);assert.match(es['360'],/Art\. 13\./);assert.doesNotMatch(es['360'],/I – cumplir/);assert.doesNotMatch(es['341'],/las siguientes encargos/);assert.doesNotMatch(es['359'],/sobre de inmuebles/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.deepEqual(p.pendingArticleContinuation,null);assert.ok(p.completedArticleContinuations.some(x=>x.article===8&&x.norm==='RI-CE'&&x.endsOnPage===342));
 for(const n of ['anexo_paginas_341_360_2025_es_revisado.md','anexo_paginas_341_360_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+341));assert.match(t,/360\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 361–380: Estatuto sinodal completo, nota 9 y actas reglamentarias',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_361_380.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=381&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=361;p<=380;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['362'],/dos tercios de los presentes/);assert.match(es['365'],/dos tercios de los miembros del Sínodo/);assert.match(es['365'],/V - es inviolable/);assert.match(es['366'],/Ley 8\.906/);assert.equal(es['368'],'');assert.match(es['370'],/julio/);assert.match(es['372'],/tras la aprobación del informe/);assert.match(es['373'],/última acta/);assert.match(es['379'],/tres cuartas partes/);assert.match(es['380'],/registro en acta/);assert.doesNotMatch(es['361'],/las carnés/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.deepEqual(p.pendingArticleContinuation,null);assert.ok(p.completedContinuations.some(x=>x.note===9&&x.norm==='EST-SIN'&&x.endsOnPage===366));assert.ok(p.completedArticleContinuations.some(x=>x.article===13&&x.norm==='EST-SIN'&&x.endsOnPage===361));
 for(const n of ['anexo_paginas_361_380_2025_es_revisado.md','anexo_paginas_361_380_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+361));assert.match(t,/380\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 381–400: quórum, plazos, repetición histórica y actuaciones',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_381_400.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=401&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=381;p<=400;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['381'],/dos tercios de sus integrantes/);assert.match(es['384'],/tres días/);assert.match(es['389'],/elegidos anualmente/);assert.match(es['389'],/mandato de dos años/);assert.equal((es['397'].match(/sesenta días/g)||[]).length,2);assert.match(es['396'],/acta separada/);assert.match(es['398'],/noventa días/);assert.match(es['398'],/treinta días/);assert.match(es['400'],/Art\. 60\./);assert.doesNotMatch(es['386'],/de la ingresos/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.ok(p.completedArticleContinuations.some(x=>x.article===49&&x.norm==='RI-SIN'&&x.endsOnPage===393));
 for(const n of ['anexo_paginas_381_400_2025_es_revisado.md','anexo_paginas_381_400_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+381));assert.match(t,/400\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 401–420: cierre sinodal, cifras, integridad y límites',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_401_420.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=421&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=401;p<=420;p++){const clean=s=>s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['418'],/Art\. 96\./);assert.equal(es['420'],'');assert.match(es['413'],/diez minutos/);assert.match(es['412'],/tres ministros y dos presbíteros/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.reviewComplete,true);
 for(const n of ['anexo_paginas_401_420_2025_es_revisado.md','anexo_paginas_401_420_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+401));assert.match(t,/420\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 421–440: presbiterio, notas, cifras y continuación del artículo 34',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_421_440.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=441&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=421;p<=440;p++){const clean=s=>p===421?s:s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['427'],/seis meses/);assert.match(es['433'],/7 \(siete\) días/);assert.match(es['435'],/tres quintos/);assert.match(es['435'],/noventa días/);assert.match(es['437'],/tres años/);assert.match(es['436'],/reembolsos/);assert.match(es['424'],/artículo 4º/);assert.match(es['434'],/artículo 4º/);assert.match(es['440'],/actas de los\n\n103/);assert.doesNotMatch(es['440'],/V – entregar/);assert.doesNotMatch(es['440'],/las carnés/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedContinuations.some(x=>x.note===85&&x.norm==='EST-PRE'&&x.endsOnPage===437));
 for(const n of ['anexo_paginas_421_440_2025_es_revisado.md','anexo_paginas_421_440_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+421));assert.match(t,/440\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 441–460: cierre del Estatuto, actas por sesión y Reglamento presbiteral',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_441_460.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=461&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=441;p<=460;p++){const clean=s=>[450,451,452,453].includes(p)?s:s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['441'],/Consejos de las iglesias/);assert.match(es['442'],/noventa días/);assert.match(es['443'],/cuatro meses/);assert.match(es['445'],/121 Art\. 19/);assert.match(es['447'],/dos años/);assert.match(es['448'],/dos tercios de sus miembros/);assert.match(es['454'],/dos tercios de los miembros presentes/);assert.match(es['448'],/V - es inviolable/);assert.equal(es['450'],'');assert.equal(es['452'],'');assert.match(es['457'],/acta especial/);assert.match(es['458'],/Cada sesión regular constará de acta específica/);assert.match(es['458'],/última acta/);assert.doesNotMatch(es['441'],/de la ingresos/);assert.doesNotMatch(es['443'],/por las importes|de la movimiento/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedArticleContinuations.some(x=>x.article===34&&x.norm==='EST-PRE'&&x.endsOnPage===441));assert.ok(p.completedContinuations.some(x=>x.note===135&&x.norm==='EST-PRE'&&x.endsOnPage===449));
 for(const n of ['anexo_paginas_441_460_2025_es_revisado.md','anexo_paginas_441_460_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+441));assert.match(t,/460\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 461–480: mayorías, cargos, secretarías y continuación artículo 51',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_461_480.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=481&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=461;p<=480;p++){const clean=s=>[466,474,480].includes(p)?s:s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['464'],/tres cuartas partes/);assert.match(es['466'],/CE - 2024 - DOC\. CLX/);assert.match(es['469'],/tres días/);assert.match(es['472'],/siete días/);assert.match(es['473'],/dos tercios/);assert.match(es['478'],/Educación Religiosa/);assert.match(es['480'],/Art\. 51/);assert.doesNotMatch(es['480'],/I - analizar/);assert.doesNotMatch(es['471'],/de la ingresos/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedArticleContinuations.some(x=>x.article===48&&x.norm==='RI-PRE'&&x.endsOnPage===478));
 for(const n of ['anexo_paginas_461_480_2025_es_revisado.md','anexo_paginas_461_480_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+461));assert.match(t,/480\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 481–500: reserva, defensa, sentencia, plazos y continuación artículo 85',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_481_500.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=501&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=481;p<=500;p++){const clean=s=>[483,484,486,488,490,498,499].includes(p)?s:s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['481'],/omitiendo los hechos/);assert.match(es['483'],/sesenta días/);assert.match(es['484'],/treinta días/);assert.match(es['492'],/la lista de testigos/);assert.match(es['493'],/cinco testigos/);assert.match(es['494'],/sucesivos de tres días/);assert.match(es['496'],/preservando el dispositivo proclamado/);assert.match(es['496'],/veinte días/);assert.match(es['500'],/interrumpe el plazo/);assert.match(es['500'],/notifique a la parte$/);assert.doesNotMatch(es['500'],/§ 5º Transcurrido/);assert.doesNotMatch(es['490'],/La desistimiento/);assert.doesNotMatch(es['494'],/Los actas|firmados/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedArticleContinuations.some(x=>x.article===51&&x.norm==='RI-PRE'&&x.endsOnPage===481));
 for(const n of ['anexo_paginas_481_500_2025_es_revisado.md','anexo_paginas_481_500_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+481));assert.match(t,/500\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 501–520: cierre RI-PRE, membresía, asambleas y continuación EST-IG',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_501_520.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)&&!(Number(p)>=521&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=501;p<=520;p++){const clean=s=>[504,506,507,508,509,510,511].includes(p)?s:s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['501'],/no tendrá efecto suspensivo/);assert.match(es['505'],/uno de los cuales/);assert.match(es['507'],/días hábiles/);assert.match(es['508'],/Art\. 99/);assert.equal(es['510'],'');assert.match(es['512'],/15 días/);assert.match(es['512'],/edición 2019/);assert.match(es['515'],/ser votados/);assert.match(es['517'],/dos años después de ese plazo/);assert.match(es['519'],/1\/3/);assert.match(es['519'],/43 Art\.\. 9º/);assert.match(es['520'],/moderador, sin derecho a voto/);assert.match(es['520'],/por el plazo de un año,/);assert.doesNotMatch(es['520'],/previa indicación/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedArticleContinuations.some(x=>x.article===85&&x.norm==='RI-PRE'&&x.endsOnPage===501));assert.ok(p.completedContinuations.some(x=>x.note===2&&x.norm==='EST-IG'&&x.endsOnPage===512));
 for(const n of ['anexo_paginas_501_520_2025_es_revisado.md','anexo_paginas_501_520_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+501));assert.match(t,/520\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo 521–540: cierre EST-IG, quórums y continuación RI-JD',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_521_540.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch).filter(([p])=>!(Number(p)>=541&&Number(p)<=560)&&!(Number(p)>=541&&Number(p)<=560)))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=521;p<=540;p++){const clean=s=>[532,533,534,535].includes(p)?s:s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['521'],/previa indicación/);assert.match(es['522'],/por acto del Presbiterio/);assert.match(es['524'],/un tercio/);assert.match(es['524'],/más de la mitad/);assert.match(es['525'],/más del 50%/);assert.match(es['525'],/Voto Secreto/);assert.match(es['526'],/párrafo único y letras añadidas/);assert.match(es['527'],/por los importes/);assert.match(es['530'],/limitado a dos años/);assert.match(es['531'],/Art\. 57/);assert.equal(es['532'],'');assert.equal(es['534'],'');assert.match(es['536'],/al menos|por lo menos/);assert.match(es['540'],/importes relativos/);assert.doesNotMatch(es['540'],/II – disponer la entrega inmediata/);
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.deepEqual(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(p.reviewComplete,true);assert.ok(p.completedArticleContinuations.some(x=>x.article===24&&x.norm==='EST-IG'&&x.endsOnPage===521));
 for(const n of ['anexo_paginas_521_540_2025_es_revisado.md','anexo_paginas_521_540_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+521));assert.match(t,/540\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Anexo final 541–560: todas las páginas, notas y artículos cerrados',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const es=read('manual_paginas_es.json'),pt=read('manual_paginas_pt.json'),base=read('integridad_lote_anexo_541_560.json');
 for(const [p,h] of Object.entries(base.pagesOutsideBatch))assert.equal(createHash('sha256').update(es[p]).digest('hex'),h,p);
 for(let p=541;p<=560;p++){const clean=s=>[547,548,549,560].includes(p)?s:s.split('\n').slice(1).join('\n');assert.deepEqual(clean(pt[p]).match(/\d+/g),clean(es[p]).match(/\d+/g),String(p));assert.equal((clean(pt[p]).match(/§/g)||[]).length,(clean(es[p]).match(/§/g)||[]).length,String(p));}
 assert.match(es['543'],/empate/);assert.match(es['545'],/sin derecho de voto/);assert.match(es['549'],/exclusivo para ese fin/);assert.match(es['551'],/A4 34/);assert.match(es['555'],/dirección de la sede/);assert.doesNotMatch(es['556'],/segundo secretario/);assert.match(es['557'],/segundo secretario/);assert.match(es['557'],/firma digital/);assert.match(es['557'],/si fue aceptado o no/);assert.match(es['558'],/acta y libro específicos/);assert.match(es['559'],/Art\. 24/);assert.equal(es['548'],'');assert.equal(es['560'],'');
 const p=corpus.metadata.pageAnnexReviewProgress;assert.equal(p.comparedPages,560);assert.equal(p.pendingPages,0);assert.equal(p.reviewComplete,true);assert.equal(p.pendingArticleContinuation,null);assert.equal(p.pendingContinuation,null);assert.equal(corpus.metadata.manualPageAnnexReviewComplete,true);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);assert.ok(p.completedContinuations.some(x=>x.note===5&&x.norm==='ATAS'&&x.endsOnPage===557));
 for(const n of ['anexo_paginas_541_560_2025_es_revisado.md','anexo_paginas_541_560_2025_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## Página PDF (\d+)$/gm)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+541));assert.match(t,/560\/560/);for(const m of t.matchAll(/\]\(#(anexo-pagina-\d+)\)/g))assert.ok(t.includes('id="'+m[1]+'"'));}
});

test('Digesto primer lote: decisiones completas, hashes, cifras y límites de integración',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_001_010.json'),before=read('integridad_digesto_lote_001_010.json');
 assert.equal(batch.ids.length,10);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.reviewComplete,true);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);}
 assert.equal(byid.get('SC-2026-CCXXXIX').status,'procedimiento-pendiente');assert.match(byid.get('SC-2026-CCXXXIX').textEs,/convocando al SC\/IPB para reunirse en Constituyente/);assert.match(byid.get('SC-2026-CCXL').textEs,/no constituye, por sí sola/);assert.match(byid.get('SC-2026-CCXXXV').textEs,/\n3\. La búsqueda/);assert.ok(byid.get('CE-2026-X').translationReview);assert.equal(corpus.amendments.length,6);
 for(const n of ['digesto_lote_001_010_2026_es_revisado.md','digesto_lote_001_010_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/11\/398/);}
});

test('Digesto segundo lote: archivo FEP, plazo FJMC y ambigüedad CRIE',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_011_020.json');assert.equal(batch.ids.length,10);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);}
 assert.equal(byid.get('SC-2026-CCXXVII').status,'archivada-sin-objeto');assert.match(byid.get('SC-2026-CCXXVII').textEs,/pérdida sobrevenida de su objeto/);assert.match(byid.get('SC-2026-CCXXVI').textEs,/21 de enero de 2027 y el 20 de enero de 2031/);assert.match(byid.get('SC-2026-CCXXV').textEs,/mandatos de cuántos años/);assert.match(byid.get('SC-2026-CCXXX').textEs,/Wisnton Ramão Albres Garcia/);assert.ok(byid.get('CE-2026-X').translationReview);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.pageAnnexReviewProgress.comparedPages,560);
 for(const n of ['digesto_lote_011_020_2026_es_revisado.md','digesto_lote_011_020_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/21\/398/);}
});

test('Digesto tercer lote: nombramientos, mandatos diferenciados y referencias',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_021_030.json');
 assert.equal(batch.ids.length,10);assert.deepEqual(batch.pages,[10,11,12,13]);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(z.status,'aprobada');assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal(v.externalCertification,false);}
 assert.match(byid.get('SC-2026-CCXXI').textEs,/Uziel Firmino de Assis Júnior \(Sínodo Sul do Brasil\) - SC 2026 - CE 2028/);
 assert.equal((byid.get('SC-2026-CCXV').textEs.match(/CE 2028/g)||[]).length,3);assert.match(byid.get('SC-2026-CCXIII').textEs,/SC\/IPB-2026-DOC\. X, punto 4/);assert.match(byid.get('SC-2026-CCXII').textEs,/Welligton Soares de Oliveira/);
 assert.ok(byid.get('CE-2026-X').translationReview);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.pageAnnexReviewProgress.comparedPages,560);
 for(const n of ['digesto_lote_021_030_2026_es_revisado.md','digesto_lote_021_030_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/31\/398/);assert.match(t,/367/);}
});

test('Digesto cuarto lote: rechazo, trámite constitucional y rectificación institucional',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_031_040.json');
 assert.equal(batch.ids.length,10);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal(v.externalCertification,false);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 for(const id of ['SC-2026-CCVIII','SC-2026-CCVII','SC-2026-CCV','SC-2026-CCIII'])assert.equal(byid.get(id).status,'rechazada');
 assert.equal(byid.get('SC-2026-CCVI').status,'procedimiento-pendiente');assert.match(byid.get('SC-2026-CCVI').textEs,/apta para iniciar el procedimiento/);assert.match(byid.get('SC-2026-CCV').textEs,/Acoger como línea de estudio/);assert.match(byid.get('SC-2026-CCV').textEs,/Victor Antônio Dos Passos Filho del fondo/);
 assert.equal(byid.get('SC-2026-CCIV').status,'interpretacion-aprobada');assert.match(byid.get('SC-2026-CCIV').textEs,/no constituye un juicio sobre la salvación individual/);assert.match(byid.get('SC-2026-CCIV').textEs,/instrucción previa, pública profesión de fe y bautismo/);assert.match(byid.get('SC-2026-CCIV').textEs,/IV\. FUENTES Y REFERENCIAS/);
 assert.equal(byid.get('SC-2026-CCII').status,'procedimiento-pendiente');assert.match(byid.get('SC-2026-CCII').textEs,/no tomar conocimiento por ser prematuro/);assert.ok(byid.get('SC-2026-CCI').textEs);assert.ok(byid.get('CE-2026-X').translationReview);assert.equal(corpus.amendments.length,6);
 for(const n of ['digesto_lote_031_040_2026_es_revisado.md','digesto_lote_031_040_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/41\/398/);assert.match(t,/357/);}
});

test('La exportación identifica los cotejos del Digesto como decisiones de 2026',()=>{
 const output=makeAnswer('SC-2026-CCVI',[byid.get('SC-2026-CCVI')],corpus,{language:'es'});
 assert.match(output,/Decisión del Digesto 2026 cotejada/);assert.doesNotMatch(output.split('\n### ')[0],/Texto histórico 2025 cotejado/);assert.doesNotMatch(output,/\*\*Traducción pendiente — original portugués/);
});

test('Digesto quinto lote: promulgación previa, nombramientos y pérdida de objeto',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_041_050.json');
 assert.equal(batch.ids.length,10);assert.equal(batch.newTranslations,9);assert.deepEqual(batch.previouslyTranslated,['SC-2026-CCI']);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal(v.externalCertification,false);}
 assert.equal(byid.get('SC-2026-CCI').status,'promulgada');assert.match(byid.get('SC-2026-CCI').textEs,/contenido aprobado en primera ronda/);assert.equal(corpus.amendments.length,6);
 for(const id of ['SC-2026-CXCIV','SC-2026-CXCIII']){assert.equal(byid.get(id).status,'archivada-sin-objeto');assert.match(byid.get(id).textEs,/ha perdido su objeto/);}
 assert.match(byid.get('SC-2026-CXCIII').textEs,/Instituto Presbiteriano Gammom/);assert.match(byid.get('SC-2026-CXCVI').textEs,/Willian do Santos Pereira/);assert.doesNotMatch(byid.get('SC-2026-CXCII').textEs,/2026[-–]2030/);assert.ok(byid.get('CE-2026-X').textEs);
 for(const n of ['digesto_lote_041_050_2026_es_revisado.md','digesto_lote_041_050_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/50\/398/);assert.match(t,/348/);}
});

test('Digesto lote ampliado: veinte decisiones, transición y condiciones completas',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_051_070.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.equal(byid.get('SC-2026-CXCI').status,'archivada-sin-objeto');assert.equal(byid.get('SC-2026-CLXXXV').status,'aprobada-con-transicion');assert.match(byid.get('SC-2026-CLXXXV').textEs,/hasta el SC 2030/);assert.match(byid.get('SC-2026-CLXXXV').textEs,/Revocar el reglamento interno de la JET/);assert.match(byid.get('SC-2026-CLXXXV').textEs,/5 miembros titulares, siendo 3 pastores y 2 presbíteros/);assert.match(byid.get('SC-2026-CLXXXV').textEs,/1 pastor y 2 presbíteros/);assert.match(byid.get('SC-2026-CLXXXII').textEs,/de 0,28% a 1,0%/);assert.match(byid.get('SC-2026-CLXXXII').textEs,/mediante aprobación de la Comisión Ejecutiva/);
 assert.match(byid.get('SC-2026-CLXXXI').textEs,/aprobadas en la reunión de su confección/);assert.match(byid.get('SC-2026-CLXXVIII').textEs,/POSITIVO CON EFECTO DE NEGATIVO/);assert.match(byid.get('SC-2026-CLXXVIII').textEs,/12 becas\/contratos/);assert.match(byid.get('SC-2026-CLXXV').textEs,/45%/);assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);
 for(const n of ['digesto_lote_051_070_2026_es_revisado.md','digesto_lote_051_070_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/70\/398/);assert.match(t,/328/);}
});

test('Digesto 71–90: estudios pendientes, autorizaciones condicionadas y consultas',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_071_090.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.equal(byid.get('SC-2026-CLXIV').status,'rechazada');assert.match(byid.get('SC-2026-CLXIV').textEs,/No atender la propuesta/);for(const id of ['SC-2026-CLXIII','SC-2026-CLX'])assert.equal(byid.get(id).status,'procedimiento-pendiente');
 assert.match(byid.get('SC-2026-CLXV').textEs,/90%/);assert.match(byid.get('SC-2026-CLXV').textEs,/tasas de visa/);assert.match(byid.get('SC-2026-CLXVI').textEs,/contraprestaciones de servicio docente/);
 for(const id of ['SC-2026-CLIX','SC-2026-CLVIII','SC-2026-CLVII','SC-2026-CLVI','SC-2026-CLV'])assert.equal(byid.get(id).status,'aprobada-con-transicion');assert.match(byid.get('SC-2026-CLVII').textEs,/cumplido lo dispuesto anteriormente/);assert.match(byid.get('SC-2026-CLVI').textEs,/después de recibir y aprobar un informe/);assert.match(byid.get('SC-2026-CLV').textEs,/a partir de 2027/);
 assert.match(byid.get('SC-2026-CLIV').textEs,/Vicepresidente del Consejo/);assert.match(byid.get('SC-2026-CLIV').textEs,/remita previamente la situación al Presbiterio/);assert.match(byid.get('SC-2026-CLII').textEs,/precedida de entrevista pastoral/);assert.equal((byid.get('SC-2026-CLIII').textEs.match(/^VI\./gm)||[]).length,2);assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);
 for(const n of ['digesto_lote_071_090_2026_es_revisado.md','digesto_lote_071_090_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/90\/398/);assert.match(t,/308/);}
});

test('Digesto 211–230: recursos, aprobación diferenciada y cifras incompatibles',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_211_230.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.match(byid.get('SC-2026-XXXI').textEs,/rectificar el campo TOTAL[\s\S]+a \+43/);assert.match(byid.get('SC-2026-XXVIII').textEs,/plazo de 30 días/);assert.match(byid.get('SC-2026-XXVII').textEs,/acta faltante \(Acta XVI\)/);assert.equal(byid.get('SC-2026-XXV').status,'procedimiento-pendiente');assert.doesNotMatch(byid.get('SC-2026-XXV').textEs,/Aprobar/);assert.match(byid.get('SC-2026-XXV').textEs,/&amp;90/);
 assert.match(byid.get('SC-2026-XXIV').textEs,/ocho presbiterios/);assert.match(byid.get('SC-2026-XXIV').textEs,/Cuatro \(04\) Presbiterios/);assert.match(byid.get('SC-2026-XXIV').textEs,/cuatro candidatos/);assert.match(byid.get('SC-2026-XXIV').textEs,/cuarenta y cuatro candidatos/);assert.match(byid.get('SC-2026-XXIII').textEs,/juicio de admisibilidad/);assert.match(byid.get('SC-2026-XXIII').textEs,/camino recursivo restante/);assert.match(byid.get('SC-2026-XXII').textEs,/pena de deposición/);assert.match(byid.get('SC-2026-XXII').textEs,/determinó el despojamiento/);
 assert.match(byid.get('SC-2026-XVI').textEs,/Aprobar las actas y los actos del Sínodo Norte Fluminense/);assert.equal((byid.get('SC-2026-XV').textEs.match(/^d\./gm)||[]).length,2);assert.match(byid.get('SC-2026-XIV').textEs,/Aprobar las actas y los actos/);assert.match(byid.get('SC-2026-XIV').textEs,/No aprobar el Informe de Registro Financiero/);assert.match(byid.get('SC-2026-XIV').textEs,/próxima CE-IPB-2027/);assert.match(byid.get('SC-2026-XIII').textEs,/estudio para la construcción/);
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
 for(const n of ['digesto_lote_211_230_2026_es_revisado.md','digesto_lote_211_230_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/230\/398/);assert.match(t,/168/);}
});
test('Digesto 191–210: datos incompletos, desempate y corrección aritmética',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_191_210.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.match(byid.get('SC-2026-LI').textEs,/16 UCP\?s/);assert.match(byid.get('SC-2026-LI').textEs,/13 UCPs/);assert.match(byid.get('SC-2026-L').textEs,/#######/);assert.match(byid.get('SC-2026-XLIX').textEs,/datos son incompletos/);assert.match(byid.get('SC-2026-XLIX').textEs,/3 Puntos de Predicación[\s\S]+3 Puntos de Predicación/);assert.match(byid.get('SC-2026-XLVIII').textEs,/02 Puntos de Predicación, 02 Puntos de Predicación/);
 assert.match(byid.get('SC-2026-XLIII').textEs,/reimpresa el acta de la 49ª reunión/);assert.match(byid.get('SC-2026-XLI').textEs,/lado derecho de las páginas fue cortada/);assert.match(byid.get('SC-2026-XXXVIII').textEs,/más antiguos respecto de la ordenación/);assert.match(byid.get('SC-2026-XXXVIII').textEs,/excluidos los que eventualmente estén compitiendo/);assert.match(byid.get('SC-2026-XXXVIII').textEs,/Piumhi - MG, 07 de julio de 2023/);
 assert.match(byid.get('SC-2026-XXXVI').textEs,/cinco presbiterios/);assert.match(byid.get('SC-2026-XXXVI').textEs,/compuesto por 6 presbiterios/);assert.match(byid.get('SC-2026-XXXIII').textEs,/Metropolitano de Capinas/);assert.equal((byid.get('SC-2026-XXXIX').textEs.match(/^IV\./gm)||[]).length,2);assert.match(byid.get('SC-2026-XXXII').textEs,/\?35/);assert.match(byid.get('SC-2026-XXXII').textEs,/columna Comulgantes a \+183/);assert.match(byid.get('SC-2026-XXXII').textEs,/No consta en la digitalización examinada/);
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
 for(const n of ['digesto_lote_191_210_2026_es_revisado.md','digesto_lote_191_210_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/210\/398/);assert.match(t,/188/);}
});
test('Digesto 171–190: rehacer actas, continuidad de Mesa y plazos concretos',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_171_190.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.match(byid.get('SC-2026-LXXI').textEs,/Aprobar los Actos practicados/);assert.match(byid.get('SC-2026-LXXI').textEs,/sean redactadas nuevamente/);assert.match(byid.get('SC-2026-LXXI').textEs,/nuevo libro de actas[\s\S]+CE-SC 2027/);assert.match(byid.get('SC-2026-LXIX').textEs,/\n3\. Que/);assert.doesNotMatch(byid.get('SC-2026-LXIX').textEs.split('El SC/IPB - 2026 Resuelve:')[0],/^2\./m);
 assert.match(byid.get('SC-2026-LXVII').textEs,/Mesa anterior en pleno ejercicio[\s\S]+posesión de los sucesores/);assert.match(byid.get('SC-2026-LXVII').textEs,/ratificar todos los actos/);assert.match(byid.get('SC-2026-LXVII').textEs,/recomposición inmediata de su Tribunal/);assert.match(byid.get('SC-2026-LXI').textEs,/R\$22\.480,05[\s\S]+R\$19\.480,05/);
 assert.match(byid.get('SC-2026-LX').textEs,/prohibido el bloqueo unilateral/);assert.match(byid.get('SC-2026-LX').textEs,/plazo de 60 días o remita una justificación/);assert.match(byid.get('SC-2026-LIX').textEs,/creación de la PJ[\s\S]+próxima reunión extraordinaria/);assert.match(byid.get('SC-2026-LVIII').textEs,/decisión es revocada/);assert.match(byid.get('SC-2026-LV').textEs,/Estatutos del SNI sean transcritos y aprobados por el pleno/);
 assert.match(byid.get('SC-2026-LIV').textEs,/46 40\n47 41\n48 42\n49 43/);assert.equal((byid.get('SC-2026-LIV').textEs.match(/^i\)/gm)||[]).length,2);assert.equal((byid.get('SC-2026-LII').textEs.match(/^IV\./gm)||[]).length,2);assert.match(byid.get('SC-2026-LIII').textEs,/plazo de 3 meses/);assert.match(byid.get('SC-2026-LIII').textEs,/máximo de 4 meses/);assert.match(byid.get('SC-2026-LIII').textEs,/plazo de 90 días/);
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
 for(const n of ['digesto_lote_171_190_2026_es_revisado.md','digesto_lote_171_190_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/190\/398/);assert.match(t,/208/);}
});
test('Digesto 151–170: sesiones distintas, cifras originales y correcciones expresas',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_151_170.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);assert.equal(z.status,'aprobada');}
 assert.match(byid.get('SC-2026-XC').textEs,/4\.467[\s\S]+883[\s\S]+5\.360/);assert.match(byid.get('SC-2026-LXXXIX').textEs,/1\.137[\s\S]+302[\s\S]+1\.493/);assert.match(byid.get('SC-2026-LXXXIX').textEs,/no concuerda con la realidad/);
 assert.match(byid.get('SC-2026-LXXXV').textEs,/una única acta de la Sesión Preparatoria/);assert.match(byid.get('SC-2026-LXXIX').textEs,/actas distintas para cada sesión/);assert.match(byid.get('SC-2026-LXXXI').textEs,/constar 4[\s\S]+35 admisiones y 31 bajas, y no 66/);assert.match(byid.get('SC-2026-LXXIX').textEs,/corregido de 321 a 47/);assert.match(byid.get('SC-2026-LXXIX').textEs,/«O SC\/IPB 2»/);
 assert.match(byid.get('SC-2026-LXXVIII').textEs,/30\.648\.315,87/);assert.match(byid.get('SC-2026-LXXVII').textEs,/13\.075\.923,35/);assert.match(byid.get('SC-2026-LXXVI').textEs,/no representando el acto de organización o inicio/);assert.match(byid.get('SC-2026-LXXV').textEs,/naturaleza exclusivamente correctiva/);assert.match(byid.get('SC-2026-LXXV').textEs,/06 de julio de 2024/);assert.match(byid.get('SC-2026-LXXIII').textEs,/redactada por el Segundo Secretario y transcrita y firmada por el Secretario Ejecutivo/);assert.match(byid.get('SC-2026-LXXII').textEs,/y no firmadas por el Segundo Secretario/);
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
 for(const n of ['digesto_lote_151_170_2026_es_revisado.md','digesto_lote_151_170_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/170\/398/);assert.match(t,/228/);}
});
test('Digesto 131–150: revocación CSM, fechas finales y correcciones sinodales',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_131_150.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.match(byid.get('SC-2026-CXI').textEs,/14 de febrero como el Día/);assert.match(byid.get('SC-2026-CV').textEs,/tercer domingo de octubre como el Día/);assert.equal(byid.get('SC-2026-CX').status,'rechazada');assert.equal(byid.get('SC-2026-CVIII').status,'rechazada');assert.equal(byid.get('SC-2026-CVII').status,'procedimiento-pendiente');assert.match(byid.get('SC-2026-CVII').textEs,/eventual propuesta de construcción/);
 assert.match(byid.get('SC-2026-CIX').textEs,/IV\. Revocar la decisión CE - 2026 - DOC\. CXIX/);assert.match(byid.get('SC-2026-CIX').textEs,/VIII\.[\s\S]+\nX\./);assert.match(byid.get('SC-2026-CIX').textEs,/7\. Evaluar la adopción ética/);assert.match(byid.get('SC-2026-CVI').textEs,/creando el Consejo Nacional/);assert.match(byid.get('SC-2026-CVI').textEs,/Nombrar la siguiente comisión/);
 assert.match(byid.get('SC-2026-CIV').textEs,/19:43[\s\S]+19:30/);assert.match(byid.get('SC-2026-CI').textEs,/0,9%[\s\S]+2\.833 a 3\.098/);assert.equal((byid.get('SC-2026-CI').textEs.match(/^II -/gm)||[]).length,2);assert.match(byid.get('SC-2026-XCVI').textEs,/supresión en futuras redacciones/);assert.match(byid.get('SC-2026-XCV').textEs,/fueron declarados nulos/);
 for(const id of ['SC-2026-XCIV','SC-2026-XCIII']){assert.match(byid.get(id).textEs,/preservando el registro original/);assert.match(byid.get(id).textEs,/plazo de 60 días/);assert.match(byid.get(id).textEs,/CE-SC\/IPB 2027/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
 for(const n of ['digesto_lote_131_150_2026_es_revisado.md','digesto_lote_131_150_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/150\/398/);assert.match(t,/248/);}
});
test('Digesto 111–130: excepciones de culto, límites disciplinarios y actos',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_111_130.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.match(byid.get('SC-2026-CXXVI').textEs,/No hay prohibición absoluta/);assert.match(byid.get('SC-2026-CXXVI').textEs,/reconocida como transitoria/);assert.match(byid.get('SC-2026-CXXVI').textEs,/II\.10\./);assert.match(byid.get('SC-2026-CXXIV').textEs,/no constituye una "cláusula pétrea"/);assert.equal(byid.get('SC-2026-CXXV').status,'rechazada');
 assert.match(byid.get('SC-2026-CXXII').textEs,/ni autorización para disciplina automática/);assert.match(byid.get('SC-2026-CXXII').textEs,/debido proceso eclesiástico/);assert.match(byid.get('SC-2026-CXXI').textEs,/no vinculando al Supremo Concilio/);assert.match(byid.get('SC-2026-CXX').textEs,/no constituye, por sí sola/);assert.match(byid.get('SC-2026-CXIX').textEs,/no se aplica a la denominación de espacios físicos/);assert.match(byid.get('SC-2026-CXVIII').textEs,/no fija de antemano un límite máximo temporal/);assert.match(byid.get('SC-2026-CXVIII').textEs,/establece en acta una fecha futura/);assert.match(byid.get('SC-2026-CXV').textEs,/aisladamente, no basta para la reprobación/);
 assert.match(byid.get('SC-2026-CXXIII').textEs,/Revocar el inciso X/);assert.equal((byid.get('SC-2026-CXXIII').textEs.match(/^4\./gm)||[]).length,2);assert.match(byid.get('SC-2026-CXXX').textEs,/\nVI\.[\s\S]+\nV\./);assert.equal((byid.get('SC-2026-CXXVIII').textEs.match(/^c\./gm)||[]).length,2);assert.match(byid.get('SC-2026-CXVI').textEs,/47,6%/);assert.equal(byid.get('SC-2026-CXIV').status,'rechazada');assert.equal(byid.get('SC-2026-CXII').status,'rechazada');assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);
 for(const n of ['digesto_lote_111_130_2026_es_revisado.md','digesto_lote_111_130_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/130\/398/);assert.match(t,/268/);}
});
test('Digesto 91–110: condiciones de consultas, menores, misión y actas',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_091_110.json');
 assert.equal(batch.ids.length,20);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);}
 assert.equal(byid.get('SC-2026-CL').status,'rechazada');assert.equal(byid.get('SC-2026-CXLVIII').status,'procedimiento-pendiente');assert.match(byid.get('SC-2026-CXLVII').textEs,/el uso del jugo de uva/);assert.match(byid.get('SC-2026-CXLVII').textEs,/no configura la introducción de un elemento ajeno/);assert.match(byid.get('SC-2026-CXLIII').textEs,/comuniquen inmediatamente a las autoridades competentes/);assert.match(byid.get('SC-2026-CXLIII').textEs,/sin conducir una investigación interna sustitutiva/);assert.match(byid.get('SC-2026-CXLIII').textEs,/una vez reconocida su incidencia/);
 assert.match(byid.get('SC-2026-CXLIX').textEs,/no puede restringir derechos constitucionales/);assert.match(byid.get('SC-2026-CXLIX').textEs,/comprobación de la regularidad de las contribuciones/);assert.equal(byid.get('SC-2026-CXL').status,'procedimiento-pendiente');assert.match(byid.get('SC-2026-CXL').textEs,/Otorgar plenos poderes/);assert.match(byid.get('SC-2026-CXXXIII').textEs,/113 \(ciento trece\)/);assert.match(byid.get('SC-2026-CXXXII').textEs,/CE-E2-SC\/IPB 2025/);assert.match(byid.get('SC-2026-CXXXII').textEs,/CE-1E-SC\/IPB - 2025/);assert.ok(byid.get('CE-2026-X').textEs);assert.equal(corpus.amendments.length,6);
 for(const n of ['digesto_lote_091_110_2026_es_revisado.md','digesto_lote_091_110_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## (SC-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/110\/398/);assert.match(t,/288/);}
});

test('Digesto 231–250: límite SC/CE, estudios y condiciones patrimoniales',()=>{
 const read=n=>JSON.parse(readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8'));const reviews=read('revision_semantica_digesto.json'),batch=read('digesto_lote_231_250.json');
 assert.equal(batch.ids.length,20);assert.equal(batch.ids.filter(x=>x.startsWith('SC-')).length,8);assert.equal(batch.ids.filter(x=>x.startsWith('CE-')).length,12);assert.equal(corpus.metadata.translationProgress.digesto.translated,398);assert.equal(corpus.metadata.digestoReviewProgress.comparedDecisions,398);assert.equal(corpus.metadata.digestoReviewProgress.nextId,null);
 for(const id of batch.ids){const z=byid.get(id),v=reviews[id];assert.equal(createHash('sha256').update(z.textOriginal).digest('hex'),v.sourceHash);assert.equal(createHash('sha256').update(z.textEs).digest('hex'),v.translationHash);assert.deepEqual(z.textEs.match(/\d+/g),z.textOriginal.match(/\d+/g));assert.equal(reading(z,'es').comparativeReviewCompleteForUnit,true);assert.equal((z.textEs.match(/§/g)||[]).length,(z.textOriginal.match(/§/g)||[]).length);assert.equal(z.source,'digesto');}
 assert.match(byid.get('SC-2026-X').textEs,/no crea una entidad autárquica[\s\S]+dotación presupuestaria automática/);assert.match(byid.get('SC-2026-IX').textEs,/sin aprobar de inmediato la creación de un beneficio pecuniario nacional/);assert.match(byid.get('SC-2026-IX').textEs,/sin excluir la responsabilidad del Presbiterio/);assert.equal(byid.get('SC-2026-VIII').status,'rechazada');assert.match(byid.get('SC-2026-VIII').textEs,/no afecta los mandatos en curso/);assert.match(byid.get('SC-2026-VII').textEs,/sin necesidad de esperar una decisión previa/);assert.match(byid.get('SC-2026-VII').textEs,/no transfiere al Sínodo organizador/);
 assert.match(byid.get('SC-2026-VI').textEs,/ministerio general en el que el testimonio del evangelio es proclamado por hombres y mujeres/);assert.equal(byid.get('SC-2026-V').status,'rechazada');assert.equal(byid.get('SC-2026-IV').status,'rechazada');
 assert.match(byid.get('CE-2026-CLXIII').textEs,/conforme a la planilla anexa/);assert.match(byid.get('CE-2026-CLXII').textEs,/8,78%/);assert.match(byid.get('CE-2026-CLXII').textEs,/dictamen del área jurídica/);assert.equal(byid.get('CE-2026-CLX').status,'procedimiento-pendiente');assert.match(byid.get('CE-2026-CLX').textEs,/remitirla a la 41ª/);assert.match(byid.get('CE-2026-CLIX').textEs,/No aceptar la propuesta de liquidación/);assert.match(byid.get('CE-2026-CLIX').textEs,/estudios para asumir la administración/);assert.match(byid.get('CE-2026-CLVIII').textEs,/si corresponde/);assert.equal(byid.get('CE-2026-CLVII').status,'procedimiento-pendiente');
 assert.match(byid.get('CE-2026-CLV').textEs,/No vender ni ceder, a título oneroso o gratuito/);assert.match(byid.get('CE-2026-CLV').textEs,/solamente la mitad de los costos/);assert.match(byid.get('CE-2026-CLV').textEs,/en lo que contradiga esta resolución/);assert.match(byid.get('CE-2026-CLIII').textEs,/Autorización de Compra[\s\S]+Autorizar la venta/);assert.match(byid.get('CE-2026-CLIII').textEs,/11 de agosto de 2026/);assert.match(byid.get('CE-2026-CLIII').textEs,/error material/);assert.match(byid.get('CE-2026-CLII').textEs,/sin cargas para la IPB/);
 for(const n of ['digesto_lote_231_250_2026_es_revisado.md','digesto_lote_231_250_2026_pt.md']){const t=readFileSync(new URL('../documentos/'+n,import.meta.url),'utf8');assert.deepEqual([...t.matchAll(/^## ((?:SC|CE)-2026-\w+)$/gm)].map(x=>x[1]),batch.ids);assert.match(t,/250\/398/);assert.match(t,/148/);}
 assert.ok(byid.get('CE-2026-X').textEs);assert.ok(byid.get('CE-2026-X').translationReview);assert.equal(corpus.amendments.length,6);assert.equal(corpus.metadata.spanishManualApprovedAsDefinitiveSource,false);
});
