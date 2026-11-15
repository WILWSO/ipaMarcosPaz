"""Estatuto IPB histórico con todas las notas y numeración impresa preservada."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='EST-IPB'];arts=[r for r in rs if r['kind']=='articulo'];notes=[r for r in rs if r['kind']=='nota'];reviews=json.loads((d/'revision_semantica_manual.json').read_text());assert len(arts)==47 and len(notes)==15
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest()
pre_pt='Segunda alteração parcial do Estatuto da Igreja Presbiteriana do Brasil, organização religiosa inscrita no CNPJ sob nº 00.118.331/0001-20, com sede na Avenida W-5, SGAS 906, lote 8, Módulo A, Asa Sul, Brasília, Distrito Federal, aprovada pela Assembleia Geral de 30 de julho de 2022, cujo Estatuto encontra-se registrado sob nº 1934, em data de 25/05/1990, no 2º Ofício de Registro de Pessoas Jurídicas de Brasília, passando a ter a seguinte redação:'
pre_es='Segunda modificación parcial del Estatuto de la Iglesia Presbiteriana de Brasil, organización religiosa inscrita en el CNPJ bajo el nº 00.118.331/0001-20, con sede en la Avenida W-5, SGAS 906, lote 8, Módulo A, Asa Sul, Brasilia, Distrito Federal, aprobada por la Asamblea General del 30 de julio de 2022, cuyo Estatuto se encuentra registrado bajo el nº 1934, con fecha del 25/05/1990, en la 2ª Oficina del Registro de Personas Jurídicas de Brasilia, pasando a tener la siguiente redacción:'
chapters={1:('I — Da denominação, sede, constituição, duração e finalidade','I — De la denominación, sede, constitución, duración y finalidad'),4:('II — Da identidade de doutrina, liturgia, governo e disciplina','II — De la identidad de doctrina, liturgia, gobierno y disciplina'),5:('III — Dos órgãos deliberativos','III — De los órganos deliberativos'),6:('IV — Do Supremo Concílio','IV — Del Supremo Concilio'),14:('V — Da competência do Supremo Concílio','V — De las competencias del Supremo Concilio'),15:('VI — Da Mesa Diretora do Supremo Concílio','VI — De la Mesa Directiva del Supremo Concilio'),30:('VII — Das reuniões do Supremo Concílio','VII — De las reuniones del Supremo Concilio'),34:('VIII — Da Comissão Executiva','VIII — De la Comisión Ejecutiva'),39:('IX — Dos bens e fontes de recursos para manutenção da Igreja','IX — De los bienes y fuentes de recursos para el sostenimiento de la Iglesia'),43:('X — Da gestão patrimonial, econômica e financeira','X — De la gestión patrimonial, económica y financiera'),46:('XII — Das disposições finais','XII — De las disposiciones finales')}
sections={8:('I — Dos membros do Supremo Concílio','I — De los miembros del Supremo Concilio'),9:('II — Dos direitos e deveres dos membros\n\n#### Subseção I — Dos direitos','II — De los derechos y deberes de los miembros\n\n#### Subsección I — De los derechos'),12:('Subseção II — Dos deveres','Subsección II — De los deberes'),20:('I — Do Presidente','I — Del Presidente'),21:('II — Do Vice-Presidente','II — Del Vicepresidente'),22:('III — Do Secretário-Executivo','III — Del Secretario Ejecutivo'),24:('IV — Do Primeiro-Secretário','IV — Del Primer Secretario'),25:('V — Do Segundo-Secretário','V — Del Segundo Secretario'),26:('VI — Do Terceiro-Secretário','VI — Del Tercer Secretario'),27:('VII — Do Quarto-Secretário','VII — Del Cuarto Secretario'),28:('VIII — Do Tesoureiro','VIII — Del Tesorero'),35:('I — Da Mesa Diretora da Comissão Executiva','I — De la Mesa Directiva de la Comisión Ejecutiva'),36:('II — Da competência da Comissão Executiva','II — De las competencias de la Comisión Ejecutiva'),38:('III — Da representação legal','III — De la representación legal'),44:('Única — Do órgão de fiscalização','Única — Del órgano de fiscalización')}
editorial='''## Observaciones editoriales

Esta sección no forma parte del Estatuto ni de sus notas.

- El PDF 2025 contiene 47 bloques de artículos y 15 notas. Imprime dos veces «Art. 44» en la página 286: el primero trata de fiscalización y el segundo de disolución. No imprime un artículo 45 en esta sección. Se conserva esa numeración; sus identificadores son `EST-IPB-art-44` y `EST-IPB-art-44-2`. No se atribuye a ninguno una corrección oficial.
- El art. 41 dice «Supremo Executivo» en portugués. Se conserva «Supremo Ejecutivo» en español, sin sustituirlo por un órgano distinto.
- Las notas 8, 9, 13 y 14 identifican modificaciones de CE–2025–DOC. XCV ya incorporadas en la edición de 2025. Se conserva ese dato documental sin presentarlo como una reforma de 2026.
- En la nota 4 se conserva la referencia a comunicación mediante voto por correo electrónico tal como figura en el original.
- «Secretário-Executivo» se traduce como «Secretario Ejecutivo»; «Comissão Executiva», como «Comisión Ejecutiva»; «procuração» y «procurador», como «poder» y «apoderado»; «ônus», como «carga»; y «escrita» de Tesorería, como «contabilidad».

El cotejo se realizó contra el portugués extraído del PDF de 2025. No constituye certificación externa ni verificación de vigencia en 2026. Las elipsis pertenecen al Manual; no se reconstruyen partes omitidas de las resoluciones.
'''
for lang,pre in [('es',pre_es),('pt',pre_pt)]:
 es=lang=='es';idx=int(es);parts=['# '+('Estatuto de la Iglesia Presbiteriana de Brasil' if es else 'Estatuto da Igreja Presbiteriana do Brasil')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo completo por el asistente de los 47 bloques de artículos, las 15 notas y el texto introductorio. Numeración impresa conservada, incluidos los dos artículos 44. Edición histórica 2025.\n\n' if es else '> Texto português extraído do Manual 2025. Mantém os 47 blocos de artigos e 15 notas, incluindo a duplicação do número 44 no original.\n\n'),'## Índice\n\n']
 parts.append('[Texto introductorio y nota 1](#EST-IPB-introduccion) · [Artículos](#EST-IPB-articulos) · [Notas completas](#EST-IPB-notas)\n\n' if es else '[Texto introdutório e nota 1](#EST-IPB-introduccion) · [Artigos](#EST-IPB-articulos) · [Notas completas](#EST-IPB-notas)\n\n')
 for i,v in chapters.items():
  if i==46:parts.append('- ['+('XI — De la disolución y liquidación' if es else 'XI — Da dissolução e da liquidação')+'](#EST-IPB-capitulo-44-2)\n')
  parts.append(f'- [{v[idx]}](#EST-IPB-capitulo-{i})\n')
 parts.append('\n<a id="EST-IPB-introduccion"></a>\n## '+('Texto introductorio' if es else 'Texto introdutório')+' [1](#EST-IPB-nota-1)\n\nPDF: 269\n\n'+pre+'\n\n<a id="EST-IPB-articulos"></a>\n')
 for r in arts:
  i=int(r['article']);duplicate=r['id']=='EST-IPB-art-44-2'
  if duplicate:parts.append('\n<a id="EST-IPB-capitulo-44-2"></a>\n## '+('XI — De la disolución y liquidación' if es else 'XI — Da dissolução e da liquidação')+'\n')
  elif i in chapters:parts.append(f'\n<a id="EST-IPB-capitulo-{i}"></a>\n## {chapters[i][idx]}\n')
  if not duplicate and i in sections:parts.append('\n### '+sections[i][idx]+'\n')
  t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#EST-IPB-nota-{m[1]})',t);suffix=(' — disolución' if es else ' — dissolução') if duplicate else (' — fiscalización' if es else ' — fiscalização') if i==44 else ''
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}{suffix}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="EST-IPB-notas"></a>\n## Notas completas\n')
 for r in sorted(notes,key=lambda r:int(r['id'].rsplit('-',1)[1])):
  i=int(r['id'].rsplit('-',1)[1]);parents=[a for a in arts if r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i==1:back='[Texto introductorio](#EST-IPB-introduccion)' if es else '[Texto introdutório](#EST-IPB-introduccion)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append('\n'+editorial)
 text=''.join(parts);anchors=set(re.findall(r'<a id="([^"]+)"',text));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='estatuto_ipb_2025_es_revisado.md' if es else 'estatuto_ipb_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
(d/'revision_introduccion_estatuto.json').write_text(json.dumps({'sourcePt':pre_pt,'translationEs':pre_es,'page':269,'reviewDate':'2026-10-05','reviewStatus':'cotejado-por-asistente'},ensure_ascii=False,indent=2))
print('Estatuto IPB: 47 bloques de artículos, 15 notas y texto introductorio; enlaces verificados.')
