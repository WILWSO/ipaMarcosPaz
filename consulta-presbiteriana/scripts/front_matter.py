"""Publica únicamente el lote cotejado; excluye el sumario y los índices pendientes."""
import json, re, hashlib, shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
d = root / 'documentos'
c = json.loads((root / 'static/corpus.json').read_text())
rs = sorted([r for r in c['records'] if r['norm'] == 'OTROS' and
             (r['page'] <= 4 or len(r['textOriginal']) < 100)], key=lambda r: r['page'])
assert len(rs) == 36
for r in rs:
    review = r['translationReview']
    assert review['sourceHash'] == hashlib.sha256(r['textOriginal'].encode()).hexdigest()
    assert review['translationHash'] == hashlib.sha256(r['textEs'].encode()).hexdigest()
for lang in ['es', 'pt']:
    es = lang == 'es'
    parts = ['# '+('Preliminares y separadores' if es else 'Preliminares e separadores')+' — Manual Presbiteriano 2025\n\n',
             ('> Traducción española no oficial cotejada por el asistente. Alcance: páginas 1–4, 13 separadores y 19 páginas en blanco. El sumario y los índices temáticos disponen de documentos independientes; el anexo automático por páginas queda fuera de este documento.\n\n' if es else
              '> Texto português da edição 2025. Abrange as páginas 1–4, 13 separadores e 19 páginas em branco. O sumário e os índices temáticos dispõem de documentos independentes; o anexo automático por páginas não integra este documento.\n\n'),
             '## Índice de páginas\n\n']
    for r in rs:
        label = ('Preliminar' if es else 'Preliminar') if r['page'] <= 4 else ('Página en blanco' if es else 'Página em branco') if not r['textOriginal'].strip() else ('Separador' if es else 'Separador')
        parts.append(f'- [{label} · PDF {r["page"]}](#{r["id"]})\n')
    for r in rs:
        text = r['textEs'] if es else r['textOriginal']
        if not text.strip():
            text = '*Página en blanco en el PDF original; sin texto que traducir.*' if es else '*Página em branco no PDF original; sem texto para traduzir.*'
        parts.append(f'\n<a id="{r["id"]}"></a>\n### Página PDF {r["page"]}\n\nID: `{r["id"]}`\n\n{text}\n')
    parts.append('\n## '+('Observaciones editoriales' if es else 'Observações editoriais')+'\n\n')
    parts.append(('Se conservan nombres de personas, empresas, entidades editoriales, direcciones y datos bibliográficos en su forma original. En la página 2 se reconstruye la separación de columnas verificada en la imagen del PDF. En la página 4, la imagen confirma un único número 4 y un único encabezado: la extracción duplicaba ambos. La presentación continúa de la página 3 a la 4. Las páginas vacías se verificaron sin texto, imágenes, dibujos ni anotaciones. El cotejo de estos 36 registros no aprueba el Manual completo ni el anexo automático.\n' if es else
                  'Preservam-se os textos portugueses extraídos, incluindo a duplicação do cabeçalho na página 4. A tradução espanhola elimina essa duplicação conforme a imagem do PDF. A apresentação continua da página 3 para a 4. As páginas vazias foram verificadas sem texto, imagens, desenhos ou anotações.\n'))
    text = ''.join(parts)
    anchors = re.findall(r'<a id="([^"]+)"', text)
    assert len(anchors) == len(set(anchors)) == 36
    assert all(target in anchors for target in re.findall(r'\]\(#([^)]*)\)', text))
    name = 'preliminares_separadores_2025_es_revisado.md' if es else 'preliminares_separadores_2025_pt.md'
    (d / name).write_text(text)
    shutil.copyfile(d / name, root / 'static/documentos' / name)
print('Preliminares y separadores: documentos PT/ES; 36 anclas y referencias verificadas.')
