"""Aplica correcciones terminológicas puntuales y registra qué quedó sin revisión."""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1];docs=ROOT/'documentos'
c=json.loads((ROOT/'static/corpus.json').read_text());byid={r['id']:r for r in c['records']};curated=json.loads((docs/'traducciones_es.json').read_text())
p=docs/'traducciones_automaticas_manual_es.json';auto=json.loads(p.read_text())
fixes=[]
def correct(src,dst):
 old=dst
 dst=dst.replace("COM NOTAS REMISSIVAS","CON NOTAS DE REFERENCIA").replace("EDICIÓN REVISTA Y ATUALIZADA","EDICIÓN REVISADA Y ACTUALIZADA")
 if re.search(r'\brevelia\b',src,re.I):
  dst=re.sub(r'\ba la revelia\b','en rebeldía',dst,flags=re.I)
  dst=re.sub(r'\brevelia\b','rebeldía',dst,flags=re.I)
 if re.search(r'\bchapas\b',src,re.I):
  dst=re.sub(r'\b(?:chapas|planchas)\b','listas electorales',dst,flags=re.I)
 if 'suspeição' in src:
  dst=re.sub(r'\b(?:suspeição|supeción|sospecha)\b','recusación',dst)
 dst=dst.replace('designar a los que deben trabajar','determinar dónde deben trabajar')
 dst=dst.replace('Caberá pedir la sentencia que absolución o condenar al acusado o anular el proceso.','Cabrá apelación contra la sentencia que absuelva o condene al acusado o anule el proceso.')
 if old!=dst:fixes.append({'sourceExcerpt':src[:160],'before':old[:200],'after':dst[:200]})
 return dst
for rid in list(auto):
 if rid in curated:del auto[rid];continue
 item=auto[rid];item['textEs']=correct(byid[rid]['textOriginal'],item['textEs'])
 assert sorted(re.findall(r'\[\d+\]',item['textEs']))==sorted(re.findall(r'\[\d+\]',byid[rid]['textOriginal']))
p.write_text(json.dumps(auto,ensure_ascii=False,indent=2))
pages=json.loads((docs/'manual_paginas_es.json').read_text());raw=(docs/'manual_pt_original.md').read_text();sourcepages=re.split(r'^## Página PDF (\d+)\n',raw,flags=re.M)
lookup={sourcepages[i]:sourcepages[i+1] for i in range(1,len(sourcepages),2)}
for i in pages:pages[i]=correct(lookup[i],pages[i])
(docs/'manual_paginas_es.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2))
report=json.loads((docs/'informe_traduccion_manual.json').read_text())
report['assistantTranslatedUnits']=sum(r['source']=='manual' and r['id'] in curated for r in c['records']);report['automaticUnits']=len(auto);report['targetedTerminologyCorrections']=fixes
report['sourcePDFSHA256']=c['metadata']['sources']['manual']['sha256']
report['qualityStatus']='Borrador automático con cobertura integral. No se ha completado la revisión lingüística o jurídica integral.'
assert report['automaticUnits']+report['assistantTranslatedUnits']==report['manualUnits']
(docs/'informe_traduccion_manual.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('Cobertura:',report['manualUnits'],'unidades; 560 páginas. Correcciones puntuales:',len(fixes))
