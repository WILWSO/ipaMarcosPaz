"""Registra el lote de preliminares y separadores expresamente cotejado."""
import json, hashlib, re, sys
from pathlib import Path
import fitz

root = Path(__file__).resolve().parents[1]
d = root / 'documentos'
c = json.loads((root / 'static/corpus.json').read_text())
by = {r['id']: r for r in c['records']}
request = json.loads(Path(sys.argv[1]).read_text())
eligible = {r['id'] for r in c['records'] if r['norm'] == 'OTROS' and
            (r['page'] <= 4 or len(r['textOriginal']) < 100)}
assert set(request['reviewedIds']) == eligible and len(eligible) == 36
cur = json.loads((d / 'traducciones_es.json').read_text())
auto = json.loads((d / 'traducciones_automaticas_manual_es.json').read_text())
review = json.loads((d / 'revision_semantica_manual.json').read_text())
changes = json.loads((d / 'correcciones_revision_manual.json').read_text())
doc = fitz.open(root / 'static/documentos/manual.pdf')
hash_text = lambda s: hashlib.sha256(s.encode()).hexdigest()
for rid in request['reviewedIds']:
    r = by[rid]
    text = request['texts'][rid]
    old = cur.get(rid, auto.get(rid, {}).get('textEs', r.get('textEs', '')))
    assert re.findall(r'\[\d+\]', text) == re.findall(r'\[\d+\]', r['textOriginal'])
    scope = 'Preliminares y separadores del Manual histórico 2025: significado, nombres propios, créditos, siglas y referencias'
    evidence = {}
    if not r['textOriginal'].strip():
        page = doc[r['page'] - 1]
        assert not text and not page.get_text().strip()
        assert not page.get_images() and not page.get_drawings() and not list(page.annots() or [])
        scope = 'Página sin contenido textual ni imágenes, dibujos o anotaciones; no se atribuye traducción a una página vacía'
        evidence = {'pdfPage': r['page'], 'textCharacters': 0, 'images': 0, 'drawings': 0, 'annotations': 0,
                    'sourcePDFSHA256': c['metadata']['sources']['manual']['sha256']}
    if rid != 'manual-pagina-4':
        assert re.findall(r'\d+', text) == re.findall(r'\d+', r['textOriginal']), rid
    else:
        # La imagen de la p. 4 confirma que «44» es duplicación de la extracción.
        assert r['textOriginal'].startswith('44') and text.startswith('4 ')
        assert re.findall(r'\d+', text)[1:] == re.findall(r'\d+', r['textOriginal'])[1:]
        evidence = {'visualCheck': 'Imagen de la página PDF 4: encabezado impreso 4 MANUAL PRESBITERIANO; se elimina duplicación de extracción'}
    if rid == 'manual-pagina-2':
        evidence = {'visualCheck': 'Imagen de la página PDF 2: separación entre Consejo Editorial y Producción Editorial; nombres y datos bibliográficos conservados'}
    if old != text:
        changes.append({'id': rid, 'page': r['page'], 'sourcePt': r['textOriginal'], 'beforeEs': old, 'afterEs': text})
    cur[rid] = text
    auto.pop(rid, None)
    review[rid] = {'reviewStatus': 'cotejado-por-asistente', 'sourceHash': hash_text(r['textOriginal']),
                   'translationHash': hash_text(text), 'reviewedAgainst': 'texto portugués extraído del PDF original 2025',
                   'reviewDate': '2026-10-06', 'externalCertification': False, 'scope': scope, 'additionalEvidence': evidence}
for name, data in [('traducciones_es.json', cur), ('traducciones_automaticas_manual_es.json', auto),
                   ('revision_semantica_manual.json', review), ('correcciones_revision_manual.json', changes)]:
    (d / name).write_text(json.dumps(data, ensure_ascii=False, indent=2))
print('Preliminares y separadores: 36 registros cotejados; índices todavía pendientes.')
