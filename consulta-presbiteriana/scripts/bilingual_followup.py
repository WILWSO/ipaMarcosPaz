"""Seguimiento editorial y catálogo de materiales Markdown en ambos idiomas."""
import json, collections, re, shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
d = root / 'documentos'
c = json.loads((root / 'static/corpus.json').read_text())
reviews = json.loads((d / 'revision_semantica_manual.json').read_text())
manual = [r for r in c['records'] if r['source'] == 'manual']
counts = collections.Counter(r['norm'] for r in manual)
compared = collections.Counter(r['norm'] for r in manual if r['id'] in reviews)
assert len(reviews) == len(manual) == 1774
pt = '''# Lista de trabalho — Manual Presbiteriano bilíngue

Atualizada: 14 de outubro de 2026. Documento editorial de acompanhamento.

## Ordem de trabalho

- [x] Constituição: preâmbulo, 152 artigos e 361 notas conferidos.
- [x] Código de Disciplina: preâmbulo, 135 artigos e 104 notas conferidos.
- [x] Princípios de Liturgia: preâmbulo, 44 artigos e 59 notas conferidos; nome espanhol atualizado para `principios_liturgia_2025_es_revisado.md`.
- [x] Estatuto da IPB: introdução, 47 blocos de artigos e 15 notas conferidos; preservada a duplicação do número 44 no original.
- [x] Regimento do Supremo Concílio: 82 artigos e três notas conferidos.
- [x] Regimento da Comissão Executiva: 37 artigos e três notas conferidos.
- [x] Estatuto do Sínodo: 31 artigos e nove notas conferidos.
- [x] Regimento do Sínodo: 96 artigos e duas notas conferidos.
- [x] Estatuto do Presbitério: 62 artigos e 135 notas conferidos.
- [x] Regimento do Presbitério: 99 artigos e duas notas conferidos.
- [x] Estatuto da Igreja: 57 artigos e 116 notas conferidos.
- [x] Regimento da Junta Diaconal: 34 artigos e uma nota conferidos.
- [x] Regulamento de Atas: 24 artigos e seis notas conferidos.
- [x] Preliminares e separadores: páginas 1–4, 13 títulos e 19 páginas em branco verificados.
- [x] Sumário e índices: 22 páginas conferidas; 331 entradas do sumário e todas as remissões históricas preservadas.
- [x] Incorporar correções ao Manual espanhol e ao projeto de consulta.
- [x] Manter materiais de conteúdo e acompanhamento em `.md` espanhol e português.
- [x] Conferir o primeiro lote do anexo: páginas 1–20.
- [x] Conferir o segundo lote do anexo: páginas 21–40, concluindo a nota 23.
- [x] Conferir o terceiro lote do anexo: páginas 41–60, concluindo a nota 66 e o artigo 17.
- [x] Conferir o quarto lote do anexo: páginas 61–80, concluindo a nota 122 e o artigo 34.
- [x] Conferir o quinto lote do anexo: páginas 81–100, concluindo a nota 161 e o artigo 54.
- [x] Conferir o sexto lote do anexo: páginas 101–120, concluindo a nota 205.
- [x] Conferir o sétimo lote do anexo: páginas 121–140, concluindo a nota 263 e o artigo 88.
- [x] Conferir o oitavo lote do anexo: páginas 141–160, concluindo o artigo 114 e as normas da Constituição.
- [x] Conferir o nono lote do anexo: páginas 161–180, concluindo o índice da Constituição e iniciando o Código de Disciplina.
- [x] Conferir o décimo lote do anexo: páginas 181–200, concluindo a nota 37 e o artigo 22 do Código de Disciplina.
- [x] Conferir o undécimo lote do anexo: páginas 201–220, concluindo o Código de Disciplina e seu índice.
- [x] Conferir o décimo segundo lote do anexo: páginas 221–240, início dos Princípios de Liturgia; nota 15 e artigo 11 continuam em 241.
- [x] Conferir o décimo terceiro lote do anexo: páginas 241–260, concluindo a nota 15 e o artigo 11 dos Princípios de Liturgia.
- [x] Conferir o décimo quarto lote do anexo: páginas 261–280, concluindo os Princípios de Liturgia e seu índice e iniciando o Estatuto da IPB até o artigo 29.
- [x] Conferir o décimo quinto lote do anexo: páginas 281–300, concluindo o Estatuto e iniciando o Regimento Interno do Supremo Concílio.
- [x] Conferir o décimo sexto lote do anexo: páginas 301–320; Regimento Interno até o artigo 58.
- [x] Conferir o décimo sétimo lote do anexo: páginas 321–340; Regimento do Supremo Concílio concluído; início RI-CE.
- [x] Conferir o décimo oitavo lote do anexo: páginas 341–360; RI-CE concluído e início do Estatuto do Sínodo.
- [x] Conferir o décimo nono lote do anexo: páginas 361–380; Estatuto sinodal concluído; Regimento até artigo 30.
- [x] Conferir o vigésimo lote do anexo: páginas 381–400; Regimento sinodal até artigo 60.
- [x] Conferir o vigésimo primeiro lote do anexo: páginas 401–420; Regimento sinodal concluído.
- [x] Conferir o vigésimo segundo lote do anexo: páginas 421–440; artigo 34 continuava em 441, concluído no lote seguinte.
- [x] Conferir o vigésimo terceiro lote do anexo: páginas 441–460; Estatuto do Presbitério concluído, sem continuações abertas.
- [x] Conferir o vigésimo quarto lote do anexo: páginas 461–480; artigo 51 continua em 481.
- [x] Conferir o vigésimo quinto lote do anexo: páginas 481–500; artigo 85 continua em 501.
- [x] Conferir o vigésimo sexto lote do anexo: páginas 501–520; artigo 24 EST-IG continua em 521.
- [x] Conferir o vigésimo sétimo lote do anexo: páginas 521–540; artigo 12 RI-JD continua em 541.
- [x] Completar o anexo: 560/560 páginas conferidas; 0 pendentes.
- [x] Completar a tradução e o cotejo do Digesto espanhol: 398/398 decisões; revisão editorial final pendente.
- [x] Conferir cada resolução de 2026: efeitos, vigência documental, artigos e notas atingidos.
- [x] Consolidar os efeitos em suplemento separado PT/ES: 398/398.
- [ ] Completar a integração PT/ES: seis emendas de SC-2026-CCI e revogação parcial do RI-CE e correção do caput de Atas art. 3; 398/398 decisões examinadas quanto aos efeitos, 0 pendentes.
- [ ] Validar consultas bilíngues e remissões após concluir o corpus.
- [ ] Revisar conjuntamente os seis documentos principais e o projeto.

## Próximo passo concreto

Digesto: 398/398 traduzidas e conferidas; 0 pendentes. Rastreio transversal encerrado: 142/142 candidatas classificadas; 0 pendentes. Próximo trabalho: confirmar os sete grupos documentais selecionados; não é inventário exaustivo de relações implícitas. Suplemento consolidado: 398/398. Manual e anexo com cotejo completo; pendentes 0/560 páginas do anexo.

## Inventário

| Seção | Unidades conferidas | Unidades totais | Situação |
| --- | ---: | ---: | --- |
'''
for norm, total in counts.items():
    pt += f'| {norm} | {compared[norm]} | {total} | Cotejo completo |\n'
pt += '''
**Total: 1774/1774 registros do inventário conferidos.** Os preâmbulos são registrados separadamente. O anexo tem 560/560 páginas conferidas e 0 pendentes. A nota 23 está completa no cotejo acumulado; a nota 263 e o artigo 88 estão completos; o artigo 114 continuava na página 141 e foi concluído no lote 141–160. Tradução não oficial, conferida pelo assistente nas unidades registradas, sem certificação externa.

## Entrega 22 — sumário e índices

Conferidas as páginas 5–12, 157–163, 213–217 e 265–266. Traduzidas as 331 entradas do sumário e todos os assuntos e condições dos índices. Preservados números, parágrafos, alíneas e anomalias do índice original, descritas nas observações editoriais. Há documentos independentes PT/ES e as correções foram incorporadas ao Manual e ao projeto. O Digesto espanhol e a integração de 2026 continuam parciais. O Manual completo não é declarado aprovado como fonte definitiva.

`npm run documents` regenera documentos, auditoria e acompanhamento. Testes de software, estrutura e links não certificam traduções pendentes nem a vigência em 2026.
'''
pt+='''
## Entrega 24 — lote 24: páginas 21–40

Conferidas as páginas 21–40 e concluída a continuação da nota 23. Verificadas as notas extensas sobre assembleias, batismo e admissão de membros. Conservadas as discrepâncias e repetições do impresso, com observações editoriais nos documentos independentes PT/ES. Avanço: **40/560 páginas; 520 pendentes**. A nota 66 e o artigo 17 continuam na página 41; próximo lote: **41–60**.
'''
pt+='''
## Entrega 25: páginas 41–60

Conferidas as páginas 41–60; concluídos a nota 66 e o artigo 17 no anexo acumulado. Documentos Markdown em português e espanhol, referências e limites conservados. Avanço: **60/560 páginas; 500 pendentes**. Próximo lote: **61–80**, continuação da nota 122 e do artigo 34.
'''
pt+='''
## Entrega 26: páginas 61–80

Conferidas as páginas 61–80: sustento pastoral, licenças, jubilação e atribuições de presbíteros e diáconos. Concluídos a nota 122 e o artigo 34 no anexo acumulado. Conservadas as referências e repetições do impresso, com observações editoriais. Markdown em português e espanhol. Avanço: **80/560 páginas; 480 pendentes**. Próximo lote: **81–100**, continuação da nota 161 e do artigo 54.
'''
pt+='''
## Entrega 27: páginas 81–100

Conferidas as páginas 81–100: oficiais em disponibilidade, títulos eméritos, representação, recursos, eleição de mesas e contribuições conciliares. Concluídos a nota 161 e o artigo 54 no anexo acumulado. O texto do artigo 70 termina na página 100; sua nota 205 continua na 101. Conservadas as particularidades do impresso, com observações editoriais. Markdown em português e espanhol. Avanço: **100/560 páginas; 460 pendentes**. Próximo lote: **101–120**, continuação da nota 205.
'''
pt+='''
## Entrega 28: páginas 101–120

Conferidas as páginas 101–120: reuniões de concílios, quórum e atribuições do Conselho e do Presbitério. Concluída a nota 205 na página 102. Conservadas as referências, limites de página e discrepâncias do impresso, incluindo a data de encerramento do ano financeiro na nota 239. Markdown em português e espanhol. Avanço: **120/560 páginas; 440 pendentes**. Próximo lote: **121–140**, continuação da nota 263 e do artigo 88.
'''
pt+='''
## Entrega 29: páginas 121–140

Conferidas as páginas 121–140: representação e atribuições de concílios, comissões executivas, vocação e eleição de oficiais. Concluídos a nota 263 e o artigo 88. Conservadas as discrepâncias do impresso, incluindo as maiorias da nota 299 e as referências da nota 321. Markdown em português e espanhol. Avanço: **140/560 páginas; 420 pendentes**. Próximo lote: **141–160**, continuação do artigo 114; nenhuma nota pendente no limite da página 140.
'''
pt+='''
## Entrega 30: páginas 141–160

Conferidas as páginas 141–160: candidatura, licenciatura e ordenação, relação pastoral, reformas constitucionais e início do índice. Concluídos o artigo 114, as notas 322–361 e o texto normativo da Constituição. Conservadas as referências históricas discrepantes e as maiorias exigidas. Markdown em português e espanhol. Avanço: **160/560 páginas; 400 pendentes**. Próximo lote: **161–180**, continuação do verbete Liturgia do índice; nenhuma nota nem artigo normativo pendente no limite da página 160.
'''
pt+='''
## Entrega 31: páginas 161–180

Conferidas as páginas 161–180: conclusão do índice da Constituição, separadores e preâmbulo do Código de Disciplina, faltas, penas, garantias processuais e tribunais. Conservadas as anomalias e citações históricas do impresso. Markdown em português e espanhol. Avanço: **180/560 páginas; 380 pendentes**. Próximo lote: **181–200**, continuações da nota 37 e do artigo 22 do Código de Disciplina. A nota 37 não é declarada completa neste lote.
'''
pt+='''
## Entrega 32: páginas 181–200

Conferidas as páginas 181–200: suspeição e incompetência, queixa e denúncia, procedimento suasório, registro de atas e autos, provas, citações, sentenças e início do rito sumaríssimo. Concluídos a nota 37 e o artigo 22 do Código de Disciplina. Conservadas as discrepâncias de datas e documentos do impresso. Markdown em português e espanhol. Avanço: **200/560 páginas; 360 pendentes**. Próximo lote: **201–220**, continuação da nota 79. O artigo 97 está completo; a nota 79 não é declarada completa neste lote.
'''
pt+='''
## Entrega 33: páginas 201–220

Concluídos o Código de Disciplina e seu índice. Conferidos os recursos, execução e restauração; concluída a nota 79. Avanço: **220/560 páginas; 340 pendentes**. Próximo lote: **221–240**, Princípios de Liturgia.
'''
pt+='''
## Entrega 34: páginas 221–240

Conferidos o preâmbulo e o início dos Princípios de Liturgia: Dia do Senhor, templo, culto público, culto individual e doméstico e início do batismo de crianças. Concluídos os artigos 7 e 8 e as notas 2, 3, 5, 7, 8, 9 e 11. A nota 15 e o artigo 11 continuam em 241 e não são declarados completos. Corrigidos erros do espanhol e conservadas as discrepâncias do impresso. Avanço: **240/560 páginas; 320 pendentes**. Próximo lote: **241–260**, continuação da nota 15 e do artigo 11 dos Princípios de Liturgia.
'''
pt+='''
## Entrega 35: páginas 241–260

Conferidos batismo, Santa Ceia, bênção matrimonial, visitação aos enfermos, funerais, jejum, ordenação e instalação de oficiais e ministros e início da organização de igrejas. Concluídos a nota 15 e o artigo 11 dos Princípios de Liturgia. A nota 50 continua em 261 e o artigo 39 é retomado em 262. Avanço: **260/560 páginas; 300 pendentes**. Próximo lote: **261–280**.
'''
pt+='''
## Entrega 36: páginas 261–280

Concluídos os Princípios de Liturgia, seu índice, a nota 50 e o artigo 39. Conferido o início do Estatuto da IPB até o artigo 29: igrejas federadas, Supremo Concílio, membros, Mesa Diretora, secretários e tesoureiro. Conservadas as notas de 2025 sobre atribuições financeiras. Sem continuações pendentes no limite do lote. Avanço: **280/560 páginas; 280 pendentes**. Próximo lote: **281–300**, artigo 30 do Estatuto da IPB.
'''
pt+='''
## Entrega 37: páginas 281–300

Concluído o Estatuto da IPB. Conferido o início do Regimento Interno do Supremo Concílio: órgãos, reuniões, credenciais, eleições, atas, documentos, ordem parlamentar e comissões. Conservados os dois artigos 44, Supremo Executivo e as diferenças de quórum do impresso. O artigo 24 RI-SC continua em 301. Avanço: **300/560 páginas; 260 pendentes**. Próximo lote: **301–320**.
'''
pt+='''
## Entrega 38: páginas 301–320

Conferidos votação, Mesa Diretora, secretarias, comissões e processo disciplinar. Artigo 24 concluído; Regimento Interno até o artigo 58. Conservada a numeração IV/V repetida do artigo 35. Sem continuações abertas. Avanço: **320/560 páginas; 240 pendentes**. Próximo lote: **321–340**, artigo 59 RI-SC.
'''
pt+='''
## Entrega 39: páginas 321–340

Concluído o Regimento Interno do Supremo Concílio. Iniciado o Regimento da Comissão Executiva. Conservados os prazos de esclarecimento de duas horas e cinco dias, a contagem em dias úteis e as referências históricas. Artigo 8 RI-CE continua em 341. Avanço: **340/560 páginas; 220 pendentes**. Próximo lote: **341–360**.
'''
pt+='''
## Entrega 40: páginas 341–360

RI-CE concluído; iniciado o Modelo de Estatuto do Sínodo. Conservadas as decisões sobre unanimidade e vedação de anular resoluções do Supremo Concílio, os prazos documentais e a distinção entre ajuda de custo e reembolsos. Artigo 13 EST-SIN continua em 361. Avanço: **360/560 páginas; 200 pendentes**. Próximo lote: **361–380**.
'''
pt+='''
## Entrega 41: páginas 361–380

Concluídos o Modelo de Estatuto do Sínodo e sua nota 9. Iniciado o Regimento sinodal, até artigo 30. Conservados os diferentes quóruns de reforma nos artigos 18 e 30 do Estatuto e 3 do Regimento, além do inciso V da transcrição constitucional. Sem continuações abertas. Avanço: **380/560 páginas; 180 pendentes**. Próximo lote: **381–400**, artigo 31 RI-SIN.
'''
pt+='''
## Entrega 42: páginas 381–400

Regimento sinodal conferido até artigo 60: Comissão Executiva, cargos, Conselho Fiscal, secretarias, procedimento suasório, sindicância e recursos. Conservadas a eleição anual do Conselho Fiscal com mandato de dois anos e a repetição do prazo de sessenta dias nos artigos 55 e 56. Sem continuações abertas. Avanço: **400/560 páginas; 160 pendentes**. Próximo lote: **401–420**, artigo 61 RI-SIN.
'''
pt+='''
## Entrega 43: páginas 401–420

Regimento sinodal concluído: Tribunal Pleno e de Recursos, prazos, sentença, esclarecimento, representação e disposições finais. Conservadas as diferenças entre cumprimento imediato na apelação e cumprimento após trânsito em julgado no Tribunal de Recursos. Sem continuações abertas. Avanço: **420/560 páginas; 140 pendentes**. Próximo lote: **421–440**, artigo 1 do Estatuto do Presbitério.
'''
pt+='''
## Entrega 44: páginas 421–440

Modelo de Estatuto do Presbitério: identidade, membros, ministros e representantes, órgãos deliberativos, convocação, quórum, eleições e cargos. Conservados os prazos, maiorias e referências históricas, incluindo artigo 4º nas notas 15 e 76. Notas 36, 82 e 85 concluídas. Artigo 34 continua em 441 e não é declarado completo. Avanço: **440/560 páginas; 120 pendentes**. Próximo lote: **441–460**, continuação do artigo 34.
'''
pt+='''
## Entrega 45: páginas 441–460

Estatuto do Presbitério concluído, incluindo artigo 34 iniciado em 440 e notas 112 e 135. Regimento Interno do Presbitério conferido até artigo 15. Conservados os prazos disciplinares, remissões históricas, maiorias diferentes entre Estatuto e Regimento e atas por sessão. Sem continuações abertas. Avanço: **460/560 páginas; 100 pendentes**. Próximo lote: **461–480**, artigo 16 RI-PRE.
'''
pt+='''
## Entrega 46: páginas 461–480

Regimento do Presbitério: comissões, debate e votação, Comissão Executiva, cargos, Conselho Fiscal, secretarias especiais e comunicação de faltas. Conservadas condições de voto, maiorias, prazos de convocação e nota 2 de 2024 sobre desempate. Artigo 48 concluído em 478. Artigo 51 continua em 481 e não é declarado completo. Nenhuma nota aberta. Avanço: **480/560 páginas; 80 pendentes**. Próximo lote: **481–500**, continuação do artigo 51 RI-PRE.
'''
pt+='''
## Entrega 47: páginas 481–500

Regimento do Presbitério: artigo 51 iniciado em 480 concluído; procedimento suasório, sindicância, recursos administrativos, Tribunal, defesa, prova, sentença e esclarecimento. Conservados sigilo de atas, diferentes prazos e condições de recurso e defesa e aprovação final sem mudar o dispositivo proclamado. Artigo 85 continua em 501 e não é declarado completo. Nenhuma nota aberta. Avanço: **500/560 páginas; 60 pendentes**. Próximo lote: **501–520**, continuação do artigo 85 RI-PRE.
'''
pt+='''
## Entrega 48: páginas 501–520

Regimento do Presbitério concluído, incluindo artigo 85 e livro de atas. Início do Modelo de Estatuto da Igreja Local: identidade, membresia, assembleias e Conselho. Nota 2 concluída em 512 e conservada como resolução histórica; prazos, quóruns e condições de voto preservados. Artigo 24 continua em 521 e não é declarado completo. Nenhuma nota aberta. Avanço: **520/560 páginas; 40 pendentes**. Próximo lote: **521–540**, continuação do artigo 24 EST-IG.
'''
pt+='''
## Entrega 49: páginas 521–540

Modelo de Estatuto da Igreja Local concluído. Governo do Conselho, quóruns, administração, contas, patrimônio e disciplina conferidos. Início do Regimento da Junta Diaconal: deveres, atribuições e Mesa Diretora. Resoluções e referências legais conservadas como documentação histórica do impresso de 2025. Artigo 12 RI-JD continua em 541 e não é declarado completo. Nenhuma nota aberta. Avanço: **540/560 páginas; 20 pendentes**. Próximo lote: **541–560**, continuação do artigo 12 RI-JD.
'''
pt+='''
## Entrega 50: páginas 541–560

Regimento da Junta Diaconal e Regulamento de Atas concluídos. Todas as continuações encerradas, inclusive nota 5 ATAS em 557. Anexo: **560/560 páginas, 0 pendentes**. Cotejo textual completo pelo assistente do Manual histórico 2025 e do anexo; sem certificação externa nem aprovação definitiva. Digesto espanhol permanece em 1/398 e integração parcial. Próxima etapa: tradução e cotejo do Digesto 2026.
'''
pt+='''
## Entrega 51: primeiras dez decisões do Digesto

Traduzidas e conferidas CCXLI–CCXXXII. Avanço 11/398 decisões traduzidas; 387 pendentes de tradução. Constituinte do Código de Disciplina como procedimento pendente; eleições e nomeações aprovadas, sem reforma automática do Manual. Próximo lote desde SC-2026-CCXXXI.
'''
pt+='''
## Entrega 52: Digesto, decisões 11–20

Traduzidas e conferidas CCXXXI–CCXXII. Avanço 21/398 traduzidas, 20 conferidas; 377 pendentes. Arquivamento FEP e frase ambígua da CRIE mantidos; sem integração automática de reformas. Próximo lote desde SC-2026-CCXXI, página 10.

## Entrega 53: Digesto, decisões 21–30

Traduzidas e conferidas CCXXI–CCXII: nomeações de oito JURET, comissão de drogas e CM. Nomes, referência ao art. 7º e mandatos até CE 2028 preservados. Avanço 31/398 traduzidas, 30 conferidas; 367 pendentes de tradução. Próximo lote desde SC-2026-CCXI, página 13.

## Entrega 54: Digesto, decisões 31–40

Traduzidas e conferidas CCXI–CCII. Nomeações, propostas rejeitadas, início de procedimento do art. 23 §2, estudo sobre art. 87 e retificação sobre CCB diferenciados. Anomalias do original mantidas. Avanço 41/398 traduzidas, 40 conferidas; 357 pendentes. Próximo lote desde SC-2026-CCI, página 27, já traduzida e pendente de cotejo individual registrado.

## Entrega 55: Digesto, decisões 41–50

CCI conferida e nove decisões CC–CXCII traduzidas e conferidas. Votos e redações de EC 3–8 preservados; integração mantém seis emendas. Indicações já apreciadas de Quinze de Novembro e Gammon diferenciadas de novas eleições. Avanço 50/398 traduzidas, 50 conferidas; 348 pendentes. Próximo lote desde SC-2026-CXCI, página 31.

## Entrega 56: Digesto, decisões 51–70

Vinte decisões CXCI–CLXXII traduzidas e conferidas. Reforma de educação teológica com transição, estrutura e orçamento dos adolescentes, atas eletrônicas e relatórios institucionais diferenciados; inconsistências documentadas. Avanço 70/398 traduzidas e conferidas; 328 pendentes. Próximo lote ampliado desde SC-2026-CLXXI, página 56. Integração mantém seis emendas; novas reformas pendentes de integração.

## Entrega 57: Digesto, decisões 71–90

Vinte decisões CLXXI–CLII traduzidas e conferidas. Relatórios, cooperação acadêmica, consultas doutrinárias, extensões condicionadas, presidência de assembleias e recepção de membros diferenciados. Numeração e anomalias preservadas. Avanço 90/398 traduzidas e conferidas; 308 pendentes. Próximo lote desde SC-2026-CLI, página 78.

## Entrega 58: Digesto, decisões 91–110

Vinte decisões CLI–CXXXII traduzidas e conferidas: confessionalidade, contribuições, Ceia, proteção de menores, competências e relatórios missionários e atas. Condições, remissões e numeração preservadas. Avanço 110/398 traduzidas e conferidas; 288 pendentes. Próximo lote desde SC-2026-CXXXI, página 104.

## Entrega 59: Digesto, decisões 111–130

Vinte decisões CXXXI–CXII traduzidas e conferidas: atas, culto, ministérios, história, cosmovisões, indicações, disciplina e sociedades internas. Condições, exceções e anomalias preservadas. Avanço 130/398 traduzidas e conferidas; 268 pendentes. Próximo lote desde SC-2026-CXI, página 129.

## Entrega 60: Digesto, decisões 131–150

Vinte decisões CXI–XCII traduzidas e conferidas: datas comemorativas, CSM, acessibilidade, propostas organizacionais e atas sinodais. Revogações, condições e correções obrigatórias preservadas. Avanço 150/398 traduzidas e conferidas; 248 pendentes. Próximo lote desde SC-2026-XCI, página 151.

## Entrega 61: Digesto, decisões 151–170

Vinte decisões XCI–LXXII traduzidas e conferidas: atas e relatórios sinodais, eleições, assinaturas, sessões e correções estatísticas. Anomalias, períodos e alcance das aprovações preservados. Avanço 170/398 traduzidas e conferidas; 228 pendentes. Próximo lote desde SC-2026-LXXI, página 171.

## Entrega 62: Digesto, decisões 171–190

Vinte decisões LXXI–LII traduzidas e conferidas: aprovação de atos, correções de atas, continuidade administrativa, tribunais, contas e personalidade jurídica. Condições, prazos e anomalias preservados. Avanço 190/398 traduzidas e conferidas; 208 pendentes. Próximo lote desde SC-2026-LI, página 192.

## Entrega 63: Digesto, decisões 191–210

Vinte decisões LI–XXXII traduzidas e conferidas: atas e relatórios sinodais, estatísticas, liderança, planejamento e correções expressas. Repetições, dados incompletos, numeração e condições preservados. Avanço 210/398 traduzidas e conferidas; 188 pendentes. Próximo lote desde SC-2026-XXXI, página 215.

## Entrega 64: Digesto, decisões 211–230

Vinte decisões XXXI–XII traduzidas e conferidas: atas e relatórios, recursos, correções estatísticas e registros sinodais. Tropical sem aprovação expressa e Costa do Sol com rejeição financeira diferenciados. Avanço 230/398 traduzidas e conferidas; 168 pendentes. Próximo lote desde SC-2026-XI, página 239.

## Entrega 65: Digesto, decisões 231–250

Oito decisões SC XI–IV e doze CE CLXIII–CLII traduzidas e conferidas integralmente: comissões, jubilação, reeleição, siglas, ofícios, orçamento, contratos e patrimônio. Estudos, negativas e autorizações condicionadas diferenciados. Avanço 250/398 traduzidas e conferidas; 148 pendentes. Próximo lote desde CE-2026-CLI, página 258.

## Entrega 66: Digesto, decisões 251–260

Dez decisões CE CLI–CXLII traduzidas e conferidas integralmente: garantias, patrimônio, orçamento, boleto de dízimo e cartas-voto. Estudos e remessas distintos de autorizações. Avanço 260/398 traduzidas e conferidas; 138 pendentes. Próximo lote desde CE-2026-CXLI, página 262.

## Entrega 67: Digesto, decisão 261

Decisão CE-CXLI integral: alteração estatutária IBN, considerandos, adequações e consolidação de 31 artigos. Quóruns, competências, responsabilidade e condições de vigência preservados. Avanço 261/398 traduzidas e conferidas; 137 pendentes. Próximo lote desde CE-2026-CXL, página 273.

## Entrega 68: Digesto, decisões 262–271

Dez decisões CE CXL–CXXXI integrais: recursos, eleições, publicações, alteração parcial de resoluções e patrimônio. Admissibilidade, estudos e formalização diferenciados. Avanço 271/398 traduzidas e conferidas; 127 pendentes. Próximo lote desde CE-2026-CXXX, página 283.

## Entrega 69: Digesto, decisões 272–281

Dez decisões CE CXXX–CXXI integrais: relatórios, indicações, arquivos, seminário e missão. Cifras discrepantes e alcance das remessas preservados. Avanço 281/398 traduzidas e conferidas; 117 pendentes. Próximo lote desde CE-2026-CXX, página 292.

## Entrega 70: Digesto, decisões 282–291

Dez decisões CE CXX–CXI integrais: cooperação, tecnologia, atribuições conciliares e missão. Planos, estudos, membresia, voz e voto diferenciados. Avanço 291/398 traduzidas e conferidas; 107 pendentes. Próximo lote desde CE-2026-CX, página 300.

## Entrega 71: Digesto, decisões 292–311

Vinte decisões CE CX–XCI integrais: consultas, disciplina, regulamento de atas e registros presbiteriais. Esclarecimento, alteração aprovada e anteprojeto diferenciados. Avanço 311/398 traduzidas e conferidas; 87 pendentes. Próximo lote desde CE-2026-XC, página 309.

## Entrega 72: Digesto, decisões 312–331

Vinte decisões CE XC–LXXI integrais: sínodos, estatutos, comodato e relatórios contábeis. Condições registrais e excesso sem aprovação prévia preservados. Avanço 331/398 traduzidas e conferidas; 67 pendentes. Próximo lote desde CE-2026-LXX, página 320.

## Entrega 73: Digesto, decisões 332–351

Vinte decisões CE LXX–LI integrais: contas, recurso Guará, expedientes pendentes e jubilações. Exceções e ausência de juízo de mérito preservadas. Avanço 351/398 traduzidas e conferidas; 47 pendentes. Próximo lote desde CE-2026-L, página 332.

## Entrega 74: Digesto, decisões 352–371

Vinte jubilações CE L–XXXI integrais com históricos, famílias e distinções. Bases específicas, ausência de ônus IPB e anomalias originais preservadas. Avanço 371/398 traduzidas e conferidas; 27 pendentes. Próximo lote desde CE-2026-XXX, página 342.

## Entrega 75: Digesto, decisões 372–391

Vinte jubilações CE XXX–XI integrais com históricos, famílias e distinções. Cifras e cronologias incompatíveis preservadas sem conjecturas. Avanço 391/398 traduzidas e conferidas; 7 pendentes. Próximo lote desde CE-2026-X, página 352.

## Entrega 76: fechamento do Digesto, decisões 392–398

Sete decisões CE X–IV integrais: jubilações, reforma de sentença, restaurações e exonerações. Variantes de nomes e fechamento editorial preservados. Avanço 398/398 traduzidas e conferidas; 0 pendentes. Tradução do Digesto concluída; integração normativa, revisão editorial e aprovação definitiva pendentes. Próxima fase: integração e revisão final.

## Entrega 77: integração normativa prioritária 01

Dez decisões com efeitos conferidos: 10/398 examinadas, 388 pendentes de exame normativo. Mantêm-se as seis EC 3–8; integrada a retirada do inciso X do corpo principal do RI-CE art. 8 (SC-CXXIII), preservando o inciso X do parágrafo único. CE-CXIX identificada como revogada por SC-CIX. Orientações de atas/assembleias e procedimentos pendentes anotados sem transformar propostas em normas. Remissão de aprovação de atas corrigida de art. 13 para arts. 10 e 6. Digesto traduzido e conferido: 398/398. Próximo exame: decisões restantes desde SC-2026-CCXLI; prioridade à correção pontual de Atas art. 3 e regimentos com transição.

## Entrega 78: integração normativa 02

Vinte decisões examinadas: dezenove SC CCXLI–CCXXII (exclui SC CCXXXIX, já conferida) e CE CII. Atualizado o caput de Atas art. 3 para termos de abertura e encerramento sem numeração, preservando §§ 1–3 e assinalando seus modelos históricos. Dezesseis nomeações/indicações, arquivo FEP, identidade visual UCP e Projeto Alagoas registrados sem inseri-los como reformas de artigos. Expedientes PT/ES separados. Avanço normativo 30/398; 368 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-CCXXI.

## Entrega 79: integração normativa 03

Vinte decisões SC CCXXI–CXCIX examinadas, excluindo as já conferidas. Quinze nomeações ou indicações, duas propostas rejeitadas, rejeição e estudo sobre representação, decisão específica sobre CCB e proposta prematura do anteprojeto do Código de Disciplina. Anotações vinculadas sem novas substituições de artigos. Prazos JURET individuais e referências divergentes SC-2022-XX/Doc. 064 preservados. Avanço normativo 50/398; 348 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-CXCVIII.

## Entrega 80: integração normativa 04

Vinte decisões SC CXCVIII–CLXXVIII examinadas, excluindo SC CLXXXI já conferida. Seis nomeações/eleições, três documentos prejudicados, oito relatórios e decisões sobre regulamento educacional, hino UPA e estrutura/orçamento SNTA. Educação teológica: 29 ajustes a–cc, revogação RI-JET e transição até SC 2030 delimitados; texto-base integral ausente identificado. SNTA: cinco orientadores sujeitos a aprovação CE e participação 0,28% a 1,0%, sem presumir execução. Apontamentos PT/ES separados; artigos históricos preservados. Avanço normativo 70/398; 328 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-CLXXVII.

## Entrega 81: integração normativa 05

Vinte decisões SC CLXXVII–CLVIII examinadas. Onze relatórios com observações e determinações, duas cooperações acadêmicas CPAJ, rejeição de alteração do Credo, comissões de estudo, remissão ECA, recepção específica IASD e duas extensões de seminários. Condições de assinatura, bolsas, custeio e supervisão preservadas; não se presume execução. Apontamentos e vínculos sem novas substituições de artigos. Avanço normativo 90/398; 308 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-CLVII.

## Entrega 82: integração normativa 06

Vinte decisões SC CLVII–CXXXVII examinadas, excluindo CLIV já conferida. Seminários condicionados, consultas doutrinárias e de membresia, Santa Ceia com suco de uva admitido, proteção de menores, orçamentos e relatórios missionários distintos. Discrepâncias CI art. 18 e EST-SIN art. 5 assinaladas; apontamentos PT/ES sem novas substituições de artigos. Avanço normativo 110/398; 288 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-CXXXVI.

## Entrega 83: integração normativa 07

Vinte decisões SC CXXXVI–CXVI examinadas, excluindo CXXIII já conferida. Relatórios missionários/Tesouraria, seis livros CE com observações, culto público e ensino, recurso e revogação rejeitados, carnaval, cosmovisões, indicações, casamentos, homenagens, dissolução pastoral e maledicência digital. Limites e discrepâncias preservados; sem novas substituições de artigos. Avanço normativo 130/398; 268 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-CXV.

## Entrega 84: integração normativa 08

Vinte decisões SC CXV–XCV examinadas, excluindo CIX já conferida. Orientação Legendários, propostas de sociedades/secretarias, formação de presbíteros, espaço de eventos em estudo, conselho de acolhimento com determinações e duas datas de calendário. Dez exames sinodais com observações; atas por sessão, correções, privacidade e nulidade SBB delimitados. Sem novas substituições de artigos. Avanço normativo 150/398; 248 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-XCIV.

## Entrega 85: integração normativa 09

Vinte decisões SC XCIV–LXXV examinadas: atas, atos e relatórios sinodais. Planalto e Central de Brasília: correção preservando originais e reenvio em 60 dias para CE 2027. Sergipe 66→4 e Paraíba 321→47; Rio Grande do Norte sem novo número fixado. Ata preparatória única compatível com atas por sessão regular; organização 2024 distinta de correção material 2025. Referências e discrepâncias preservadas; sem novas substituições de artigos. Avanço normativo 170/398; 228 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-LXXIV.

## Entrega 86: integração normativa 10

Vinte decisões SC LXXIV–LV examinadas. Sudoeste de Goiás deve refazer livro para CE 2027; Limeira: continuidade, ratificação de atos, Tribunal e UPH. Piratininga: renda bienal R$ 22.480,05→R$ 19.480,05. Paulistano: tesouraria subordinada, regularização e ata extraordinária em 60 dias ou justificativa. Nova Iguaçu: aprovação plenária do estatuto pendente. Numeração, referências, assinaturas, alinhamento e dados fiscais preservados com limites; sem novas substituições de artigos. Avanço normativo 190/398; 208 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-LIV.

## Entrega 87: integração normativa 11

Vinte decisões SC LIV–XXXV examinadas. Relatórios ausentes, prazos sinodais anteriores, Tribunal, nomes/quórum, correção do cabeçalho, planejamento e privacidade delimitados. Referências CD 26/25 e regimentos cotejadas sem substituição silenciosa; escaneamento cortado e campos vazios não reconstruídos. Atos aprovados e mero conhecimento dos relatórios distintos; sem novas substituições de artigos. Avanço normativo 210/398; 188 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-XXXIV.

## Entrega 88: integração normativa 12

Vinte decisões SC XXXIV–XV examinadas. Dezenove aprovações com observações e Tropical pendente de correção/exame. Totais +183/+43, autos de correção e envios em 30 dias registrados; ata XVI indicada sem estender ordem à XVIII. Setentrional, Marco Zero e Leste/Norte Fluminense preservam divergências; comissão especial distinta do Tribunal e conhecimento da sentença de nova condenação. Sem novas substituições de artigos. Avanço normativo 230/398; 168 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde SC-2026-XIV.

## Entrega 89: integração normativa 13

Vinte decisões SC XIV–IV e CE CLXIII–CLV examinadas. Relatórios, segregação fiscal, comissão de drogas, jubilados, reeleição, siglas e orientações doutrinárias distintos; orçamento e contratos autorizados sem presumir execução. Estudos de obras, Caiuá, Projeto Vida e TV; INSS remetido. Doação IPN condicionada e revogação externa parcial CE2022-CLV registradas. Sem novas substituições de artigos. Avanço normativo 250/398; 148 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-CLIV.

## Entrega 90: integração normativa 14

Vinte decisões CE CLIV–CXXXV examinadas. Atos patrimoniais e estudos distintos da execução; estatuto IBN integral conservado com adequações e limites. Prorrogação de cartas-voto CD, recursos administrativos, comunicação prévia de plantação e iCalvinus documentados. Livros digitais sujeitos a estudo; revogações externas parciais de 2025 e remessa GTSI sem reforma aprovada. Sem novas substituições de artigos. Avanço normativo 270/398; 128 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-CXXXIII.

## Entrega 91: integração normativa 15

Vinte decisões CE CXXXIII–CXIV examinadas. Incorporação HERV e encerramento Cidade Mackenzie com determinações pendentes; relatórios, nomeações e comodato distintos. Estudos CPSS, PBET, Angola e estatística; lançamento JMN autorizado. CE-CXIX preservada como antecedente revogado pelo SC-CIX. Interpretações sobre poderes de transferência e palavra do emérito sem voto; discrepância CI88 l/c assinalada. CESEPPI devolvida e ECA remetida sem mérito. Sem novas substituições de artigos. Avanço normativo 290/398; 108 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-CXIII.

## Entrega 92: integração normativa 16

Vinte decisões CE CXIII–XCII examinadas, excluindo CIII/CII já conferidas. Repasse mensal APMT determinado sem atribuição expressa de verbas rescisórias; carta CI125 de jurisdição e procedimentos SAF distintos. Remessas ao SC e consulta FAP sem mérito. Sustento disciplinar facultativo, sem pagamento automático ou limite de um ano extraído da proposta. Dez registros presbiteriais com siglas condicionadas e dados históricos conservados. Sem novas substituições de artigos. Avanço normativo 310/398; 88 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-XCI.

## Entrega 93: integração normativa 17

Vinte decisões CE XCI–LXXII examinadas. Registros presbiteriais, fusão PCEC e criação de quatro sínodos com comissões especiais distintos da execução. Estatutos Erasmo Braga/APMT, comodato Palmas e minutas SAC/SCH/SCI com alcance específico. Relatórios contábeis aprovados sem certificação independente; IBAA sem mérito por competência. Excesso CE2025 de 44,59% e ausência de aprovação prévia JPEF conservados; siglas PRCV/PRER frente a PBCV/PBER assinaladas. Sem novas substituições de artigos. Avanço normativo 330/398; 68 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-LXXI.

## Entrega 94: integração normativa 18

Vinte decisões CE LXXI–LII examinadas. Relatórios aprovados com controles; Noroeste pendente, sem aprovação das contas, e 60 dias para exame. Guará: transferências e dissolução anuladas, Eixo Sul válido, transferência PRGU determinada. Coletivo sobrestado sem mérito, Imperatriz remetida e divulgação de carta litúrgica existente. Indicações JURETs remetidas com exceção Recife de dois anos; sete jubilações individuais sem ônus IPB. Sem novas substituições de artigos. Avanço normativo 350/398; 48 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-LI.

## Entrega 95: integração normativa 19

Vinte decisões CE LI–XXXII examinadas: jubilações individuais sem ônus IPB e honrarias. Referências CI49 distintas conservadas; discrepância de idade Valnei, trajetória incompleta José Apolinário, numeração e dados biográficos assinalados sem correções por suposição ou declaração de invalidade. Sem novos benefícios nacionais, voto geral ou substituição de artigos. Avanço normativo 370/398; 28 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-XXXI.

## Entrega 96: integração normativa 20

Vinte decisões CE XXXI–XII examinadas: jubilações individuais sem ônus IPB e honrarias. Referências CI49 conservadas; discrepâncias de idades Eudes/Antônio Célio, trajetória Edilaney e cronologia Anderson assinaladas sem substituir dados ou declarar invalidade. Variantes nominais, geografia e biografia preservadas. Sem benefícios nacionais novos, voto geral ou substituição de artigos. Avanço normativo 390/398; 8 pendentes. Digesto traduzido e conferido 398/398. Próximo exame desde CE-2026-XI.

## Entrega atual — lote 97: fechamento do exame normativo

Últimas oito decisões CE XI–IV examinadas: jubilações, sentença reformada, restaurações e baixas CI48 a/b/c distintas. Variantes nominais e terminológicas conservadas sem fundir pessoas ou atribuir condenações não documentadas. Conclui-se exame documental de efeitos: 398/398; 0 pendentes. Digesto traduzido e conferido 398/398. Sem novas substituições de artigos. Próxima fase: consolidação e revisão editorial final; não há certificação externa ou aprovação definitiva da edição espanhola.
'''
pt += '\n## Entrega atual — lote 98: consolidação e controle editorial\n\nSuplementos espanhol e português com as 398 decisões, efeitos, limites, fontes e hashes. Conservados os 21 dossiers históricos. Relatórios atuais corrigidos e tradução de CI, nota 259, corrigida com registro da alteração. Nove sinalizações São classificadas como nomes próprios. Aprovação editorial definitiva pendente: compatibilidade das notas históricas com as alterações, bases normativas não fornecidas e divergências documentais. Consulte revision_editorial_consolidacion_2026_pt.md.\n'
pt += '\n## Entrega atual — lote 99: compatibilidade de notas históricas\n\nOito artigos alterados e suas 25 notas diretas examinados, com cotejo de EST-IG art.28 e ATAS art.20. Advertências específicas sobre pastor emérito, eleição anual e pluralidade de tesoureiros, prazos de recurso e distinção entre presbítero e diácono em disponibilidade. Textos documentais conservados; não se declara revogação integral de notas por inferência. Próximo: referências transversais nas demais notas e confirmação das divergências.\n'
pt += '\n## Entrega atual — lote 100: primeiro cotejo transversal\n\nRastreio reproduzível de 816 notas; 25 diretas já examinadas e 791 elegíveis para rastreio transversal. Conferido o texto completo de 20 notas na sua relação com as alterações de 2026. Advertida a remessa histórica de recursos em 90 dias diante do novo prazo de 30 dias, sem substituir os 90 dias de interposição nem os prazos judiciais. Conservadas as citações antigas sobre emerência e a remissão in fine do art.27 com advertências específicas. Demais candidatas automáticas pendentes de classificação; não são incompatibilidades confirmadas.\n'
pt += '\n## Entrega atual — lote 101: referências a outros dispositivos\n\nIdentificadas 40 candidatas que remetem a dispositivos distintos daqueles alterados: Código Civil, Código de Disciplina, Liturgia, Constituição arts.3/8 e modelos estatutários ou regimentais. Acumuladas 60 candidatas classificadas de 142; 82 pendentes. A classificação não comprova vigência geral nem ausência de relações implícitas. Nenhum texto normativo substituído; modelos históricos não são equiparados automaticamente aos atuais. Próximo: demais competências presbiteriais, representação, comissões e Secretaria Executiva.\n'
pt += '\n## Entrega atual — lote 102: competências e representação\n\nConferidas mais 30 notas transversais completas, com EC3/7/8 e esclarecimentos CE2026-CIV/CXII/CXXXVIII. Distinguidos candidatura, ministério ordenado, eleição/designação, representação/ex officio, sustento em afastamento/deposição e comunicação em plantação. Acumuladas 90/142 candidatas classificadas: 50 relações com alterações e 40 outros dispositivos; 52 pendentes. Compatibilidade do voto específico de jubilado sem representação continua pendente de confirmação; dados fiscais históricos não foram atualizados.\n'
pt += '\n## Entrega atual — lote 103: Secretaria Executiva e disponibilidade\n\nMais 24 notas examinadas. Separados arquivo histórico, correspondência, correção redacional e assinatura; voto no Plenário, na Executiva e em comissões; mandato do Conselho local e da Mesa presbiterial. Revogação limitada ao inciso X principal de RI-CE8; inciso XI do parágrafo único preservado. Acumuladas 114/142 candidatas classificadas, 28 pendentes. Compatibilidade do voto do jubilado continua aberta; não se declara reformado o RI-SE sem a base integral.\n'
pt += '\n## Entrega atual — lote 104: encerramento do rastreio\n\n28 notas de Liturgia, Disciplina, candidaturas e seminários examinadas. Classificadas 142/142 candidatas; 0 pendentes do rastreio. Não equivale a compatibilidade global definitiva. Confirmações documentais organizadas em sete grupos selecionados, separados das normas, com fontes e critérios de confirmação. Consulte pendientes_confirmacion_documental_2026_pt.md.\n'
pt += '\n## Entrega atual — revisão das confirmações: sete grupos examinados; P02 encerrado por cotejo textual e P05 por localização do RI-SE; cinco grupos com questões abertas, três com avanços parciais. Documentos necessários em pendientes_confirmacion_documental_2026_pt.md. Sem aprovação oficial.\n'
(d / 'lista_trabalho_manual_presbiteriano_pt.md').write_text(pt)

# Relatório em português, com o registro integral das correções espanholas como evidência.
es_report = (d / 'revision_manual_2025_es.md').read_text()
table = es_report.split('## Errores confirmados y corregidos\n\n', 1)[1].split('\n\nSon correcciones', 1)[0]
table = table.replace('| Pasaje | Error de la versión anterior | Corrección |', '| Passagem | Texto espanhol anterior / problema | Texto espanhol corrigido |')
rows = '\n'.join(f'| {r["id"]} | {r["page"]} | {r["kind"]} |' for r in manual)
report_pt = f'''# Revisão da tradução espanhola do Manual 2025 — 14 de outubro de 2026

**Parecer: NÃO APROVADO COMO FONTE DEFINITIVA DO SISTEMA.**

O inventário de 1774 registros tem cotejo por unidade com o português extraído do PDF: 900 artigos, 816 notas e 58 páginas complementares. Inclui as 331 entradas do sumário e os três índices remissivos. Os preâmbulos e a introdução do Estatuto foram tratados separadamente. O anexo tem 560/560 páginas conferidas; revisão por páginas concluída; o cotejo independente do anexo também está concluído; as 398 decisões de 2026 estão traduzidas, conferidas e examinadas quanto aos efeitos; a aprovação editorial definitiva permanece pendente.

## Correções documentadas

A tabela conserva os fragmentos e descrições em espanhol para permitir a comparação da tradução anterior com a corrigida. São correções editoriais da tradução histórica de 2025, não alterações normativas de 2026. As anomalias do índice original permanecem, com observações no documento independente PT/ES.

{table}

## Alcance verificável

Conservados identificadores, marcadores de notas e a sequência das 560 páginas do anexo. Os controles de software não comprovam equivalência normativa. As páginas 21–40 foram lidas integralmente em português e espanhol. Verificadas visualmente as páginas 21, 27, 33 e 40 para confirmar discrepâncias e limites. Concluída a nota 23; a nota 263 e o artigo 88 estão completos; o artigo 114 continuava na página 141 e foi concluído no lote 141–160. As páginas 41–60 foram lidas integralmente nos dois idiomas; verificação visual em 41, 48, 54, 55 e 60. Concluídos a nota 66 e o artigo 17. As páginas 61–80 foram lidas integralmente nos dois idiomas, com verificação visual em 61, 65, 76, 79 e 80. Concluídos a nota 122 e o artigo 34; a nota 263 e o artigo 88 estão completos; o artigo 114 continuava na página 141 e foi concluído no lote 141–160. Conservadas a repetição da nota 148 e a remissão ao artigo 4º da nota 152. As páginas 81–100 foram lidas integralmente nos dois idiomas, com verificação visual em 81, 82, 86, 89, 97, 99 e 100. Concluídos a nota 161 e o artigo 54; o texto do artigo 70 termina em 100, com nota 205 pendente de 101. Conservadas as particularidades e referências discrepantes descritas nas observações editoriais do lote. As páginas 101–120 foram lidas integralmente nos dois idiomas, com verificação visual em 105, 109, 113 e 120. Concluída a nota 205 em 102. Nesse lote, a nota 263 e o artigo 88 continuavam em 121; ambos foram concluídos no lote seguinte. Conservada a discrepância de datas de encerramento do ano financeiro na nota 239. As páginas 121–140 foram lidas integralmente nos dois idiomas, com verificação visual em 123, 133, 137 e 140. Concluídos a nota 263 e o artigo 88; o artigo 114 continua em 141. Nenhuma nota pendente no limite de 140. Conservadas as maiorias distintas da nota 299 e as referências discrepantes da nota 321. As páginas 161–180 foram conferidas integralmente com o texto português extraído do PDF. O índice da Constituição está completo. A nota 37 e o artigo 22 do Código de Disciplina continuam em 181. Conservadas as anomalias e citações históricas. Os registros de cotejo contêm hashes do original português e da tradução corrigida para detectar mudanças posteriores. Não há certificação externa nem validação integral de todas as imagens do PDF. Na página 2, a imagem permitiu separar créditos; na página 4, corrigir o cabeçalho duplicado pela extração. As 19 páginas em branco foram verificadas sem texto, imagens, desenhos ou anotações.

| Identificador | Página PDF | Tipo de registro |
| --- | ---: | --- |
{rows}

## Uso no sistema

O Manual, os resultados de busca e as exportações mantêm o estado não oficial e não aprovado como fonte definitiva. Deve-se conferir o conteúdo com o PDF português. O anexo automático pode diferir das unidades corrigidas. O Digesto espanhol tem 398/398 decisões traduzidas, conferidas e examinadas quanto aos efeitos. A integração inclui seis emendas de SC-2026-CCI, a revogação do inciso X do art. 8 do RI-CE e a substituição do caput do art. 3 do Regulamento de Atas; os demais efeitos ficam em apontamentos separados. Cobertura, contagem de registros ou testes aprovados não equivalem a aprovação integral da tradução nem a confirmação de vigência.

As versões antes/depois estão em `correcciones_revision_manual.json`; as evidências e limitações, em `auditoria_revision_manual.json`.
'''
(d / 'revision_manual_2025_pt.md').write_text(report_pt)

manifest = json.loads((d / 'estado_bilingue.json').read_text())
pairs = [
    {'es': 'manual_2025_es.md', 'pt': 'manual_2025_pt.md', 'stateEs': 'Inventario cotejado; anexo 560/560', 'statePt': 'Inventário conferido; anexo 560/560'},
    {'es': 'digesto_2026_es.md', 'pt': 'digesto_2026_pt.md', 'stateEs': 'Español completo y cotejado: 398/398; revisión editorial final pendiente', 'statePt': 'Espanhol completo e conferido: 398/398; revisão editorial final pendente'},
    {'es': 'manual_integrado_es.md', 'pt': 'manual_integrado_pt.md', 'stateEs': 'Integración parcial: seis enmiendas, revocación RI-CE y corrección Actas', 'statePt': 'Integração parcial: seis emendas, revogação RI-CE e correção Atas'}]
for key in ['normativeIntegrationDocuments','normativeIntegrationSecondBatchDocuments','normativeIntegrationThirdBatchDocuments','normativeIntegrationFourthBatchDocuments','normativeIntegrationTwentyFirstBatchDocuments','normativeIntegrationTwentiethBatchDocuments','normativeIntegrationNineteenthBatchDocuments','normativeIntegrationEighteenthBatchDocuments','normativeIntegrationSeventeenthBatchDocuments','normativeIntegrationSixteenthBatchDocuments','normativeIntegrationFifteenthBatchDocuments','normativeIntegrationFourteenthBatchDocuments','normativeIntegrationThirteenthBatchDocuments','normativeIntegrationTwelfthBatchDocuments','normativeIntegrationEleventhBatchDocuments','normativeIntegrationTenthBatchDocuments','normativeIntegrationNinthBatchDocuments','normativeIntegrationEighthBatchDocuments','normativeIntegrationSeventhBatchDocuments','normativeIntegrationSixthBatchDocuments','normativeIntegrationFifthBatchDocuments','digestoFirstBatchDocuments','digestoSecondBatchDocuments','digestoThirdBatchDocuments','digestoFourthBatchDocuments','digestoFifthBatchDocuments','digestoSixthBatchDocuments','digestoSeventhBatchDocuments','digestoEighthBatchDocuments','digestoNinthBatchDocuments','digestoTenthBatchDocuments','digestoEleventhBatchDocuments','digestoTwelfthBatchDocuments','digestoThirteenthBatchDocuments','digestoFourteenthBatchDocuments','digestoFifteenthBatchDocuments','digestoSixteenthBatchDocuments','digestoSeventeenthBatchDocuments','digestoEighteenthBatchDocuments','digestoNineteenthBatchDocuments','digestoTwentiethBatchDocuments','digestoTwentyFirstBatchDocuments','digestoTwentySecondBatchDocuments','digestoTwentyThirdBatchDocuments','digestoTwentyFourthBatchDocuments','digestoTwentyFifthBatchDocuments','digestoTwentySixthBatchDocuments','constitutionDocuments','disciplineDocuments','liturgyDocuments','ipbStatuteDocuments','supremeRulesDocuments','executiveRulesDocuments','synodStatuteDocuments','synodRulesDocuments','presbyteryStatuteDocuments','presbyteryRulesDocuments','churchStatuteDocuments','deaconRulesDocuments','minutesRulesDocuments','frontMatterDocuments','indexDocuments','annexPageDocuments','annexSecondBatchDocuments','annexThirdBatchDocuments','annexFourthBatchDocuments','annexFifthBatchDocuments','annexSixthBatchDocuments','annexSeventhBatchDocuments','annexEighthBatchDocuments','annexNinthBatchDocuments','annexTenthBatchDocuments','annexEleventhBatchDocuments','annexTwelfthBatchDocuments','annexThirteenthBatchDocuments','annexFourteenthBatchDocuments','annexFifteenthBatchDocuments','annexSixteenthBatchDocuments','annexSeventeenthBatchDocuments','annexEighteenthBatchDocuments','annexNineteenthBatchDocuments','annexTwentiethBatchDocuments','annexTwentyFirstBatchDocuments','annexTwentySecondBatchDocuments','annexTwentyThirdBatchDocuments','annexTwentyFourthBatchDocuments','annexTwentyFifthBatchDocuments','annexTwentySixthBatchDocuments','annexTwentySeventhBatchDocuments','annexTwentyEighthBatchDocuments']:
    es, pt = manifest[key]
    pairs.append({'es': es, 'pt': pt, 'stateEs': 'Texto histórico cotejado', 'statePt': 'Texto histórico conferido'})
pairs.extend([
    {'es':'compatibilidad_transversal_lote_05_2026_es.md','pt':'compatibilidad_transversal_lote_05_2026_pt.md','stateEs':'Cierre del rastreo: 142/142 clasificadas; confirmaciones abiertas','statePt':'Encerramento do rastreio: 142/142 classificadas; confirmações abertas'},
    {'es':'pendientes_confirmacion_documental_2026_es.md','pt':'pendientes_confirmacion_documental_2026_pt.md','stateEs':'7 grupos revisados; 2 cerrados en su alcance y 5 pendientes','statePt':'7 grupos examinados; 2 encerrados no alcance e 5 pendentes'},
    {'es':'compatibilidad_transversal_lote_04_2026_es.md','pt':'compatibilidad_transversal_lote_04_2026_pt.md','stateEs':'24 notas; Secretaría Ejecutiva y disponibilidad','statePt':'24 notas; Secretaria Executiva e disponibilidade'},
    {'es':'compatibilidad_transversal_lote_03_2026_es.md','pt':'compatibilidad_transversal_lote_03_2026_pt.md','stateEs':'30 notas; competencias y representación','statePt':'30 notas; competências e representação'},
    {'es':'compatibilidad_transversal_lote_02_2026_es.md','pt':'compatibilidad_transversal_lote_02_2026_pt.md','stateEs':'40 referencias a otros dispositivos identificadas','statePt':'40 referências a outros dispositivos identificadas'},
    {'es':'compatibilidad_transversal_lote_01_2026_es.md','pt':'compatibilidad_transversal_lote_01_2026_pt.md','stateEs':'20 notas transversales cotejadas; rastreo de 816 notas','statePt':'20 notas transversais conferidas; rastreio de 816 notas'},
    {'es':'compatibilidad_notas_historicas_2026_es.md','pt':'compatibilidad_notas_historicas_2026_pt.md','stateEs':'8 artículos y 25 notas directas; confirmaciones documentales abiertas','statePt':'8 artigos e 25 notas diretas; confirmações documentais abertas'},
    {'es':'suplemento_normativo_2026_es.md','pt':'suplemento_normativo_2026_pt.md','stateEs':'398 decisiones; efectos y límites consolidados','statePt':'398 decisões; efeitos e limites consolidados'},
    {'es':'revision_editorial_consolidacion_2026_es.md','pt':'revision_editorial_consolidacion_2026_pt.md','stateEs':'Control editorial e incidencias pendientes','statePt':'Controle editorial e incidências pendentes'},
    {'es':'lista_trabajo_manual_presbiteriano.md','pt':'lista_trabalho_manual_presbiteriano_pt.md','stateEs':'Seguimiento actualizado','statePt':'Acompanhamento atualizado'},
    {'es':'revision_manual_2025_es.md','pt':'revision_manual_2025_pt.md','stateEs':'Informe del cotejo y sus límites','statePt':'Relatório do cotejo e seus limites'},
    {'es':'estado_bilingue_es.md','pt':'estado_bilingue_pt.md','stateEs':'Catálogo de documentos y estado','statePt':'Catálogo de documentos e situação'}])
for lang in ['es', 'pt']:
    es = lang == 'es'
    text = '# '+('Estado de los documentos bilingües' if es else 'Situação dos documentos bilíngues')+' — 14 de octubre / outubro de 2026\n\n'
    text += ('1774/1774 registros del inventario del Manual cotejados. El anexo tiene 560/560 páginas cotejadas; 0 pendientes; Digesto español: 398/398 traducidas y cotejadas; integración parcial: seis enmiendas y revocación RI-CE; efectos examinados 398/398. Cada material de la tabla dispone de un archivo Markdown en cada idioma. La existencia del archivo no significa que esté traducido o revisado por completo: se indica el estado de cada par.\n\n' if es else
             '1774/1774 registros do inventário do Manual conferidos. O anexo tem 560/560 páginas conferidas; 0 pendentes; Digesto espanhol: 398/398 traduzidas e conferidas; integração parcial: seis emendas e revogação RI-CE; efeitos examinados 398/398. Cada material da tabela dispõe de um arquivo Markdown em cada idioma. A existência do arquivo não significa tradução ou revisão completa: a situação de cada par está indicada.\n\n')
    text += '| '+('Archivo español | Archivo portugués | Estado' if es else 'Arquivo espanhol | Arquivo português | Situação')+' |\n| --- | --- | --- |\n'
    for pair in pairs:
        text += f'| [{pair["es"]}]({pair["es"]}) | [{pair["pt"]}]({pair["pt"]}) | {pair["stateEs" if es else "statePt"]} |\n'
    text += '\n'+('Clasificación del rastreo concluida: 142/142 candidatas, 0 pendientes. Siguiente: las confirmaciones documentales seleccionadas, en pendientes_confirmacion_documental_2026_es.md. Compatibilidad directa revisada: 8 artículos y 25 notas. Suplemento consolidado: 398/398 decisiones; revisión editorial definitiva pendiente. Véase la lista de trabajo. Traducción no oficial, sin certificación externa; Manual completo aún no aprobado como fuente definitiva.\n' if es else
                    'Classificação do rastreio concluída: 142/142 candidatas, 0 pendentes. Próximo passo: as confirmações documentais selecionadas, em pendientes_confirmacion_documental_2026_pt.md. Compatibilidade direta conferida: 8 artigos e 25 notas. Suplemento consolidado: 398/398; aprovação editorial definitiva pendente. Consulte a lista de trabalho. Tradução não oficial, sem certificação externa; Manual completo ainda não aprovado como fonte definitiva.\n')
    (d / ('estado_bilingue_'+lang+'.md')).write_text(text)
for pair in pairs:
    for lang in ['es', 'pt']:
        assert pair[lang].endswith('.md') and (d / pair[lang]).is_file(), pair[lang]
        shutil.copyfile(d / pair[lang], root / 'static/documentos' / pair[lang])
manifest['editorialConsolidationProgress'] = c['metadata']['editorialConsolidationProgress']
manifest['historicalCompatibilityProgress'] = c['metadata']['historicalCompatibilityProgress']
manifest['documentaryConfirmationProgress'] = c['metadata']['documentaryConfirmationProgress']
manifest['crossHistoricalCompatibilityProgress'] = c['metadata']['crossHistoricalCompatibilityProgress']
manifest['bilingualMarkdownDocuments'] = pairs
(d / 'estado_bilingue.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
shutil.copyfile(d / 'estado_bilingue.json', root / 'static/documentos/estado_bilingue.json')
c['metadata']['bilingualMarkdownDocuments'] = pairs
(root / 'static/corpus.json').write_text(json.dumps(c, ensure_ascii=False))
print(f'Catálogo bilingüe: {len(pairs)} pares; {2*len(pairs)} documentos Markdown verificados.')
