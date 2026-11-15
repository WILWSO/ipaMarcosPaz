"""Registra solo unidades cotejadas expresamente por el asistente."""
import json,hashlib,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];d=ROOT/'documentos'
c=json.loads((ROOT/'static/corpus.json').read_text());by={r['id']:r for r in c['records']}
request=json.loads(Path(sys.argv[1]).read_text());cur=json.loads((d/'traducciones_es.json').read_text());auto=json.loads((d/'traducciones_automaticas_manual_es.json').read_text());review=json.loads((d/'revision_semantica_manual.json').read_text());changes=json.loads((d/'correcciones_revision_manual.json').read_text());ids=request['reviewedIds']
for rid in ids:
 r=by[rid];old=cur.get(rid,auto.get(rid,{}).get('textEs',r.get('textEs','')));text=request.get('texts',{}).get(rid,old)
 for a,b in request.get('replacements',{}).get(rid,[]):
  if a not in text:raise ValueError('Fragmento no encontrado: '+rid+' '+a)
  text=text.replace(a,b)
 assert r['norm']=='CD'
 assert re.findall(r'\[\d+\]',text)==re.findall(r'\[\d+\]',r['textOriginal']),rid
 if old!=text:changes.append({'id':rid,'page':r['page'],'sourcePt':r['textOriginal'],'beforeEs':old,'afterEs':text})
 cur[rid]=text;auto.pop(rid,None)
 review[rid]={'reviewStatus':'cotejado-por-asistente','sourceHash':hashlib.sha256(r['textOriginal'].encode()).hexdigest(),'translationHash':hashlib.sha256(text.encode()).hexdigest(),'reviewedAgainst':'texto portugués extraído del PDF original 2025','reviewDate':'2026-10-05','externalCertification':False,'scope':'Código de Disciplina histórico 2025: cotejo de significado, condiciones, excepciones y referencias'}
for name,data in [('traducciones_es.json',cur),('traducciones_automaticas_manual_es.json',auto),('revision_semantica_manual.json',review),('correcciones_revision_manual.json',changes)]: (d/name).write_text(json.dumps(data,ensure_ascii=False,indent=2))
print('CD reviewed:',sum(k.startswith('CD-') for k in review),'batch:',len(ids))
