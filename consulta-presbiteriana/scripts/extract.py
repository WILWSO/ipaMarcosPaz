"""Extrae un corpus trazable; no realiza ni simula traducciones."""
import argparse, hashlib, json, re, shutil
from collections import Counter
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = [
 ('CI','Constitución',15,156),('CD','Código de Disciplina',167,212),
 ('PL','Principios de Liturgia',221,264),('EST-IPB','Estatuto de la IPB',269,286),
 ('RI-SC','Reglamento Interno del Supremo Concilio',289,334),
 ('RI-CE','Reglamento Interno de la Comisión Ejecutiva',337,354),
 ('EST-SIN','Modelo de Estatuto del Sínodo',357,366),
 ('RI-SIN','Modelo de Reglamento Interno del Sínodo',369,418),
 ('EST-PRE','Modelo de Estatuto del Presbiterio',421,450),
 ('RI-PRE','Modelo de Reglamento Interno del Presbiterio',453,508),
 ('EST-IG','Modelo de Estatuto de Iglesia Local',511,532),
 ('RI-JD','Modelo de Reglamento Interno de Junta Diaconal',535,546),
 ('ATAS','Reglamento para la Confección de Actas',549,560),
]

def clean(s):
 return re.sub(r'[\x00-\x08\x0b\x0e-\x1f]', '', s).replace('\u202f',' ')

def join_lines(lines):
 out=''
 for line in lines:
  line=clean(line).strip()
  if not line: continue
  if out.endswith('-') and line[0].islower(): out=out[:-1]+line
  else: out += ('\n' if re.match(r'^(?:Art\.|§|Parágrafo|[a-z]\)|[IVX]+\s*[-–])',line) else ' ') + line
 return out.strip()

def record(id,kind,title,norm,page,text):
 return dict(id=id,kind=kind,title=title,norm=norm,page=page,pages=[page],textOriginal=text,
             textEs=None,translationStatus='pendiente',notes=[],links=[],status='texto-base-2025' if kind!='resolucion' else 'sin-clasificar',
             source='manual' if kind!='resolucion' else 'digesto')

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--manual',required=True);ap.add_argument('--digesto',required=True);args=ap.parse_args()
 files={'manual':Path(args.manual),'digesto':Path(args.digesto)}
 docs={k:fitz.open(v) for k,v in files.items()};rows=[];notes={};articles=[];counts=Counter()
 # Raw per-page copies are the complete preservation layer, including all notes and front matter.
 for key,doc in docs.items():
  name=f'{key}_pt_original.md';parts=[f'# {"Manual Presbiteriano 2025" if key=="manual" else "Digesto iCalvinus 2026"} — original portugués\n\n> Extracción íntegra por página. No es una traducción al español. Los saltos y la separación de palabras proceden del PDF.\n']
  for i,p in enumerate(doc):parts.append(f'\n## Página PDF {i+1}\n\n'+clean(p.get_text(sort=True)))
  (ROOT/'documentos'/name).write_text('\n'.join(parts),encoding='utf8')
  shutil.copyfile(files[key],ROOT/'static'/'documentos'/f'{key}.pdf')
 current=None;note=None;seen=Counter();used_pages=set()
 for norm,label,first,last in SECTIONS:
  current=None;note=None
  for page in range(first,last+1):
   p=docs['manual'][page-1]
   for b in p.get_text('dict')['blocks']:
    for line in b.get('lines',[]):
     spans=line['spans'];y=line['bbox'][1]
     if y<48 or y>p.rect.height-30:continue
     ss=[s for s in spans if s['text'].strip()]
     if not ss:continue
     # Superscript numbers in text have the superscript font flag. Footnote labels are smaller, non-superscript.
     mainline=any(10.35<=s['size']<12.5 for s in ss)
     if mainline:
      t=''.join('['+clean(s['text'])+']' if s['flags']&1 and re.fullmatch(r'\d+',s['text'].strip()) else s['text'] for s in spans)
      t=clean(t).strip();m=re.match(r'^Art\.\s*(\d+)\s*[º°o.]?',t)
      if m:
       num=int(m[1]);seen[(norm,num)]+=1;occ=seen[(norm,num)]
       current=record(f'{norm}-art-{num}'+(f'-{occ}' if occ>1 else ''),'articulo',f'Art. {num} · {label}'+(f' · sección {occ}' if occ>1 else ''),norm,page,'')
       current.update(article=num,section=label,lines=[]);articles.append(current)
      if current:
       current['lines'].append(t);current['pages']=sorted(set(current['pages']+[page]));used_pages.add(page)
       for n in re.findall(r'\[(\d+)\]',t):
        if n not in current['notes']:current['notes'].append(n)
      continue
     if max(s['size'] for s in ss)>10.35:continue
     t=clean(''.join(s['text'] for s in spans)).strip()
     labelspan=next((s for s in ss if s['size']<6.1 and re.match(r'^\d+\s*\x03',s['text'])),None)
     if labelspan:
      num=re.match(r'\d+',labelspan['text'])[0];nid=f'{norm}-nota-{num}'
      note=record(nid,'nota',f'Nota {num} · {label}',norm,page,'');note.update(number=num,lines=[])
      notes[nid]=note;t=re.sub(r'^'+num+r'\s*','',t)
     if note and t:
      note['lines'].append(t);note['pages']=sorted(set(note['pages']+[page]));used_pages.add(page)
 for r in articles+list(notes.values()):
  r['textOriginal']=join_lines(r.pop('lines'));r['pdfUrl']='documentos/manual.pdf#page='+str(r['page'])
  if r['kind']=='articulo':r['notes']=[f"{r['norm']}-nota-{n}" for n in r['notes']]
  else:r['linkedArticles']=[a['id'] for a in articles if r['id'] in a['notes']]
 rows.extend(articles);rows.extend(notes.values())
 # Supplemental pages preserve searchable preambles, indices and other unnumbered material.
 for i,p in enumerate(docs['manual']):
  if i+1 not in used_pages:
   r=record(f'manual-pagina-{i+1}','pagina',f'Manual · página {i+1}','OTROS',i+1,clean(p.get_text(sort=True)))
   r['pdfUrl']=f'documentos/manual.pdf#page={i+1}';rows.append(r)
 current=None;res=[]
 for i,p in enumerate(docs['digesto']):
  for b in p.get_text('dict')['blocks']:
   for line in b.get('lines',[]):
    if line['bbox'][1]<145 or line['bbox'][3]>780:continue
    t=clean(''.join(s['text'] for s in line['spans'])).strip()
    if not t or t=='RESULTADO DA BUSCA':continue
    m=re.match(r'^(SC|CE)\s*[-–]\s*2026\s*[-–]\s*DOC\.\s*([IVXLCDM]+)\s*:',t)
    if m:
     code=f'{m[1]}-2026-{m[2]}';current=record(code,'resolucion',f'{m[1]}-2026 · DOC. {m[2]}',m[1],i+1,'')
     current.update(code=code,lines=[]);res.append(current)
    if current:current['lines'].append(t);current['pages']=sorted(set(current['pages']+[i+1]))
 for r in res:
  r['textOriginal']=join_lines(r.pop('lines'));r['pdfUrl']=f"documentos/digesto.pdf#page={r['page']}"
  # Mentions are not modification links: they retain their own provenance and require human review.
  r['mentionedArticles']=sorted(set(int(x) for x in re.findall(r'\bart(?:igo)?\.?\s*(\d+)',r['textOriginal'],re.I)))
 rows.extend(res)
 corpus={'metadata':{'manualPages':len(docs['manual']),'digestoPages':len(docs['digesto']),'date':'2026-10-05','languageOriginal':'pt','translationComplete':False,'sources':{k:{'filename':v.name,'sha256':hashlib.sha256(v.read_bytes()).hexdigest()} for k,v in files.items()},'counts':dict(Counter(r['kind'] for r in rows))},'records':rows,'amendments':[]}
 (ROOT/'static'/'corpus.json').write_text(json.dumps(corpus,ensure_ascii=False),encoding='utf8')
 tasks=[{'id':r['id'],'sha256Original':hashlib.sha256(r['textOriginal'].encode()).hexdigest(),'textOriginal':r['textOriginal'],'textEs':None,'reviewed':False} for r in rows]
 (ROOT/'documentos'/'traducciones_pendientes.json').write_text(json.dumps(tasks,ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps(corpus['metadata'],ensure_ascii=False,indent=2))

if __name__=='__main__':main()
