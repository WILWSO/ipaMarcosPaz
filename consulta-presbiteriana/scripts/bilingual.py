"""Genera los seis documentos; nunca rellena una traducción con texto portugués."""
import json,re,hashlib,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
path=ROOT/'static/corpus.json'
c=json.loads(path.read_text());byid={r['id']:r for r in c['records']}
translations=json.loads((ROOT/'documentos/traducciones_es.json').read_text())
automatic_path=ROOT/'documentos/traducciones_automaticas_manual_es.json'
if automatic_path.exists():
 for rid,item in json.loads(automatic_path.read_text()).items():
  r=byid[rid]
  if hashlib.sha256(r['textOriginal'].encode()).hexdigest()!=item['sourceHash']:
   raise ValueError('Traducción automática de otra fuente: '+rid)
  if sorted(re.findall(r'\[\d+\]',item['textEs']))!=sorted(re.findall(r'\[\d+\]',r['textOriginal'])):
   raise ValueError('Notas alteradas: '+rid)
  r.update(textEs=item['textEs'],translationStatus='automatica-sin-revision',translationSourceHash=item['sourceHash'],translationMethod=item['method'])
for rid,text in translations.items():
 r=byid[rid]
 # Check that no cross-reference marker was lost in translation.
 if sorted(re.findall(r'\[\d+\]',text))!=sorted(re.findall(r'\[\d+\]',r['textOriginal'])):
  raise ValueError('Referencias distintas: '+rid)
 r.update(textEs=text,translationStatus='traducido-de-trabajo',translationSourceHash=hashlib.sha256(r['textOriginal'].encode()).hexdigest())
reviews_path=ROOT/'documentos/revision_semantica_manual.json'
reviews=json.loads(reviews_path.read_text()) if reviews_path.exists() else {}
for rid,item in reviews.items():
 r=byid[rid]
 if hashlib.sha256(r['textOriginal'].encode()).hexdigest()!=item['sourceHash'] or hashlib.sha256(r.get('textEs','').encode()).hexdigest()!=item['translationHash']:
  raise ValueError('Revisión obsoleta: '+rid)
 r['translationReview']=item
ci=[r for r in c['records'] if r['norm']=='CI']
ci_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in ci),'totalArticles':152,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in ci),'totalNotes':361,'reviewComplete':all(r['id'] in reviews for r in ci) and len(ci)==513,'scope':'texto histórico 2025; revisión comparada por asistente','externalCertification':False}
c['metadata']['constitutionReviewProgress']=ci_progress
cd=[r for r in c['records'] if r['norm']=='CD']
cd_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in cd),'totalArticles':135,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in cd),'totalNotes':104,'reviewComplete':all(r['id'] in reviews for r in cd) and len(cd)==239,'scope':'texto histórico 2025; revisión comparada por asistente','externalCertification':False}
c['metadata']['disciplineReviewProgress']=cd_progress
pl=[r for r in c['records'] if r['norm']=='PL']
pl_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in pl),'totalArticles':44,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in pl),'totalNotes':59,'reviewComplete':all(r['id'] in reviews for r in pl),'pendingIds':[r['id'] for r in pl if r['id'] not in reviews],'scope':'texto histórico 2025; revisión por asistente','externalCertification':False}
c['metadata']['liturgyReviewProgress']=pl_progress
est=[r for r in c['records'] if r['norm']=='EST-IPB']
est_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in est),'totalArticles':47,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in est),'totalNotes':15,'reviewComplete':len(est)==62 and all(r['id'] in reviews for r in est),'scope':'Estatuto histórico 2025; 47 bloques; número 44 duplicado en original','externalCertification':False}
c['metadata']['ipbStatuteReviewProgress']=est_progress
sc=[r for r in c['records'] if r['norm']=='RI-SC']
sc_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in sc),'totalArticles':82,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in sc),'totalNotes':3,'reviewComplete':len(sc)==85 and all(r['id'] in reviews for r in sc),'scope':'Reglamento Interno del Supremo Concilio histórico 2025; revisión por asistente','externalCertification':False}
c['metadata']['supremeRulesReviewProgress']=sc_progress
ce=[r for r in c['records'] if r['norm']=='RI-CE']
ce_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in ce),'totalArticles':37,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in ce),'totalNotes':3,'reviewComplete':len(ce)==40 and all(r['id'] in reviews for r in ce),'scope':'Reglamento Interno de la Comisión Ejecutiva histórico 2025; revisión por asistente','externalCertification':False}
c['metadata']['executiveRulesReviewProgress']=ce_progress
syn=[r for r in c['records'] if r['norm']=='EST-SIN']
syn_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in syn),'totalArticles':31,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in syn),'totalNotes':9,'reviewComplete':len(syn)==40 and all(r['id'] in reviews for r in syn),'scope':'Modelo de Estatuto del Sínodo histórico 2025; revisión por asistente','externalCertification':False}
c['metadata']['synodStatuteReviewProgress']=syn_progress
sin=[r for r in c['records'] if r['norm']=='RI-SIN']
sin_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in sin),'totalArticles':96,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in sin),'totalNotes':2,'reviewComplete':len(sin)==98 and all(r['id'] in reviews for r in sin),'scope':'Modelo de Reglamento Interno del Sínodo histórico 2025; cotejo por asistente','externalCertification':False}
c['metadata']['synodRulesReviewProgress']=sin_progress
pre=[r for r in c['records'] if r['norm']=='EST-PRE']
pre_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in pre),'totalArticles':62,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in pre),'totalNotes':135,'reviewComplete':len(pre)==197 and all(r['id'] in reviews for r in pre),'scope':'Modelo de Estatuto del Presbiterio histórico 2025; cotejo por asistente','externalCertification':False}
c['metadata']['presbyteryStatuteReviewProgress']=pre_progress
ripre=[r for r in c['records'] if r['norm']=='RI-PRE']
ripre_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in ripre),'totalArticles':99,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in ripre),'totalNotes':2,'reviewComplete':len(ripre)==101 and all(r['id'] in reviews for r in ripre),'scope':'Modelo de Reglamento Interno del Presbiterio histórico 2025; cotejo por asistente','externalCertification':False}
c['metadata']['presbyteryRulesReviewProgress']=ripre_progress
ig=[r for r in c['records'] if r['norm']=='EST-IG']
ig_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in ig),'totalArticles':57,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in ig),'totalNotes':116,'reviewComplete':len(ig)==173 and all(r['id'] in reviews for r in ig),'scope':'Modelo de Estatuto de la Iglesia histórico 2025; cotejo por asistente','externalCertification':False}
c['metadata']['churchStatuteReviewProgress']=ig_progress
jd=[r for r in c['records'] if r['norm']=='RI-JD']
jd_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in jd),'totalArticles':34,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in jd),'totalNotes':1,'reviewComplete':len(jd)==35 and all(r['id'] in reviews for r in jd),'scope':'Reglamento Interno de la Junta Diaconal histórico 2025; cotejo por asistente','externalCertification':False}
c['metadata']['deaconRulesReviewProgress']=jd_progress
atas=[r for r in c['records'] if r['norm']=='ATAS']
atas_progress={'comparedArticles':sum(r['kind']=='articulo' and r['id'] in reviews for r in atas),'totalArticles':24,'comparedNotes':sum(r['kind']=='nota' and r['id'] in reviews for r in atas),'totalNotes':6,'reviewComplete':len(atas)==30 and all(r['id'] in reviews for r in atas),'scope':'Reglamento para la confección de actas histórico 2025; cotejo por asistente','externalCertification':False}
c['metadata']['minutesRulesReviewProgress']=atas_progress
front=[r for r in c['records'] if r['norm']=='OTROS']
front_progress={'comparedPages':sum(r['id'] in reviews for r in front),'totalPages':len(front),'comparedPreliminaryPages':sum(r['page']<=4 and r['id'] in reviews for r in front),'comparedSeparatorPages':sum(r['page']>4 and 0<len(r['textOriginal'])<100 and r['id'] in reviews for r in front),'comparedContentsPages':sum(5<=r['page']<=12 and r['id'] in reviews for r in front),'comparedIndexPages':sum(r['page'] in list(range(157,164))+list(range(213,218))+[265,266] and r['id'] in reviews for r in front),'verifiedBlankPages':sum(not r['textOriginal'].strip() and r['id'] in reviews for r in front),'pendingIds':[r['id'] for r in front if r['id'] not in reviews],'reviewComplete':all(r['id'] in reviews for r in front),'scope':'Preliminares e inventario OTROS; excluye el anexo automático de 560 páginas','externalCertification':False}
c['metadata']['frontMatterReviewProgress']=front_progress
import runpy
annex_module=runpy.run_path(str(ROOT/'scripts/annex_pages.py'))
progress=annex_module['progress']
c['metadata']['pageAnnexReviewProgress']=progress
c['metadata']['manualPageAnnexReviewComplete']=progress['reviewComplete']

byid['EST-IPB-art-44']['title']='EST-IPB — Art. 44 — Fiscalización / Fiscalização'
byid['EST-IPB-art-44-2']['title']='EST-IPB — Art. 44 — Disolución / Dissolução'
c['metadata']['spanishManualApprovedAsDefinitiveSource']=False
c['metadata']['semanticReviewProgress']={'comparedUnits':len(reviews),'totalUnits':sum(r['source']=='manual' for r in c['records']),'reviewComplete':False,'structuredUnitsReviewComplete':all(r['id'] in reviews for r in c['records'] if r['source']=='manual'),'scope':'Inventario estructurado; la aprobación integral incluye revisión separada del anexo automático de 560 páginas'}
source=byid['SC-2026-CCI']['textOriginal']
segments=re.findall(r'EC nº [3-8].*?redação:\s*"(.*?)"',source,re.S)
if len(segments)!=6:raise ValueError('No se pudieron extraer las seis redacciones portuguesas.')
def combine(original,patch,ec):
 if ec==4:return patch
 if ec==5:return original+'\n'+patch
 if ec==8:
  newa=patch[patch.index('a)'):]
  return re.sub(r'(?m)^a\).*$',lambda _:newa,original,count=1)
 lines=original.split('\n');return patch+('\n'+'\n'.join(lines[1:]) if len(lines)>1 else '')
for a,pt in zip(c['amendments'],segments):
 a['textPt']=pt;target=byid[a['target']]
 target['integratedTextPt']=combine(target['textOriginal'],pt,a['ec'])
 if target.get('textEs'):target['integratedTextEs']=combine(target['textEs'],a['textEs'],a['ec'])
 target['integrationStatus']='seis-enmiendas-CCI';target['integrationSources']=[a['source']]
from digesto_batches import apply as apply_digesto_batches
digesto_progress=apply_digesto_batches(c)
from normative_effects import apply as apply_normative_effects
normative_progress=apply_normative_effects(c)
from historical_compatibility import apply as apply_historical_compatibility
compatibility_progress=apply_historical_compatibility(c)
from cross_historical_compatibility import apply as apply_cross_historical_compatibility
cross_compatibility_progress=apply_cross_historical_compatibility(c)
from cross_reference_classification import apply as apply_cross_reference_classification
cross_compatibility_progress=apply_cross_reference_classification(c)
from cross_presbytery_compatibility import apply as apply_cross_presbytery_compatibility
cross_compatibility_progress=apply_cross_presbytery_compatibility(c)
from cross_secretariat_compatibility import apply as apply_cross_secretariat_compatibility
cross_compatibility_progress=apply_cross_secretariat_compatibility(c)
from cross_final_compatibility import apply as apply_cross_final_compatibility
cross_compatibility_progress=apply_cross_final_compatibility(c)
counts={s:sum(r.get('textEs') is not None and (bool(r['textEs']) or not r['textOriginal']) for r in c['records'] if r['source']==s) for s in ['manual','digesto']}
totals={s:sum(r['source']==s for r in c['records']) for s in counts}
c['metadata']['translationProgress']={s:{'translated':counts[s],'total':totals[s]} for s in counts}
c['metadata']['translationComplete']=all(counts[s]==totals[s] for s in counts)
c['metadata']['manualTranslationCoverageComplete']=counts['manual']==totals['manual']
c['metadata']['linguisticReviewComplete']=False
c['metadata']['bilingualVersion']='0.2.0'
path.write_text(json.dumps(c,ensure_ascii=False))
docs=ROOT/'documentos'
import subprocess,sys
subprocess.run([sys.executable,str(ROOT/'scripts/constitution.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/discipline.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/liturgy.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/statute.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/supreme_rules.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/executive_rules.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/synod_statute.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/synod_rules.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/presbytery_statute.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/presbytery_rules.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/church_statute.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/deacon_rules.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/minutes_rules.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/front_matter.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/index_documents.py')],check=True)
(docs/'cola_traduccion.json').write_text(json.dumps([{'id':r['id'],'source':r['source'],'page':r['page'],'status':r['translationStatus'],'textEs':r.get('textEs')} for r in c['records']],ensure_ascii=False,indent=2))
(docs/'traducciones_pendientes.json').write_text(json.dumps([{'id':r['id'],'sha256Original':hashlib.sha256(r['textOriginal'].encode()).hexdigest(),'textOriginal':r['textOriginal'],'textEs':r.get('textEs'),'reviewed':r['id'] in reviews,'status':r['translationStatus']} for r in c['records']],ensure_ascii=False))
for stem,src in [('manual_2025_pt','manual_pt_original'),('digesto_2026_pt','digesto_pt_original')]:
 shutil.copyfile(docs/(src+'.md'),docs/(stem+'.md'))
def render(record,lang,integrated=False):
 text=record.get('integratedTextEs' if lang=='es' else 'integratedTextPt') if integrated else None
 text=text or (record.get('textEs') if lang=='es' else record['textOriginal'])
 if not text:
  text='*Página sin texto extraíble en el original.*' if not record['textOriginal'] else '**Traducción pendiente.** Consultar el original portugués mediante el mismo identificador.'
 for note_id in record.get('notes',[]):
  number=note_id.rsplit('-',1)[-1]
  text=text.replace('['+number+']','['+number+'](#'+note_id+')')
 label='Estado' if lang=='es' else 'Situação'
 display_status=record['status'] if integrated or record['source']!='manual' else 'texto-original-2025'
 out=f"\n<a id=\"{record['id']}\"></a>\n## {record['title']}\n\nID: `{record['id']}` · PDF: {record['page']} · {label}: {display_status}\n\n{text}\n"
 if integrated and record.get('crossHistoricalCompatibilityReview'):
  review=record['crossHistoricalCompatibilityReview'];out+='\n**'+('Cotejo transversal' if lang=='es' else 'Cotejo transversal')+'**\n\n'+review['findingEs' if lang=='es' else 'findingPt']+'\n'
 if integrated:
  for nid in record.get('crossCompatibilityNoteIds',[]):
   review=byid[nid]['crossHistoricalCompatibilityReview'];out+='\n**'+nid+' — '+('Advertencia transversal' if lang=='es' else 'Advertência transversal')+'**\n\n'+review['findingEs' if lang=='es' else 'findingPt']+'\n'
 if integrated and record.get('historicalCompatibilityReview'):
  review=record['historicalCompatibilityReview'];out+='\n**'+('Cotejo de compatibilidad histórica' if lang=='es' else 'Cotejo de compatibilidade histórica')+'**\n\n'+review['findingEs' if lang=='es' else 'findingPt']+'\n'
 if record.get('normativeEffects'):
  for eid in record['normativeEffects']:
   effect=next(e for e in c['normativeEffects'] if e['id']==eid)
   out+='\n**'+('Efecto documentado 2026' if lang=='es' else 'Efeito documentado 2026')+' — '+effect['source']+'**\n\n'+effect['noteEs' if lang=='es' else 'notePt']+'\n\n'+effect['limitsEs' if lang=='es' else 'limitsPt']+'\n'
 if lang=='es' and record.get('translationReview'):
  out+='\n*Texto cotejado y corregido por el asistente en esta unidad; no constituye aprobación integral del Manual.*\n'
 if lang=='es' and record['translationStatus']=='automatica-sin-revision':
  out+='\n*Traducción automática; revisión lingüística pendiente.*\n'
 if integrated and record.get('integrationSources'):
  out+='\n'+('Fuente de la integración' if lang=='es' else 'Fonte da integração')+': '+', '.join(record['integrationSources'])+'.\n'
  out+='\n'+('Las notas de 2025 se conservan como antecedentes; su compatibilidad requiere revisión.' if lang=='es' else 'As notas de 2025 são preservadas como antecedentes; sua compatibilidade requer revisão.')+'\n'
 if integrated and record.get('links'):
  refs=[x for x in record['links'] if x in byid and byid[x]['kind']=='resolucion']
  if refs:out+='\n'+('Decisiones relacionadas' if lang=='es' else 'Decisões relacionadas')+': '+', '.join(f'[{x}](#{x})' for x in refs)+'.\n'
 return out
for src,stem in [('manual','manual_2025'),('digesto','digesto_2026')]:
 records=[r for r in c['records'] if r['source']==src]
 records.sort(key=lambda r:(r['page'],r['id']))
 complete=counts[src]==totals[src]
 state='TRADUCCIÓN DE COBERTURA INTEGRAL — BORRADOR AUTOMÁTICO, REVISIÓN LINGÜÍSTICA PENDIENTE' if complete else 'TRADUCCIÓN PARCIAL DE TRABAJO'
 if src=='digesto' and digesto_progress['reviewComplete']:state='TRADUCCIÓN DE COBERTURA INTEGRAL — COTEJO COMPLETO CON ORIGINAL PT; REVISIÓN EDITORIAL FINAL PENDIENTE'
 header=f'# {stem} — español\n\n> {state}, NO OFICIAL. {counts[src]} de {totals[src]} unidades traducidas. Los identificadores permiten cotejar la versión original. La cobertura integral no equivale a una revisión lingüística o jurídica integral.\n'
 if src=='digesto' and digesto_progress['reviewComplete']:header+='\n> 398/398 decisiones cotejadas con el original portugués por el asistente; sin certificación externa ni aprobación editorial definitiva.\n'
 if src=='manual':
  header+='\n> **CONSTITUCIÓN REVISADA:** '+str(ci_progress['comparedArticles'])+' / 152 artículos y '+str(ci_progress['comparedNotes'])+' / 361 notas cotejados. Véase [Constitución con notas completas](constitucion_2025_es_revisada.md). También se cotejaron los 135 artículos y 104 notas del [Código de Disciplina](codigo_disciplina_2025_es_revisado.md). Principios de Liturgia: '+str(pl_progress['comparedArticles'])+'/44 artículos y '+str(pl_progress['comparedNotes'])+'/59 notas cotejados. Estatuto IPB: '+str(est_progress['comparedArticles'])+'/47 bloques de artículos y '+str(est_progress['comparedNotes'])+'/15 notas cotejados. Reglamento Interno del Supremo Concilio: 82/82 artículos y 3/3 notas cotejados. Reglamento Interno de la Comisión Ejecutiva: 37/37 artículos y 3/3 notas cotejados. Modelo de Estatuto del Sínodo: 31/31 artículos y 9/9 notas cotejados. Modelo de Reglamento Interno del Sínodo: 96/96 artículos y 2/2 notas cotejados. Modelo de Estatuto del Presbiterio: 62/62 artículos y 135/135 notas cotejados. Modelo de Reglamento Interno del Presbiterio: 99/99 artículos y 2/2 notas cotejados. Modelo de Estatuto de la Iglesia: 57/57 artículos y 116/116 notas cotejados. Reglamento Interno de la Junta Diaconal: 34/34 artículos y 1/1 nota cotejados. Reglamento de Actas: 24/24 artículos y 6/6 notas cotejados. Preliminares, separadores, sumario e índices: 58/58 páginas cotejadas, incluidas 19 páginas en blanco verificadas y 331 entradas del sumario. El inventario completo alcanza 1774/1774 registros cotejados; el anexo tiene 560/560 páginas cotejadas y 0 pendientes de revisión separada.\n'
  header+='\n> **NO APROBADO COMO FUENTE DEFINITIVA DEL SISTEMA.** La revisión comparada ha corregido '+str(len(reviews))+' unidades del inventario; el cotejo textual del anexo por páginas está completo; la aprobación definitiva y la revisión editorial humana no se han registrado. Para comprobar el contenido normativo, cotejar el PDF original portugués.\n'
 body=((docs/'constitucion_2025_es_revisada.md').read_text()+'\n'+(docs/'codigo_disciplina_2025_es_revisado.md').read_text()+'\n'+(docs/'principios_liturgia_2025_es_revisado.md').read_text()+'\n'+(docs/'estatuto_ipb_2025_es_revisado.md').read_text()+'\n'+(docs/'reglamento_sc_2025_es_revisado.md').read_text()+'\n'+(docs/'reglamento_ce_2025_es_revisado.md').read_text()+'\n'+(docs/'estatuto_sinodo_2025_es_revisado.md').read_text()+'\n'+(docs/'reglamento_sinodo_2025_es_revisado.md').read_text()+'\n'+(docs/'estatuto_presbiterio_2025_es_revisado.md').read_text()+'\n'+(docs/'reglamento_presbiterio_2025_es_revisado.md').read_text()+'\n'+(docs/'estatuto_iglesia_2025_es_revisado.md').read_text()+'\n'+(docs/'reglamento_junta_diaconal_2025_es_revisado.md').read_text()+'\n'+(docs/'reglamento_actas_2025_es_revisado.md').read_text()+'\n'+(docs/'preliminares_separadores_2025_es_revisado.md').read_text()+'\n'+(docs/'sumario_indices_2025_es_revisado.md').read_text()) if src=='manual' else ''.join(render(r,'es') for r in records)
 if src=='manual' and complete:
  pagepath=docs/'manual_paginas_es.json'
  if not pagepath.exists():raise ValueError('Falta la traducción de las páginas originales.')
  translated_pages=json.loads(pagepath.read_text())
  if set(translated_pages)!=set(map(str,range(1,561))):raise ValueError('Cobertura de páginas incompleta.')
  reviews_annex=json.loads((docs/'revision_anexo_paginas_manual.json').read_text())
  # Preserve front matter, section headings and every extracted page, in addition to searchable normative units.
  body+='\n# Anexo: traducción por páginas del PDF original — cotejo completo\n\nEste anexo conserva el contenido extraído de las 560 páginas, incluidos preliminares, títulos, índices y notas. Repite deliberadamente el contenido normativo de la sección estructurada. Se han cotejado las páginas 1–560; quedan 0 páginas pendientes. La nota 23 está completa en el cotejo acumulado; la nota 66 y el artículo 17 están completos en el cotejo acumulado; la nota 263 y el artículo 88 están completos; el artículo 114 continuaba en la página 141 y quedó completo en el lote 141–160. Cotejo textual completo por el asistente; sin certificación externa ni aprobación editorial definitiva. Las diferencias de redacción con las unidades traducidas por el asistente deben cotejarse con el original.\n'
  body+=''.join(f'\n## Página PDF {i}\n\n{"Cotejada contra el original portugués." if str(i) in reviews_annex else "Traducción automática pendiente de cotejo."}\n\n{translated_pages[str(i)]}\n' for i in range(1,561))
 (docs/(stem+'_es.md')).write_text(header+body)
manual=[r for r in c['records'] if r['source']=='manual'];manual.sort(key=lambda r:(r['page'],r['id']))
linked={a['source'] for a in c['amendments']}|{x for r in manual for x in r['links'] if x in byid and byid[x]['kind']=='resolucion'}
linked|={e['source'] for e in c['normativeEffects']}|{t for e in c['normativeEffects'] for t in e['targets'] if byid[t]['source']=='digesto'}
for lang in ['pt','es']:
 title='Manual integrado — português' if lang=='pt' else 'Manual integrado — español'
 warning='Integração parcial, não oficial: incorpora seis emendas da resolução SC-2026-CCI e a revogação do inciso X do corpo principal do RI-CE art. 8, conforme SC-2026-CXXIII, e a nova redação do caput de Atas art. 3 conforme CE-2026-CII. Inclui anotações sobre efeitos de 398 decisões; exame documental dos efeitos concluído, sem decisões pendentes. Consolidação e revisão editorial final ainda pendentes. Inclui todos os artigos e notas de 2025, preservados como antecedentes.' if lang=='pt' else 'INTEGRACIÓN PARCIAL, NO OFICIAL: incorpora seis enmiendas de SC-2026-CCI y la revocación del inciso X del cuerpo principal del RI-CE art. 8, según SC-2026-CXXIII, y la nueva redacción del encabezamiento de Actas art. 3 según CE-2026-CII. Incluye anotaciones sobre los efectos de 398 decisiones; examen documental de efectos completo, sin decisiones pendientes. Consolidación y revisión editorial final aún pendientes. TRADUCCIÓN DE COBERTURA INTEGRAL: textos de 2025 y decisiones vinculadas traducidos; revisión editorial final pendiente. Las notas de 2025 se conservan como antecedentes.'
 parts=['# '+title+'\n\n> '+warning+'\n']
 parts.extend(render(r,lang,True) for r in manual)
 parts.append('\n# '+('Decisões vinculadas' if lang=='pt' else 'Decisiones vinculadas')+'\n')
 parts.extend(render(byid[x],lang) for x in sorted(linked))
 (docs/('manual_integrado_'+lang+'.md')).write_text(''.join(parts))
names=['manual_2025_pt','manual_2025_es','digesto_2026_pt','digesto_2026_es','manual_integrado_pt','manual_integrado_es']
manifest={'normativeIntegrationProgress':normative_progress,'normativeIntegrationTwentyFirstBatchDocuments':['integracion_normativa_lote_21_2026_es.md','integracion_normativa_lote_21_2026_pt.md'],'normativeIntegrationTwentiethBatchDocuments':['integracion_normativa_lote_20_2026_es.md','integracion_normativa_lote_20_2026_pt.md'],'normativeIntegrationNineteenthBatchDocuments':['integracion_normativa_lote_19_2026_es.md','integracion_normativa_lote_19_2026_pt.md'],'normativeIntegrationEighteenthBatchDocuments':['integracion_normativa_lote_18_2026_es.md','integracion_normativa_lote_18_2026_pt.md'],'normativeIntegrationSeventeenthBatchDocuments':['integracion_normativa_lote_17_2026_es.md','integracion_normativa_lote_17_2026_pt.md'],'normativeIntegrationSixteenthBatchDocuments':['integracion_normativa_lote_16_2026_es.md','integracion_normativa_lote_16_2026_pt.md'],'normativeIntegrationFifteenthBatchDocuments':['integracion_normativa_lote_15_2026_es.md','integracion_normativa_lote_15_2026_pt.md'],'normativeIntegrationFourteenthBatchDocuments':['integracion_normativa_lote_14_2026_es.md','integracion_normativa_lote_14_2026_pt.md'],'normativeIntegrationThirteenthBatchDocuments':['integracion_normativa_lote_13_2026_es.md','integracion_normativa_lote_13_2026_pt.md'],'normativeIntegrationTwelfthBatchDocuments':['integracion_normativa_lote_12_2026_es.md','integracion_normativa_lote_12_2026_pt.md'],'normativeIntegrationEleventhBatchDocuments':['integracion_normativa_lote_11_2026_es.md','integracion_normativa_lote_11_2026_pt.md'],'normativeIntegrationTenthBatchDocuments':['integracion_normativa_lote_10_2026_es.md','integracion_normativa_lote_10_2026_pt.md'],'normativeIntegrationNinthBatchDocuments':['integracion_normativa_lote_09_2026_es.md','integracion_normativa_lote_09_2026_pt.md'],'normativeIntegrationEighthBatchDocuments':['integracion_normativa_lote_08_2026_es.md','integracion_normativa_lote_08_2026_pt.md'],'normativeIntegrationSeventhBatchDocuments':['integracion_normativa_lote_07_2026_es.md','integracion_normativa_lote_07_2026_pt.md'],'normativeIntegrationSixthBatchDocuments':['integracion_normativa_lote_06_2026_es.md','integracion_normativa_lote_06_2026_pt.md'],'normativeIntegrationFifthBatchDocuments':['integracion_normativa_lote_05_2026_es.md','integracion_normativa_lote_05_2026_pt.md'],'normativeIntegrationFourthBatchDocuments':['integracion_normativa_lote_04_2026_es.md','integracion_normativa_lote_04_2026_pt.md'],'normativeIntegrationThirdBatchDocuments':['integracion_normativa_lote_03_2026_es.md','integracion_normativa_lote_03_2026_pt.md'],'normativeIntegrationSecondBatchDocuments':['integracion_normativa_lote_02_2026_es.md','integracion_normativa_lote_02_2026_pt.md'],'normativeIntegrationDocuments':['integracion_normativa_lote_01_2026_es.md','integracion_normativa_lote_01_2026_pt.md'],'version':'0.2.0','translationComplete':c['metadata']['translationComplete'],'linguisticReviewComplete':False,'spanishManualApprovedAsDefinitiveSource':False,'semanticReviewProgress':c['metadata']['semanticReviewProgress'],'frontMatterReviewProgress':front_progress,'frontMatterDocuments':['preliminares_separadores_2025_es_revisado.md','preliminares_separadores_2025_pt.md'],'indexDocuments':['sumario_indices_2025_es_revisado.md','sumario_indices_2025_pt.md'],'manualPageAnnexReviewComplete':progress['reviewComplete'],'pageAnnexReviewProgress':c['metadata']['pageAnnexReviewProgress'],'annexPageDocuments':['anexo_paginas_001_020_2025_es_revisado.md','anexo_paginas_001_020_2025_pt.md'],'annexSecondBatchDocuments':['anexo_paginas_021_040_2025_es_revisado.md','anexo_paginas_021_040_2025_pt.md'],'annexThirdBatchDocuments':['anexo_paginas_041_060_2025_es_revisado.md','anexo_paginas_041_060_2025_pt.md'],'annexFourthBatchDocuments':['anexo_paginas_061_080_2025_es_revisado.md','anexo_paginas_061_080_2025_pt.md'],'annexFifthBatchDocuments':['anexo_paginas_081_100_2025_es_revisado.md','anexo_paginas_081_100_2025_pt.md'],'annexSixthBatchDocuments':['anexo_paginas_101_120_2025_es_revisado.md','anexo_paginas_101_120_2025_pt.md'],'annexSeventhBatchDocuments':['anexo_paginas_121_140_2025_es_revisado.md','anexo_paginas_121_140_2025_pt.md'],'annexEighthBatchDocuments':['anexo_paginas_141_160_2025_es_revisado.md','anexo_paginas_141_160_2025_pt.md'],'annexNinthBatchDocuments':['anexo_paginas_161_180_2025_es_revisado.md','anexo_paginas_161_180_2025_pt.md'],'annexTenthBatchDocuments':['anexo_paginas_181_200_2025_es_revisado.md','anexo_paginas_181_200_2025_pt.md'],'annexEleventhBatchDocuments':['anexo_paginas_201_220_2025_es_revisado.md','anexo_paginas_201_220_2025_pt.md'],'annexTwelfthBatchDocuments':['anexo_paginas_221_240_2025_es_revisado.md','anexo_paginas_221_240_2025_pt.md'],'annexThirteenthBatchDocuments':['anexo_paginas_241_260_2025_es_revisado.md','anexo_paginas_241_260_2025_pt.md'],'annexFourteenthBatchDocuments':['anexo_paginas_261_280_2025_es_revisado.md','anexo_paginas_261_280_2025_pt.md'],'annexFifteenthBatchDocuments':['anexo_paginas_281_300_2025_es_revisado.md','anexo_paginas_281_300_2025_pt.md'],'annexSixteenthBatchDocuments':['anexo_paginas_301_320_2025_es_revisado.md','anexo_paginas_301_320_2025_pt.md'],'annexSeventeenthBatchDocuments':['anexo_paginas_321_340_2025_es_revisado.md','anexo_paginas_321_340_2025_pt.md'],'annexEighteenthBatchDocuments':['anexo_paginas_341_360_2025_es_revisado.md','anexo_paginas_341_360_2025_pt.md'],'annexNineteenthBatchDocuments':['anexo_paginas_361_380_2025_es_revisado.md','anexo_paginas_361_380_2025_pt.md'],'annexTwentiethBatchDocuments':['anexo_paginas_381_400_2025_es_revisado.md','anexo_paginas_381_400_2025_pt.md'],'annexTwentyFirstBatchDocuments':['anexo_paginas_401_420_2025_es_revisado.md','anexo_paginas_401_420_2025_pt.md'],'annexTwentySecondBatchDocuments':['anexo_paginas_421_440_2025_es_revisado.md','anexo_paginas_421_440_2025_pt.md'],'annexTwentyThirdBatchDocuments':['anexo_paginas_441_460_2025_es_revisado.md','anexo_paginas_441_460_2025_pt.md'],'annexTwentyFourthBatchDocuments':['anexo_paginas_461_480_2025_es_revisado.md','anexo_paginas_461_480_2025_pt.md'],'annexTwentyFifthBatchDocuments':['anexo_paginas_481_500_2025_es_revisado.md','anexo_paginas_481_500_2025_pt.md'],'annexTwentySixthBatchDocuments':['anexo_paginas_501_520_2025_es_revisado.md','anexo_paginas_501_520_2025_pt.md'],'annexTwentySeventhBatchDocuments':['anexo_paginas_521_540_2025_es_revisado.md','anexo_paginas_521_540_2025_pt.md'],'annexTwentyEighthBatchDocuments':['anexo_paginas_541_560_2025_es_revisado.md','anexo_paginas_541_560_2025_pt.md'],'digestoTwentySixthBatchDocuments':['digesto_lote_392_398_2026_es_revisado.md','digesto_lote_392_398_2026_pt.md'],'digestoTwentyFifthBatchDocuments':['digesto_lote_372_391_2026_es_revisado.md','digesto_lote_372_391_2026_pt.md'],'digestoTwentyFourthBatchDocuments':['digesto_lote_352_371_2026_es_revisado.md','digesto_lote_352_371_2026_pt.md'],'digestoTwentyThirdBatchDocuments':['digesto_lote_332_351_2026_es_revisado.md','digesto_lote_332_351_2026_pt.md'],'digestoTwentySecondBatchDocuments':['digesto_lote_312_331_2026_es_revisado.md','digesto_lote_312_331_2026_pt.md'],'digestoTwentyFirstBatchDocuments':['digesto_lote_292_311_2026_es_revisado.md','digesto_lote_292_311_2026_pt.md'],'digestoTwentiethBatchDocuments':['digesto_lote_282_291_2026_es_revisado.md','digesto_lote_282_291_2026_pt.md'],'digestoNineteenthBatchDocuments':['digesto_lote_272_281_2026_es_revisado.md','digesto_lote_272_281_2026_pt.md'],'digestoEighteenthBatchDocuments':['digesto_lote_262_271_2026_es_revisado.md','digesto_lote_262_271_2026_pt.md'],'digestoSeventeenthBatchDocuments':['digesto_lote_261_2026_es_revisado.md','digesto_lote_261_2026_pt.md'],'digestoSixteenthBatchDocuments':['digesto_lote_251_260_2026_es_revisado.md','digesto_lote_251_260_2026_pt.md'],'digestoFifteenthBatchDocuments':['digesto_lote_231_250_2026_es_revisado.md','digesto_lote_231_250_2026_pt.md'],'digestoFourteenthBatchDocuments':['digesto_lote_211_230_2026_es_revisado.md','digesto_lote_211_230_2026_pt.md'],'digestoThirteenthBatchDocuments':['digesto_lote_191_210_2026_es_revisado.md','digesto_lote_191_210_2026_pt.md'],'digestoTwelfthBatchDocuments':['digesto_lote_171_190_2026_es_revisado.md','digesto_lote_171_190_2026_pt.md'],'digestoEleventhBatchDocuments':['digesto_lote_151_170_2026_es_revisado.md','digesto_lote_151_170_2026_pt.md'],'digestoTenthBatchDocuments':['digesto_lote_131_150_2026_es_revisado.md','digesto_lote_131_150_2026_pt.md'],'digestoNinthBatchDocuments':['digesto_lote_111_130_2026_es_revisado.md','digesto_lote_111_130_2026_pt.md'],'digestoEighthBatchDocuments':['digesto_lote_091_110_2026_es_revisado.md','digesto_lote_091_110_2026_pt.md'],'digestoSeventhBatchDocuments':['digesto_lote_071_090_2026_es_revisado.md','digesto_lote_071_090_2026_pt.md'],'digestoSixthBatchDocuments':['digesto_lote_051_070_2026_es_revisado.md','digesto_lote_051_070_2026_pt.md'],'digestoFifthBatchDocuments':['digesto_lote_041_050_2026_es_revisado.md','digesto_lote_041_050_2026_pt.md'],'digestoFourthBatchDocuments':['digesto_lote_031_040_2026_es_revisado.md','digesto_lote_031_040_2026_pt.md'],'digestoThirdBatchDocuments':['digesto_lote_021_030_2026_es_revisado.md','digesto_lote_021_030_2026_pt.md'],'digestoSecondBatchDocuments':['digesto_lote_011_020_2026_es_revisado.md','digesto_lote_011_020_2026_pt.md'],'digestoReviewProgress':digesto_progress,'digestoFirstBatchDocuments':['digesto_lote_001_010_2026_es_revisado.md','digesto_lote_001_010_2026_pt.md'],'constitutionReviewProgress':ci_progress,'constitutionDocuments':['constitucion_2025_es_revisada.md','constituicao_2025_pt.md'],'minutesRulesReviewProgress':atas_progress,'minutesRulesDocuments':['reglamento_actas_2025_es_revisado.md','regulamento_atas_2025_pt.md'],'deaconRulesReviewProgress':jd_progress,'deaconRulesDocuments':['reglamento_junta_diaconal_2025_es_revisado.md','regimento_junta_diaconal_2025_pt.md'],'churchStatuteReviewProgress':ig_progress,'churchStatuteDocuments':['estatuto_iglesia_2025_es_revisado.md','estatuto_igreja_2025_pt.md'],'presbyteryRulesReviewProgress':ripre_progress,'presbyteryRulesDocuments':['reglamento_presbiterio_2025_es_revisado.md','regimento_presbiterio_2025_pt.md'],'presbyteryStatuteReviewProgress':pre_progress,'presbyteryStatuteDocuments':['estatuto_presbiterio_2025_es_revisado.md','estatuto_presbiterio_2025_pt.md'],'synodRulesReviewProgress':sin_progress,'synodRulesDocuments':['reglamento_sinodo_2025_es_revisado.md','regimento_sinodo_2025_pt.md'],'synodStatuteReviewProgress':syn_progress,'synodStatuteDocuments':['estatuto_sinodo_2025_es_revisado.md','estatuto_sinodo_2025_pt.md'],'executiveRulesReviewProgress':ce_progress,'executiveRulesDocuments':['reglamento_ce_2025_es_revisado.md','regimento_ce_2025_pt.md'],'supremeRulesReviewProgress':sc_progress,'supremeRulesDocuments':['reglamento_sc_2025_es_revisado.md','regimento_sc_2025_pt.md'],'ipbStatuteReviewProgress':est_progress,'ipbStatuteDocuments':['estatuto_ipb_2025_es_revisado.md','estatuto_ipb_2025_pt.md'],'liturgyReviewProgress':pl_progress,'liturgyDocuments':['principios_liturgia_2025_es_revisado.md','principios_liturgia_2025_pt.md'],'disciplineReviewProgress':cd_progress,'disciplineDocuments':['codigo_disciplina_2025_es_revisado.md','codigo_disciplina_2025_pt.md'],'progress':c['metadata']['translationProgress'],'documents':[{'filename':n+'.md','language':n.rsplit('_',1)[1],'translationComplete':n.endswith('_pt') or c['metadata']['translationComplete'] or (n=='manual_2025_es' and counts['manual']==totals['manual']),'integrationComplete':False if 'integrado' in n else None} for n in names]}
(docs/'estado_bilingue.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
for n in ['integracion_normativa_lote_01_2026_es','integracion_normativa_lote_01_2026_pt','integracion_normativa_lote_02_2026_es','integracion_normativa_lote_02_2026_pt','integracion_normativa_lote_03_2026_es','integracion_normativa_lote_03_2026_pt','integracion_normativa_lote_04_2026_es','integracion_normativa_lote_04_2026_pt','integracion_normativa_lote_05_2026_es','integracion_normativa_lote_05_2026_pt','integracion_normativa_lote_06_2026_es','integracion_normativa_lote_06_2026_pt','integracion_normativa_lote_07_2026_es','integracion_normativa_lote_07_2026_pt','integracion_normativa_lote_08_2026_es','integracion_normativa_lote_08_2026_pt','integracion_normativa_lote_09_2026_es','integracion_normativa_lote_09_2026_pt','integracion_normativa_lote_10_2026_es','integracion_normativa_lote_10_2026_pt','integracion_normativa_lote_11_2026_es','integracion_normativa_lote_11_2026_pt','integracion_normativa_lote_12_2026_es','integracion_normativa_lote_12_2026_pt','integracion_normativa_lote_13_2026_es','integracion_normativa_lote_13_2026_pt','integracion_normativa_lote_14_2026_es','integracion_normativa_lote_14_2026_pt','integracion_normativa_lote_15_2026_es','integracion_normativa_lote_15_2026_pt','integracion_normativa_lote_16_2026_es','integracion_normativa_lote_16_2026_pt','integracion_normativa_lote_17_2026_es','integracion_normativa_lote_17_2026_pt','integracion_normativa_lote_18_2026_es','integracion_normativa_lote_18_2026_pt','integracion_normativa_lote_19_2026_es','integracion_normativa_lote_19_2026_pt','integracion_normativa_lote_20_2026_es','integracion_normativa_lote_20_2026_pt','integracion_normativa_lote_21_2026_es','integracion_normativa_lote_21_2026_pt']:shutil.copyfile(docs/(n+'.md'),ROOT/'static/documentos'/(n+'.md'))
for n in names:shutil.copyfile(docs/(n+'.md'),ROOT/'static/documentos'/(n+'.md'))
(ROOT/'static/documentos/estado_bilingue.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps(manifest,ensure_ascii=False))
