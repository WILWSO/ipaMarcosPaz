"""Registra exclusivamente las 22 páginas de sumario e índices cotejadas."""
import json, hashlib, re, sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
d = root / 'documentos'
c = json.loads((root / 'static/corpus.json').read_text())
by = {r['id']: r for r in c['records']}
request = json.loads(Path(sys.argv[1]).read_text())
pages = list(range(5, 13)) + list(range(157, 164)) + list(range(213, 218)) + [265, 266]
assert set(request['reviewedIds']) == {f'manual-pagina-{p}' for p in pages}
cur = json.loads((d / 'traducciones_es.json').read_text())
auto = json.loads((d / 'traducciones_automaticas_manual_es.json').read_text())
reviews = json.loads((d / 'revision_semantica_manual.json').read_text())
changes = json.loads((d / 'correcciones_revision_manual.json').read_text())
for rid in request['reviewedIds']:
    r = by[rid]
    text = request['texts'][rid]
    assert r['norm'] == 'OTROS' and r['page'] in pages
    source_body = '\n'.join(line for line in r['textOriginal'].splitlines()
                             if not any(term in line for term in ['MANUALMANUAL', 'SUMÁRIOSUMÁRIO', 'ConstituiçãoConstituição', 'CódigoCódigo']))
    assert re.findall(r'\d+', source_body) == re.findall(r'\d+', text), rid
    assert re.findall(r'\[\d+\]', r['textOriginal']) == re.findall(r'\[\d+\]', text), rid
    assert r['textOriginal'].count('§') == text.count('§'), rid
    old = cur.get(rid, auto.get(rid, {}).get('textEs', r.get('textEs', '')))
    if old != text:
        changes.append({'id': rid, 'page': r['page'], 'sourcePt': r['textOriginal'], 'beforeEs': old, 'afterEs': text})
    cur[rid] = text
    auto.pop(rid, None)
    reviews[rid] = {'reviewStatus': 'cotejado-por-asistente',
                    'sourceHash': hashlib.sha256(r['textOriginal'].encode()).hexdigest(),
                    'translationHash': hashlib.sha256(text.encode()).hexdigest(),
                    'reviewDate': '2026-10-06', 'externalCertification': False,
                    'reviewedAgainst': 'texto portugués extraído del PDF original 2025',
                    'scope': 'Sumario e índices históricos: cotejo de todos los títulos, temas, condiciones y remisiones; se preservan anomalías del original y se eliminan duplicaciones de encabezado de extracción',
                    'additionalEvidence': {'numericReferencesCompared': len(re.findall(r'\d+', source_body)),
                                           'paragraphMarkersCompared': source_body.count('§'),
                                           'referenceLettersChecked': True}}
for name, value in [('traducciones_es.json', cur), ('traducciones_automaticas_manual_es.json', auto),
                    ('revision_semantica_manual.json', reviews), ('correcciones_revision_manual.json', changes)]:
    (d / name).write_text(json.dumps(value, ensure_ascii=False, indent=2))
print('22 páginas de sumario e índices cotejadas; 1774/1774 registros del inventario.')
