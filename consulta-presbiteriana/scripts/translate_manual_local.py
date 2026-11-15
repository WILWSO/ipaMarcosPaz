"""Borrador automático local PT→ES. Cobertura no equivale a revisión semántica."""
import argparse,json,re,time,hashlib,difflib
from pathlib import Path
import ctranslate2,sentencepiece as sp
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--model',required=True);p.add_argument('--batch',type=int,default=24);a=p.parse_args();mp=Path(a.model)
s=sp.SentencePieceProcessor(model_file=str(mp/'sentencepiece.model'))
m=ctranslate2.Translator(str(mp/'model'),device='cpu',compute_type='int8',intra_threads=1,inter_threads=4)
cp=ROOT/'documentos/cache_traduccion_manual.json';cache=json.loads(cp.read_text()) if cp.exists() else {};started=time.time();issues=[]
c=json.loads((ROOT/'static/corpus.json').read_text());curated=json.loads((ROOT/'documentos/traducciones_es.json').read_text())
ap=ROOT/'documentos/traducciones_automaticas_manual_es.json';auto=json.loads(ap.read_text()) if ap.exists() else {}
pp=ROOT/'documentos/manual_paginas_es.json';pg=json.loads(pp.read_text()) if pp.exists() else {}
protected=re.compile(r'\[\d+\]|(?:SC(?:-E\d?)?|CE(?:-SC/IPB)?|SC/IPB)\s*[–-]\s*\d{4}\s*[–-]\s*DOC\.?\s*[IVXLCDM]+|\b(?:CI/IPB|CD/IPB|RI-[A-Z]+|CE-SC/IPB|SC/IPB|IPB|PL)\b|\b\d+(?:[./,–-]\d+)*(?:º|ª|%)?|\b[IVXLCDM]{2,}\b|https?://\S+|www\.\S+|[\w.+-]+@[\w.-]+\.[a-z]+')
def gloss(t):
 for old,new in [(r'\b(?:comungantes|conungantes|comunantes)\b','comulgantes'),(r'\b(?:comungante|conungante|comunante)\b','comulgante'),(r'\batas\b','actas'),(r'\bata\b','acta'),(r'\bSanta Ceia\b','Santa Cena'),(r'\bCeia\b','Cena'),(r'\bconcílio\b','concilio'),(r'\bconcílios\b','concilios'),(r'\bpresbitério\b','presbiterio'),(r'\bpresbitérios\b','presbiterios'),(r'\balínea\b','inciso'),(r'\balíneas\b','incisos'),(r'\bParágrafo\b','Párrafo'),(r'\bparágrafo\b','párrafo'),(r'\btesoureiro\b','tesorero'),(r'\btesoureiros\b','tesoreros'),('bajo su guardia','bajo su guarda'),(r'\bla juicio\b','a juicio')]:t=re.sub(old,new,t)
 return t

def batch(texts):
 if not texts:return []
 inputs=[s.encode(t,out_type=str) for t in texts]
 limit=min(384,max(24,int(max(map(len,inputs))*1.8)+12))
 out=m.translate_batch(inputs,beam_size=1,max_batch_size=a.batch,max_decoding_length=limit)
 return [gloss(s.decode(r.hypotheses[0])) for r in out]

def plan(text):
 out=[]
 for line in text.splitlines(keepends=True):
  nl='\n' if line.endswith('\n') else '';b=line.rstrip('\n')
  if not re.search('[A-Za-zÀ-ÿ]',b):out.append(('keep',b+nl));continue
  prefix=re.match(r'^(\s*(?:Art\.\s*\d+[ºª]?\.?|§\s*\d+[ºª]?\.?|[a-z]\)|\d+[.)ºª])\s*)',b)
  if prefix:out.append(('keep',prefix[0]));b=b[len(prefix[0]):]
  chunks=[];current=''
  for sentence in re.split(r'(?<=[.;!?])\s+',b):
   if len(s.encode((current+' '+sentence).strip()))<=220:current=(current+' '+sentence).strip()
   else:
    if current:chunks.append(current);current=''
    if len(s.encode(sentence))<=220:current=sentence
    else:
     for word in sentence.split():
      candidate=(current+' '+word).strip()
      if len(s.encode(candidate))>220:chunks.append(current);current=word
      else:current=candidate
  if current:chunks.append(current)
  for i,ch in enumerate(chunks):
   out.append(('translate',ch))
   if i<len(chunks)-1:out.append(('keep',' '))
  if nl:out.append(('keep',nl))
 return out

def fallback(text):
 parts=[];last=0
 for match in protected.finditer(text):
  if match.start()>last:parts.append(('translate',text[last:match.start()]))
  parts.append(('keep',match[0]));last=match.end()
 if last<len(text):parts.append(('translate',text[last:]))
 def borders(v):
  begin=re.match(r'^[^A-Za-zÀ-ÿ]*',v)[0]
  rest=v[len(begin):]
  end=re.search(r'[^A-Za-zÀ-ÿ]*$',rest)[0]
  core=rest[:-len(end)] if end else rest
  return begin,core,end
 needs=[borders(v)[1] for k,v in parts if k=='translate' and re.search('[A-Za-zÀ-ÿ]',v)]
 def words_number(value):
  n=int(value)
  small=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve']
  if n<30:return small[n]
  if n<100:return ['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'][n//10]+(' y '+small[n%10] if n%10 else '')
  if n==100:return 'cien'
  if n<1000:return ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'][n//100]+(' '+words_number(str(n%100)) if n%100 else '')
  if n<1000000:return ('mil' if n//1000==1 else words_number(str(n//1000))+' mil')+(' '+words_number(str(n%1000)) if n%1000 else '')
  return 'número '+value
 values=[]
 for v in batch(needs):
  # The source of these fragments has no numeric reference: numerals generated from number words are spelled out.
  v=re.sub(r'\b\d+\b',lambda x:words_number(x[0]),v)
  v=re.sub(r'\b[IVXLCDM]{2,}\b',lambda x:x[0].lower(),v)
  values.append(v)
 vals=iter(values);out=[]
 for k,v in parts:
  if k=='keep' or not re.search('[A-Za-zÀ-ÿ]',v):out.append(v)
  else:
   begin,core,end=borders(v);out.append(begin+next(vals)+end)
 return ''.join(out)

def repair_references(src,dst):
 # Resolve punctuation, ordinal formatting and number-word conversion without breaking sentence context.
 dst=re.sub(r'\b(\d+)o\b',lambda x:x[1]+'º' if x[1]+'º' in src else x[0],dst)
 left=list(protected.finditer(src));right=list(protected.finditer(dst))
 norm=lambda t:re.sub(r'\s+','',t).replace('ª','º')
 matcher=difflib.SequenceMatcher(a=[norm(x[0]) for x in left],b=[norm(x[0]) for x in right],autojunk=False)
 changes=[]
 small={0:'cero',1:'uno',2:'dos',3:'tres',4:'cuatro',5:'cinco',6:'seis',7:'siete',8:'ocho',9:'nueve',10:'diez',11:'once',12:'doce',13:'trece',14:'catorce',15:'quince',16:'dieciséis',17:'diecisiete',18:'dieciocho',19:'diecinueve',20:'veinte',25:'veinticinco',30:'treinta',40:'cuarenta',50:'cincuenta',60:'sesenta',70:'setenta',80:'ochenta',90:'noventa',100:'cien',1000:'mil'}
 for op,i,j,k,l in matcher.get_opcodes():
  if op=='equal' or (op=='replace' and j-i==l-k):
   changes.extend((r.start(),r.end(),s[0]) for s,r in zip(left[i:j],right[k:l]))
  elif op=='insert' and all(x[0].isdigit() and int(x[0]) in small for x in right[k:l]):
   changes.extend((x.start(),x.end(),small[int(x[0])]) for x in right[k:l])
  else:return None
 for begin,end,text in sorted(changes,reverse=True):dst=dst[:begin]+text+dst[end:]
 return dst if protected.findall(src)==protected.findall(dst) else None

jobs=[('record',r['id'],r['textOriginal']) for r in c['records'] if r['source']=='manual' and r['id'] not in curated and r['id'] not in auto]
raw=(ROOT/'documentos/manual_pt_original.md').read_text();pages=re.split(r'^## Página PDF (\d+)\n',raw,flags=re.M)
for i in range(1,len(pages),2):
 num=pages[i]
 if num in pg:continue
 pars=[]
 for par in re.split(r'\n\s*\n',pages[i+1].strip()):
  text='\n'.join(x.strip() for x in par.splitlines());text=re.sub(r'(?<=[A-Za-zÀ-ÿ])-\n(?=[a-zà-ÿ])','',text)
  text=re.sub(r'\n(?!Art\.|§|Parágrafo|[a-z]\)|\d+[.)ºª]?\s)',' ',text);pars.append(text)
 jobs.append(('page',num,'\n\n'.join(pars)))
plans=[plan(t) for _,_,t in jobs]
unique=list(dict.fromkeys(v for ps in plans for k,v in ps if k=='translate' and v not in cache))
def canonical(text):return re.sub(r'\s+',' ',re.sub(r'\[(\d+)\]',r'\1',text)).strip()
equivalent={canonical(src):dst for src,dst in cache.items()}
remaining=[]
for src in unique:
 candidate=equivalent.get(canonical(src))
 if candidate:
  if not re.search(r'\[\d+\]',src):candidate=re.sub(r'\[(\d+)\]',r'\1',candidate)
  if protected.findall(src)==protected.findall(candidate):cache[src]=candidate;continue
 remaining.append(src)
unique=remaining
print(json.dumps({'jobs':len(jobs),'segments':len(unique),'chars':sum(map(len,unique))}),flush=True)
executor=ThreadPoolExecutor(max_workers=4)
pending={start:executor.submit(batch,unique[start:start+a.batch]) for start in range(0,min(len(unique),4*a.batch),a.batch)}
for start in range(0,len(unique),a.batch):
 inputs=unique[start:start+a.batch];outputs=pending.pop(start).result()
 following=start+4*a.batch
 if following<len(unique):pending[following]=executor.submit(batch,unique[following:following+a.batch])
 for src,dst in zip(inputs,outputs):
  if not dst:raise ValueError('Texto traducido vacío')
  if protected.findall(src)!=protected.findall(dst):
   dst=repair_references(src,dst) or fallback(src)
   if protected.findall(src)!=protected.findall(dst):
    (ROOT/'documentos/error_referencias_traduccion.json').write_text(json.dumps({'source':src,'output':dst,'expected':protected.findall(src),'actual':protected.findall(dst)},ensure_ascii=False,indent=2))
    raise ValueError('Referencias alteradas: '+src[:80])
  if len(dst)<len(src)*.4 or len(dst)>len(src)*2.6:issues.append({'source':src[:180],'reason':'longitud atípica','output':dst[:180]})
  cache[src]=dst
 if start%96==0 or start+a.batch>=len(unique):
  temp_cache=cp.with_suffix('.tmp');temp_cache.write_text(json.dumps(cache,ensure_ascii=False));temp_cache.replace(cp)
  print(json.dumps({'translatedSegments':min(start+a.batch,len(unique)),'total':len(unique),'seconds':round(time.time()-started)}),flush=True)
executor.shutdown(wait=True)
for (kind,key,src),parts in zip(jobs,plans):
 dst=''.join(v if k=='keep' else cache[v] for k,v in parts)
 # Restore complete conciliar citations split across translation chunks.
 for citation in re.finditer(r'(SC(?:-E\d?)?|CE(?:-SC/IPB)?|SC/IPB)\s*[–-]\s*(\d{4})\s*[–-]\s*DOC\.?\s*([IVXLCDM]+)',src):
  if citation[0] not in dst:
   pattern=r'(?:SC(?:-E\d?)?|CE(?:-SC/IPB)?|SC/IPB)?\s*[–-]\s*'+citation[2]+r'\s*[–-]\s*DOC\.?\s*'+citation[3]+r'\b'
   dst=re.sub(pattern,lambda m:citation[0],dst,count=1)
 canonical_refs=lambda text:sorted(re.sub(r'\s+',' ',x).strip() for x in protected.findall(text))
 if canonical_refs(src)!=canonical_refs(dst):
  (ROOT/'documentos/error_referencias_traduccion.json').write_text(json.dumps({'key':key,'source':src,'output':dst,'expected':canonical_refs(src),'actual':canonical_refs(dst)},ensure_ascii=False,indent=2))
  raise ValueError('Referencia final alterada: '+key)
 if kind=='record':auto[key]={'textEs':dst,'sourceHash':hashlib.sha256(src.encode()).hexdigest(),'method':'Argos PT-ES 1.0 / CTranslate2','reviewed':False}
 else:pg[key]=dst
expected=[r for r in c['records'] if r['source']=='manual'];assert all(r['id'] in curated or r['id'] in auto for r in expected);assert set(pg)==set(map(str,range(1,561)))
ap.write_text(json.dumps(auto,ensure_ascii=False,indent=2));pp.write_text(json.dumps(pg,ensure_ascii=False,indent=2))
report={'coverageComplete':True,'linguisticReviewComplete':False,'pages':560,'manualUnits':len(expected),'assistantTranslatedUnits':sum(r['id'] in curated for r in expected),'automaticUnits':len(auto),'modelSHA256':hashlib.sha256((mp/'model/model.bin').read_bytes()).hexdigest(),'sourceMarkdownSHA256':hashlib.sha256(raw.encode()).hexdigest(),'issuesForReview':issues,'elapsedSeconds':round(time.time()-started),'referencePreservation':'Numeración y referencias protegidas; no equivale a revisión semántica.'}
(ROOT/'documentos/informe_traduccion_manual.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('COMPLETE',json.dumps(report,ensure_ascii=False),flush=True)
