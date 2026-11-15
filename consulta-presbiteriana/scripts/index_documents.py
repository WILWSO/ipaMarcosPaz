"""Documentos de sumario e índices PT/ES completos, con su procedencia."""
import json, re, hashlib, shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
d = root / 'documentos'
c = json.loads((root / 'static/corpus.json').read_text())
pages = list(range(5, 13)) + list(range(157, 164)) + list(range(213, 218)) + [265, 266]
rs = sorted([r for r in c['records'] if r['norm'] == 'OTROS' and r['page'] in pages], key=lambda r: r['page'])
assert len(rs) == 22
for r in rs:
    assert r['translationReview']['sourceHash'] == hashlib.sha256(r['textOriginal'].encode()).hexdigest()
    assert r['translationReview']['translationHash'] == hashlib.sha256(r['textEs'].encode()).hexdigest()
contents = json.loads((d / 'estructura_sumario_indices_2025.json').read_text())['contents']
assert len(contents) == 331 and all(e['titleEs'] for e in contents)
for lang in ['es', 'pt']:
    es = lang == 'es'
    parts = ['# '+('Sumario e índices remisivos' if es else 'Sumário e índices remissivos')+' — Manual Presbiteriano 2025\n\n',
             ('> Traducción española no oficial cotejada por el asistente. Contenido completo de 22 páginas: sumario (5–12), índice de la Constitución (157–163), del Código de Disciplina (213–217) y de Principios de Liturgia (265–266). El anexo automático y las reformas de 2026 requieren revisión separada.\n\n' if es else
              '> Texto português da edição 2025. Conteúdo completo de 22 páginas: sumário (5–12), índice da Constituição (157–163), do Código de Disciplina (213–217) e dos Princípios de Liturgia (265–266). O anexo automático e as reformas de 2026 exigem revisão separada.\n\n'),
             '## '+('Navegación' if es else 'Navegação')+'\n\n',
             '- [Sumario / Sumário](#manual-pagina-5)\n- [Constitución / Constituição](#manual-pagina-157)\n- [Código de Disciplina](#manual-pagina-213)\n- [Liturgia](#manual-pagina-265)\n\n']
    for r in rs:
        text = r['textEs'] if es else r['textOriginal']
        parts.append(f'\n<a id="{r["id"]}"></a>\n### '+('Página PDF ' if es else 'Página PDF ')+str(r['page'])+f'\n\nID: `{r["id"]}`\n\n{text}\n')
    parts.append('\n## '+('Observaciones editoriales' if es else 'Observações editoriais')+'\n\n')
    parts.append(('Se mantienen el orden del original, las 331 entradas del sumario, todas las referencias numéricas y las letras de los incisos. Las indicaciones de los índices remiten a artículos, párrafos e incisos; las del sumario remiten a páginas. Se eliminan los encabezados duplicados por extracción en la traducción española; el original portugués extraído se conserva. Las entradas que continúan en otra página se mantienen en sus páginas respectivas.\n\n' if es else
                  'Preservam-se a ordem do original, as 331 entradas do sumário, todas as referências numéricas e as letras das alíneas. As indicações dos índices remetem a artigos, parágrafos e alíneas; as do sumário remetem a páginas. A tradução espanhola elimina cabeçalhos duplicados pela extração; preserva-se o texto português extraído. As entradas que continuam em outra página permanecem em suas respectivas páginas.\n\n'))
    parts.append(('Las siguientes anomalías pertenecen al índice original y se conservan; no se presentan como correcciones oficiales ni prevalecen sobre los artículos:\n\n' if es else
                  'As seguintes anomalias pertencem ao índice original e são preservadas; não constituem correções oficiais nem prevalecem sobre os artigos:\n\n'))
    observations = [
        ('CI, p. 160', 'La expresión «funções da Fé» se traduce literalmente como «funciones de la Fe»; también se conserva «139 e único».', 'A expressão «funções da Fé» é traduzida literalmente como «funciones de la Fe»; preserva-se também «139 e único».'),
        ('CI, p. 161', 'Oficiales: se conserva la secuencia «113 d 114», sin sustituir la letra d por una conjunción.', 'Oficiais: preserva-se a sequência «113 d 114», sem substituir a letra d por uma conjunção.'),
        ('CI, pp. 161 y 163', 'Se conserva «12 § 2º» en las entradas de Oficiales y Presbítero; no se sustituye editorialmente por otro artículo.', 'Preserva-se «12 § 2º» nas entradas Oficiais e Presbítero; não se substitui editorialmente por outro artigo.'),
        ('CD, p. 214', 'Deposición: se conserva la remisión «9 b», aunque el texto del art. 9 identifica la suspensión en b y la deposición en d.', 'Deposição: preserva-se a remissão «9 b», embora o texto do art. 9 identifique o afastamento em b e a deposição em d.'),
        ('CD, p. 215', 'Pena: se conserva «113» para la ejecución por los concilios. El art. 133 trata de la ejecución; no se altera la referencia histórica.', 'Pena: preserva-se «113» para a execução pelos concílios. O art. 133 trata da execução; não se altera a referência histórica.'),
        ('CD, p. 217', 'Se conservan las referencias «20.II» y «36» en la entrada Tribunales, tal como aparecen en el índice.', 'Preservam-se as referências «20.II» e «36» na entrada Tribunais, como aparecem no índice.'),
        ('PL, p. 265', 'Comisión: se conserva «organización de ministros» para la remisión al art. 32; no se sustituye por «ordenación».', 'Comissão: preserva-se «organização de ministros» na remissão ao art. 32; não se substitui por «ordenação».')]
    parts.append('| '+('Pasaje | Observación' if es else 'Passagem | Observação')+' |\n| --- | --- |\n')
    parts.extend('| '+a+' | '+(b if es else t)+' |\n' for a,b,t in observations)
    text = ''.join(parts)
    anchors = re.findall(r'<a id="([^"]+)"', text)
    assert len(anchors) == len(set(anchors)) == 22
    assert all(target in anchors for target in re.findall(r'\]\(#([^)]*)\)', text))
    name = 'sumario_indices_2025_es_revisado.md' if es else 'sumario_indices_2025_pt.md'
    (d / name).write_text(text)
    shutil.copyfile(d / name, root / 'static/documentos' / name)
print('Sumario e índices: documentos completos PT/ES con 22 páginas y 331 entradas del sumario.')
