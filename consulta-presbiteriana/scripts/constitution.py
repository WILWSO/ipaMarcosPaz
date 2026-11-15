"""Publica la Constitución histórica revisada, sin el anexo automático duplicado."""
import json,re,hashlib,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];d=ROOT/'documentos';c=json.loads((ROOT/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='CI'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text())
assert {r['id'] for r in rs}=={f'CI-art-{i}' for i in range(1,153)}|{f'CI-nota-{i}' for i in range(1,362)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest()
pre_pt='Em nome do Pai, e do Filho e do Espírito Santo, nós, legítimos representantes da Igreja Cristã Presbiteriana do Brasil, reunidos em Supremo Concílio, no ano de 1950, com poderes para reforma da Constituição, investidos de toda autoridade para cumprir as resoluções da legislatura de 1946, depositando toda nossa confiança na bênção do Deus Altíssimo e tendo em vista a promoção da paz, disciplina, unidade e edificação do povo de Cristo, elaboramos, decretamos e promulgamos, para glória de Deus, a seguinte Constituição da Igreja Presbiteriana do Brasil.[1]'
pre_es='En nombre del Padre, del Hijo y del Espíritu Santo, nosotros, legítimos representantes de la Iglesia Cristiana Presbiteriana de Brasil, reunidos en Supremo Concilio en el año 1950, con poderes para reformar la Constitución, investidos de toda autoridad para cumplir las resoluciones de la legislatura de 1946, depositando toda nuestra confianza en la bendición del Dios Altísimo y teniendo en cuenta la promoción de la paz, la disciplina, la unidad y la edificación del pueblo de Cristo, elaboramos, decretamos y promulgamos, para gloria de Dios, la siguiente Constitución de la Iglesia Presbiteriana de Brasil.[1]'
chapters={1:('I — Natureza, governo e fins da Igreja','I — Naturaleza, gobierno y fines de la Iglesia'),4:('II — Organização das comunidades locais','II — Organización de las comunidades locales'),10:('III — Membros da Igreja','III — Miembros de la Iglesia'),25:('IV — Oficiais','IV — Oficiales'),59:('V — Concílios','V — Concilios'),98:('VI — Comissões e outras organizações','VI — Comisiones y otras organizaciones'),108:('VII — Ordens da Igreja','VII — Órdenes de la Iglesia'),139:('Disposições gerais','Disposiciones generales'),146:('Disposições transitórias','Disposiciones transitorias')}
sections={10:('1ª — Classificação, direitos e deveres dos membros da Igreja','1ª — Clasificación, derechos y deberes de los miembros de la Iglesia'),16:('2ª — Admissão de membros','2ª — Admisión de miembros'),18:('3ª — Transferência de membros','3ª — Transferencia de miembros'),23:('4ª — Demissão de membros','4ª — Baja de miembros'),25:('1ª — Classificação','1ª — Clasificación'),30:('2ª — Ministros do Evangelho','2ª — Ministros del Evangelio'),50:('3ª — Presbíteros e diáconos','3ª — Presbíteros y diáconos'),59:('1ª — Concílios em geral','1ª — Concilios en general'),75:('2ª — Conselho da Igreja','2ª — Consejo de la Iglesia'),85:('3ª — Presbitério','3ª — Presbiterio'),91:('4ª — Sínodo','4ª — Sínodo'),95:('5ª — Supremo Concílio','5ª — Supremo Concilio'),98:('1ª — Comissões eclesiásticas','1ª — Comisiones eclesiásticas'),102:('2ª — Comissões executivas','2ª — Comisiones ejecutivas'),105:('3ª — Autarquias','3ª — Entidades autónomas'),106:('4ª — Secretarias gerais','4ª — Secretarías generales'),107:('5ª — Entidades paraeclesiásticas','5ª — Entidades paraeclesiásticas'),108:('1ª — Doutrina da vocação','1ª — Doctrina de la vocación'),110:('2ª — Eleição de oficiais','2ª — Elección de oficiales'),113:('3ª — Ordenação e instalação de presbíteros e diáconos','3ª — Ordenación e instalación de presbíteros y diáconos'),115:('4ª — Candidatura e licenciatura para o Sagrado Ministério','4ª — Candidatura y licenciatura ministerial para el Sagrado Ministerio'),127:('5ª — Ordenação de licenciados','5ª — Ordenación de licenciados'),133:('6ª — Relação pastoral','6ª — Relación pastoral')}
editorial='''## Observaciones editoriales de cotejo

Las siguientes anomalías ya aparecen en el texto portugués y se conservan sin introducir una corrección normativa:

- Notas 38 y 239: el texto de CE–1959 cita el 31 de enero; CE–2013 afirma reafirmarlo con el 31 de diciembre.
- Notas 92 y 312: la cita sobre diaconisas contiene una frase incompleta («inexistente na defesa») y «povos» —traducido como «pueblos»—, mientras el art. 83 habla de pobres.
- Notas 110 y 195: se cita el art. 7º, letra a, en relación con funciones conciliares; la referencia se conserva tal como está impresa.
- Nota 152: se conserva la referencia «artículo 4º de los párrafos 4º y 5º», aunque el contexto trata del art. 49.
- Nota 204: el original emplea «ex nunc» junto a «hasta su raíz». Se conserva esa formulación, sin reemplazarla por otra expresión latina.
- Nota 331: el original dice «enseñanza tecnológica» en un pasaje sobre formación teológica; se conserva esa palabra.

Las cifras y reglas citadas en resoluciones antiguas corresponden a sus fechas; no fueron actualizadas a 2026. Las elipsis […] pertenecen al Manual: las notas se traducen completas tal como fueron publicadas, sin inventar los tramos que la edición no reproduce.
'''
for lang,pre in [('es',pre_es),('pt',pre_pt)]:
 idx=1 if lang=='es' else 0;es=lang=='es';parts=['# '+('Constitución de la Iglesia Presbiteriana de Brasil' if es else 'Constituição da Igreja Presbiteriana do Brasil')+' — Manual 2025\n\n',('> Traducción española no oficial. Revisión comparada completa por el asistente de los 152 artículos, las 361 notas y el preámbulo, contra el texto portugués extraído del PDF de 2025. Fecha: 5 de octubre de 2026. Esta edición conserva el texto histórico; no incorpora reformas de 2026.\n\n' if es else '> Texto português extraído do Manual Presbiteriano 2025. Mantém a redação histórica e todas as 361 notas.\n\n'),'## '+('Índice' if es else 'Índice')+'\n\n','[Preámbulo](#preambulo) · [Artículos](#articulos) · [Notas completas](#notas)\n\n' if es else '[Preâmbulo](#preambulo) · [Artigos](#articulos) · [Notas completas](#notas)\n\n']
 for i,v in chapters.items():parts.append(f'- [{v[idx]}](#capitulo-{i})\n')
 parts+=['\n<a id="preambulo"></a>\n## '+('Preámbulo' if es else 'Preâmbulo')+'\n\nPDF: 15\n\n'+pre.replace('[1]','[1](#CI-nota-1)')+'\n\n','<a id="articulos"></a>\n']
 for i in range(1,153):
  r=by[f'CI-art-{i}']
  if i in chapters:parts.append(f'\n<a id="capitulo-{i}"></a>\n## {chapters[i][idx]}\n')
  if i in sections:parts.append('\n### '+('Sección ' if es else 'Seção ')+sections[i][idx]+'\n')
  t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#CI-nota-{m[1]})',t)
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nPDF: {r["page"]}\n\n{t}\n')
  if r['notes']:parts.append('\n'+('Notas vinculadas: ' if es else 'Notas vinculadas: ')+', '.join(f'[{n.rsplit("-",1)[-1]}](#{n})' for n in r['notes'])+'.\n')
 parts.append('\n<a id="notas"></a>\n## Notas completas\n')
 for i in range(1,362):
  r=by[f'CI-nota-{i}'];parents=[a['article'] for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];t=r['textEs'] if es else r['textOriginal'];back=', '.join(f'[Art. {n}](#CI-art-{n})' for n in parents) or '[Preámbulo](#preambulo)' if i==1 else ', '.join(f'[Art. {n}](#CI-art-{n})' for n in parents)
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n{t}\n')
 if es:parts.append('\n'+editorial)
 name='constitucion_2025_es_revisada.md' if es else 'constituicao_2025_pt.md';text=''.join(parts);anchors=set(re.findall(r'<a id="([^"]+)"',text));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));(d/name).write_text(text);shutil.copyfile(d/name,ROOT/'static/documentos'/name)
(d/'revision_preambulo_constitucion.json').write_text(json.dumps({'sourcePt':pre_pt,'translationEs':pre_es,'page':15,'reviewDate':'2026-10-05','reviewStatus':'cotejado-por-asistente'},ensure_ascii=False,indent=2))
print('Constitución: 152 artículos, 361 notas y preámbulo; enlaces verificados.')
