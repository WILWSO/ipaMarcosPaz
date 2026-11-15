"""RI-CE histórico: 37 artículos y tres notas, con enlaces verificados."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='RI-CE'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text())
assert set(by)=={f'RI-CE-art-{i}' for i in range(1,38)}|{f'RI-CE-nota-{i}' for i in range(1,4)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest()
chapters={1:('I — Da regência legal','I — Del régimen normativo'),2:('II — Da composição','II — De la composición'),3:('III — Da Mesa Diretora','III — De la Mesa Directiva'),15:('IV — Da competência','IV — De las competencias'),16:('V — Das vedações','V — De las prohibiciones'),17:('I — Das reuniões','I — De las reuniones'),25:('II — Das subcomissões','II — De las subcomisiones'),30:('III — Do assento e do uso da palavra pelos relatores de comissões, secretários de causas e representantes de órgãos da IPB','III — De la participación y el uso de la palabra de los ponentes de comisiones, secretarios de causas y representantes de órganos de la IPB'),31:('IV — Das subcomissões nomeadas para o exame de documentos destinados às reuniões do Supremo Concílio','IV — De las subcomisiones nombradas para examinar documentos destinados a las reuniones del Supremo Concilio'),32:('V — Das reuniões e votações por meio eletrônico','V — De las reuniones y votaciones por medios electrónicos'),34:('VI — Do exame dos livros da Tesouraria e das medidas de caráter econômico e financeiro nos interregnos','VI — Del examen de los libros de la Tesorería y de las medidas económicas y financieras en los interregnos')}
sections={4:('I — Das atribuições dos membros da Mesa Diretora\n\n##### Subseção I — Do Presidente','I — De las atribuciones de los miembros de la Mesa Directiva\n\n##### Subsección I — Del Presidente'),6:('II — Do Vice-Presidente','II — Del Vicepresidente'),7:('III — Do Secretário-Executivo','III — Del Secretario Ejecutivo'),10:('IV — Do Tesoureiro','IV — Del Tesorero'),14:('II — Dos Vogais','II — De los vocales'),18:('I — Do Local da Reunião','I — Del lugar de la reunión'),19:('II — Da Convocação e do Quórum de Instalação e Funcionamento','II — De la convocatoria y el quórum de instalación y funcionamiento'),20:('III — Do Programa da Reunião','III — Del programa de la reunión'),21:('IV — Das Despesas com a Reunião','IV — De los gastos de la reunión'),22:('V — Do Encaminhamento de Propostas, Consultas e outros Documentos','V — De la remisión de propuestas, consultas y otros documentos')}
groups={1:('TÍTULO I — DA COMISSÃO EXECUTIVA','TÍTULO I — DE LA COMISIÓN EJECUTIVA'),17:('TÍTULO II — DO FUNCIONAMENTO','TÍTULO II — DEL FUNCIONAMIENTO'),36:('TÍTULO III — DAS DISPOSIÇÕES FINAIS','TÍTULO III — DE LAS DISPOSICIONES FINALES')}
for lang in ['pt','es']:
 es=lang=='es';idx=int(es);parts=['# '+('Reglamento Interno de la Comisión Ejecutiva del Supremo Concilio de la Iglesia Presbiteriana de Brasil' if es else 'Regimento Interno da Comissão Executiva do Supremo Concílio da Igreja Presbiteriana do Brasil')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo completo por el asistente: 37 artículos y 3 notas. Texto histórico de 2025; no verifica vigencia en 2026.\n\n' if es else '> Texto português extraído do Manual 2025: 37 artigos e 3 notas completas. Redação histórica, com numeração preservada.\n\n'),'## Índice\n\n']
 for i,v in groups.items():parts.append(f'- [{v[idx]}](#RI-CE-titulo-{i})\n')
 for i,v in chapters.items():parts.append(f'- [{v[idx]} · Art. {i}](#RI-CE-capitulo-{i})\n')
 parts.append('\n[Notas completas](#RI-CE-notas)\n\n<a id="RI-CE-introduccion"></a>\n## RI-CE [1](#RI-CE-nota-1)\n\nPDF: 337\n')
 for i in range(1,38):
  r=by[f'RI-CE-art-{i}']
  if i in groups:parts.append(f'\n<a id="RI-CE-titulo-{i}"></a>\n## '+groups[i][idx]+'\n')
  if i in chapters:parts.append(f'\n<a id="RI-CE-capitulo-{i}"></a>\n## '+('Capítulo ' if es else 'Capítulo ')+chapters[i][idx]+'\n')
  if i in sections:parts.append('\n'+('##### ' if i in [6,7,10] else '#### ')+(('Subsección ' if es else 'Subseção ') if i in [6,7,10] else ('Sección ' if es else 'Seção '))+sections[i][idx]+'\n')
  t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#RI-CE-nota-{m[1]})',t)
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="RI-CE-notas"></a>\n## Notas completas\n')
 for i in range(1,4):
  r=by[f'RI-CE-nota-{i}'];parents=[a for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i==1:back='[Título del Reglamento](#RI-CE-introduccion)' if es else '[Título do Regimento](#RI-CE-introduccion)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append("""\n## Observaciones editoriales

Esta sección no forma parte del Reglamento ni de sus notas.

- Se mantienen los 37 artículos y las 3 notas de las páginas PDF 337–353. La nota 1 corresponde al título del Reglamento e identifica SC–2022–DOC. CCIX.
- «Comissão Executiva» se traduce como «Comisión Ejecutiva»; «Mesa Diretora», como «Mesa Directiva»; «Secretário-Executivo», como «Secretario Ejecutivo»; «Tesoureiro», como «Tesorero»; «escrita» de Tesorería, como «contabilidad»; y «autarquias», como «entes autónomos».
- El art. 16 conserva las prohibiciones, excepciones y condiciones del original. Su nota 3 conserva por separado las decisiones de 2002, 2008 y 2022: unanimidad de los votantes presentes para suspender o alterar resoluciones en el supuesto citado, y declaración de que la CE-SC/IPB carece de competencia constitucional para dejar sin efecto una resolución del SC/IPB.
- El art. 22, § 1º, dispensa la lectura de documentos en el Plenario. El art. 26 atribuye al ponente la conducción del estudio, discusión y votación. El art. 25, § 2º, menciona tanto entes autónomos como entidades paraeclesiásticas; se restituyen ambos grupos.
- Se conservan los plazos y umbrales: asuntos que no pueden esperar más de diez días (arts. 4 y 8); sustituciones de hasta treinta días o superiores a ese plazo (arts. 9 y 11–13); convocatoria con cuarenta y cinco días salvo urgencia superlativa (art. 19); documentos con veinte días (art. 23) y treinta días (art. 24), con sus respectivas excepciones.
- La nota 2 conserva la expresión del original «e-mail voto», traducida como «voto por correo electrónico». No se sustituye ese procedimiento por una interpretación editorial. Se mantienen sus elipsis.

El cotejo se realizó contra el portugués extraído del PDF original de 2025. No constituye certificación externa ni verificación de vigencia o reformas de 2026. El anexo automático por páginas del Manual completo sigue pendiente de revisión.
""")
 text=''.join(parts);anchors=re.findall(r'<a id="([^"]+)"',text);assert len(anchors)==len(set(anchors));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='reglamento_ce_2025_es_revisado.md' if es else 'regimento_ce_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
print('RI-CE: 37 artículos y 3 notas; enlaces comprobados.')
