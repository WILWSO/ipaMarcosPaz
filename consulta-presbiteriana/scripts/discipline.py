"""Publica el Código de Disciplina histórico cotejado, con todas sus notas."""
import json,re,hashlib,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];d=ROOT/'documentos';c=json.loads((ROOT/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='CD'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text())
assert set(by)=={f'CD-art-{i}' for i in range(1,136)}|{f'CD-nota-{i}' for i in range(1,105)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest()
pre_pt='Em nome do Pai, e do Filho, e do Espírito Santo, nós, legítimos representantes da Igreja Presbiteriana do Brasil, reunidos em Supremo Concílio, no ano de 1951, investidos de toda a autoridade para cumprir as resoluções das legislaturas de 1946 e de 1950, com toda a confiança na bênção de Deus, nosso Pai, e visando exercer a justiça, manter a paz, sustentar a disciplina, preservar a unidade e promover a edificação da igreja de Cristo, decretamos e promulgamos, para glória de Deus Altíssimo, o seguinte Código de Disciplina.[1]'
pre_es='En nombre del Padre, del Hijo y del Espíritu Santo, nosotros, legítimos representantes de la Iglesia Presbiteriana de Brasil, reunidos en Supremo Concilio en el año 1951, investidos de toda autoridad para cumplir las resoluciones de las legislaturas de 1946 y de 1950, con plena confianza en la bendición de Dios, nuestro Padre, y con el propósito de ejercer la justicia, mantener la paz, sostener la disciplina, preservar la unidad y promover la edificación de la iglesia de Cristo, decretamos y promulgamos, para gloria del Dios Altísimo, el siguiente Código de Disciplina.[1]'
chapters={1:('I — Natureza e finalidade','I — Naturaleza y finalidad'),4:('II — Faltas','II — Faltas'),8:('III — Penalidades','III — Penas'),18:('IV — Tribunais','IV — Tribunales'),27:('V — Da suspeição e da incompetência','V — De la recusación y la incompetencia'),42:('VI — Processo','VI — Proceso'),113:('VII — Dos recursos em geral','VII — De los recursos en general'),133:('VIII — Da execução','VIII — De la ejecución'),134:('IX — Da restauração','IX — De la restauración'),135:('Disposições finais','Disposiciones finales')}
sections={42:('1ª — Disposições gerais','1ª — Disposiciones generales'),48:('2ª — Do andamento do processo','2ª — De la tramitación del proceso'),65:('3ª — Do processo em que o concílio ou tribunal for parte','3ª — Del proceso en que el concilio o tribunal sea parte'),68:('4ª — Do interrogatório do acusado, da confissão e das perguntas ao ofendido','4ª — Del interrogatorio del acusado, de la confesión y de las preguntas al ofendido'),71:('5ª — Das testemunhas e da acareação','5ª — De los testigos y del careo'),83:('6ª — Do secretário','6ª — Del secretario'),84:('7ª — Das citações','7ª — De las citaciones'),92:('8ª — Da intimação','8ª — De la notificación'),94:('9ª — Da sentença ou acórdão','9ª — De la sentencia o fallo colegiado'),97:('10ª — Do processo sumaríssimo perante Conselho','10ª — Del proceso sumarísimo ante el Consejo'),103:('11ª — Do processo sumário','11ª — Del proceso sumario'),107:('12ª — Do processo ordinário','12ª — Del proceso ordinario'),113:('1ª — Natureza dos recursos','1ª — Naturaleza de los recursos'),115:('2ª — Da apelação','2ª — De la apelación'),125:('3ª — Da revisão','3ª — De la revisión'),127:('4ª — Do recurso extraordinário','4ª — Del recurso extraordinario')}
editorial='''## Criterios de traducción y observaciones de cotejo

Esta sección es editorial; no forma parte del Código ni de sus notas normativas.

- «Afastamento», como pena del art. 9º, letra b, se traduce como «suspensión»; el apartamiento preventivo del art. 16 se distingue de esa pena. «Deposição» se traduce como «deposición», «interdição» como «interdicción» y «despojamento» como «despojamiento».
- «Procurador» significa aquí representante o apoderado de una parte, no fiscal. «Relator» se traduce como «ponente»; «autos», como «expediente»; «autuação», como «formación del expediente»; «acórdão», como «fallo colegiado»; y «ementa», como «sumario» de un fallo. Este último término no designa el rito procesal sumario.
- «Citação» se traduce como «citación» y «intimação», cuando comunica una decisión, como «notificación». Se conservan los distintos plazos de los arts. 48 y 85 y las remisiones que explican su aplicación.
- La nota 1 se vincula al preámbulo; la nota 77, al título de la sección 10ª; y la nota 103, a «Disposiciones finales». El asterisco del art. 106 se conserva y se enlaza con la remisión «*Art. 96» que aparece en la nota 83.
- La nota 18 repite una frase sobre el carácter administrativo y no punitivo de la exoneración. La repetición del original se conserva.
- La nota 22 conserva Marcos 12:7 y los arts. 243 y 232 tal como aparecen impresos. No se sustituyen por otras referencias.
- La nota 31 y la nota 33 dicen «hasta cinco (5) Jueces» al explicar el quórum: se conserva esa formulación del original.
- La nota 49 cita el Sumario nº 13/2022, aunque antes reproduce un fallo fechado el 18/03/2021. La nota 79 cita DOC. CCLXX en un punto y DOC. CCLXXX en otros. Ambas diferencias se conservan.
- La nota 92 cita el art. 23, párrafo único, inciso I, letras a y b; la nota 94 menciona el art. 128, letras a y b, en su título, mientras su desarrollo remite al art. 22. Se conservan estas anomalías sin corregir normativamente el texto.
- La nota 100 repite la identificación CE–2009–DOC. CLIII y conserva la formulación «art. 9º y letra a y del art. 134» de la resolución SC–2014. No se presume una referencia distinta.
- La propuesta de añadir una letra c al art. 42, reproducida en la nota 47, se mantiene como propuesta dentro de su resolución; no se inserta como letra aprobada en el artículo histórico.

Las notas se traducen completas tal como fueron publicadas en el Manual 2025. Las elipsis pertenecen a esa edición; no se reconstruyen partes de las resoluciones que el Manual no reproduce. Las citas sobre leyes civiles y decisiones eclesiásticas conservan su fecha y su carácter documental, sin constituir verificación de vigencia en 2026. No se ha realizado certificación externa.
'''
for lang,pre in [('es',pre_es),('pt',pre_pt)]:
 es=lang=='es';idx=int(es);parts=['# '+('Código de Disciplina de la Iglesia Presbiteriana de Brasil' if es else 'Código de Disciplina da Igreja Presbiteriana do Brasil')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo completo por el asistente de los 135 artículos, las 104 notas y el preámbulo contra el texto portugués extraído del PDF de 2025. Fecha: 5 de octubre de 2026. Edición histórica; no incorpora reformas de 2026.\n\n' if es else '> Texto português extraído do Manual Presbiteriano 2025, com o preâmbulo, 135 artigos e todas as 104 notas. Mantém a redação histórica.\n\n'),'## Índice\n\n','[Preámbulo](#CD-preambulo) · [Artículos](#CD-articulos) · [Notas completas](#CD-notas)\n\n' if es else '[Preâmbulo](#CD-preambulo) · [Artigos](#CD-articulos) · [Notas completas](#CD-notas)\n\n']
 for i,v in chapters.items():parts.append(f'- [{v[idx]}](#CD-capitulo-{i})\n')
 parts.append('\n<a id="CD-preambulo"></a>\n## '+('Preámbulo' if es else 'Preâmbulo')+'\n\nPDF: 167\n\n'+pre.replace('[1]','[1](#CD-nota-1)')+'\n\n<a id="CD-articulos"></a>\n')
 for i in range(1,136):
  r=by[f'CD-art-{i}']
  if i in chapters:
   title=chapters[i][idx]+(' [103](#CD-nota-103)' if i==135 else '')
   parts.append(f'\n<a id="CD-capitulo-{i}"></a>\n## {title}\n')
  if i in sections:
   title=('Sección ' if es else 'Seção ')+sections[i][idx]+(' [77](#CD-nota-77)' if i==97 else '')
   parts.append('\n### '+title+'\n')
  t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#CD-nota-{m[1]})',t)
  if i==106:t=t.replace('*','[*](#CD-nota-83)')
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nPDF: {r["page"]}\n\n{t}\n')
  if r['notes']:parts.append('\nNotas vinculadas: '+', '.join(f'[{n.rsplit("-",1)[-1]}](#{n})' for n in r['notes'])+'.\n')
 parts.append('\n<a id="CD-notas"></a>\n## Notas completas\n')
 for i in range(1,105):
  r=by[f'CD-nota-{i}'];parents=[a['article'] for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {n}](#CD-art-{n})' for n in parents)
  if i==1:back='[Preámbulo](#CD-preambulo)' if es else '[Preâmbulo](#CD-preambulo)'
  if i==77:back='[Sección 10ª](#CD-art-97)' if es else '[Seção 10ª](#CD-art-97)'
  if i==103:back='[Disposiciones finales](#CD-capitulo-135)' if es else '[Disposições finais](#CD-capitulo-135)'
  t=r['textEs'] if es else r['textOriginal'];parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n{t}\n')
 if es:parts.append('\n'+editorial)
 name='codigo_disciplina_2025_es_revisado.md' if es else 'codigo_disciplina_2025_pt.md';text=''.join(parts);anchors=set(re.findall(r'<a id="([^"]+)"',text));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));(d/name).write_text(text);shutil.copyfile(d/name,ROOT/'static/documentos'/name)
(d/'revision_preambulo_disciplina.json').write_text(json.dumps({'sourcePt':pre_pt,'translationEs':pre_es,'page':167,'reviewDate':'2026-10-05','reviewStatus':'cotejado-por-asistente'},ensure_ascii=False,indent=2))
print('Código de Disciplina: 135 artículos, 104 notas y preámbulo; enlaces verificados.')
