"""Build the canonical, atomic delivery archive after the validation pipeline."""
import argparse,hashlib,json,os,zipfile
from datetime import datetime,timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--output',type=Path,default=ROOT.parent/'consulta_presbiteriana.zip')
args=parser.parse_args();output=args.output.resolve()
assert output.name=='consulta_presbiteriana.zip','El paquete principal debe llamarse consulta_presbiteriana.zip'
assert not output.is_relative_to(ROOT),'Guardar el ZIP fuera del proyecto para evitar incluir entregas anteriores'
assert (ROOT/'build/index.html').is_file(),'Compilar antes de empaquetar'
assert (ROOT/'build/corpus.json').read_bytes()==(ROOT/'static/corpus.json').read_bytes(),'La compilación contiene un corpus desactualizado'
c=json.loads((ROOT/'static/corpus.json').read_text())
assert len(c['records'])==2172 and len(c['normativeEffects'])==398
progress=c['metadata']['documentaryConfirmationProgress']
assert progress['selectedIssueGroups']==progress['resolvedSelectedGroups']+progress['openSelectedGroups']
excluded={'node_modules','.svelte-kit','.git','__pycache__'}
files=[p for p in sorted(ROOT.rglob('*')) if p.is_file() and not any(part in excluded for part in p.relative_to(ROOT).parts) and p.suffix not in {'.zip','.pyc'} and p!=ROOT/'control_paquete.json']
controls={'generatedAt':datetime.now(timezone.utc).isoformat(),'archiveName':output.name,'includes':['source','compiled-app','documents','original-pdfs','local-launchers'],'records':len(c['records']),'normativeEffects':len(c['normativeEffects']),'crossReferenceProgress':c['metadata']['crossHistoricalCompatibilityProgress'],'documentaryConfirmationProgress':progress,'officialApproval':False,'files':[{'path':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}
output.parent.mkdir(parents=True,exist_ok=True);temporary=output.with_suffix('.zip.tmp')
try:
 with zipfile.ZipFile(temporary,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in files:z.write(p,Path(ROOT.name)/p.relative_to(ROOT))
  z.writestr(str(Path(ROOT.name)/'control_paquete.json'),json.dumps(controls,ensure_ascii=False,indent=2)+'\n')
 with zipfile.ZipFile(temporary) as z:
  assert z.testzip() is None,'ZIP corrupto'
  names=set(z.namelist());assert len(names)==len(z.namelist()),'Entradas duplicadas en el ZIP'
  for required in ['build/index.html','build/corpus.json','build/documentos/manual.pdf','build/documentos/digesto.pdf','src/lib/search.mjs','Iniciar_Consulta.cmd','documentos/pendientes_confirmacion_documental_2026_es.md']:
   assert str(Path(ROOT.name)/required) in names,required
 os.replace(temporary,output)
finally:
 if temporary.exists():temporary.unlink()
print(f'Paquete principal: {output} ({output.stat().st_size} bytes; CRC verificado)')
