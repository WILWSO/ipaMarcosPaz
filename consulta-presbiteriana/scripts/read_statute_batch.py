import json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1];c=json.loads((root/'static/corpus.json').read_text());cur=json.loads((root/'documentos/traducciones_es.json').read_text());auto=json.loads((root/'documentos/traducciones_automaticas_manual_es.json').read_text())
for r in c['records']:
 if r['norm']=='EST-IPB' and r['kind']==sys.argv[1] and int(sys.argv[2])<=int(r.get('article') or r['id'].rsplit('-',1)[1])<=int(sys.argv[3]):print(r['id'],'PDF',r['page'],'\nPT:',r['textOriginal'],'\nES:',cur.get(r['id'],auto.get(r['id'],{}).get('textEs',r.get('textEs',''))),'\n')
