# Consulta Presbiteriana — início e situação do sistema

Atualizado: 14 de outubro de 2026. Edição de trabalho não oficial.

**O sistema está preparado para consultas locais.** As confirmações documentais restantes não impedem consultar os textos com suas ressalvas. Confirmações, revisão editorial final e aprovação competente permanecem pendentes para a edição definitiva.

## Abrir no Windows

1. Baixar `consulta_presbiteriana.zip` e extrair todo o conteúdo. Não executar os arquivos dentro do ZIP.
2. Ter Node.js instalado. O projeto de desenvolvimento requer Node.js 22.12 ou posterior compatível com suas dependências.
3. Abrir `Iniciar_Consulta.cmd` com duplo clique.
4. O navegador abre em `http://127.0.0.1:4173/`. Se não abrir, copiar o endereço para o navegador.
5. Manter aberta a janela do servidor durante o uso. Ctrl+C encerra o servidor.

O pacote contém a compilação, os documentos e os PDF. Consultar não exige instalar dependências npm, executar Python, entrar em uma conta ou fornecer chaves. Com Node.js instalado e os arquivos extraídos, os dados são servidos pela própria máquina. No Mac/Linux: abrir terminal na pasta extraída e executar `sh Iniciar_Consulta.sh`.

Se a porta estiver ocupada, fechar outra instância ou executar `node scripts/serve_local.mjs --port 4174 --open`. Não abrir diretamente `build/index.html`: os arquivos são carregados pelo servidor local.

## Consultar

- Buscar «membros» ou «membresía»: o índice usa ambos os idiomas.
- Para um dispositivo, buscar «Artigo 84» e filtrar **CI**. Números iguais podem pertencer a normas distintas.
- Selecionar separadamente idioma de interface e de leitura.
- Ativar leitura integrada para alterações expressas e anotações; comparar com o texto histórico quando disponível.
- Abrir um resultado para ler notas, decisões, páginas PDF e limites documentais.
- Baixar a consulta em Markdown. Copiar depende da permissão do navegador; baixar oferece outra forma de guardar.

É um buscador documental bilingue com vínculos e exportações, não um chat generativo. Perguntas longas podem exigir buscar pelo tema ou artigo.

## Busca durante a digitação e palavras destacadas

**Todas as palavras** é a opção padrão. Digitar, por exemplo, «carta de transf»: os resultados aparecem sem pressionar Consultar, e a última palavra pode estar incompleta. Acrescentar palavras exige que estejam no mesmo artigo, nota ou decisão, em uma mesma versão do texto. Palavras gramaticais comuns são omitidas.

A ordem é: palavras juntas, mesma oração e partes distintas do mesmo artigo. As ocorrências aparecem destacadas em amarelo nos resultados e na leitura do artigo, textos históricos, emendas e referências abertas. O destaque ignora maiúsculas e acentos sem alterar o texto. Ocorrências só em português são identificadas e abrem o texto correspondente.

Sugestões vêm dos documentos encontrados: escolher com clique ou setas e Enter. Escape fecha a lista. **Palavras completas** desativa o prefixo da última palavra. Aspas exigem uma frase exata: «"carta de transferência"».

**Precisa por assunto** explora conceitos e equivalências bilingues mesmo sem as mesmas palavras da consulta. **Ampliada** conserva a exploração geral. Notas e decisões vinculadas continuam disponíveis. Nenhum modo garante detectar todas as relações implícitas.

## Situação e pendências

| Parte | Situação |
| --- | --- |
| Manual 2025 | 1774/1774 registros e 560/560 páginas conferidos pelo assistente |
| Digesto 2026 | 398/398 decisões traduzidas, conferidas e examinadas quanto aos efeitos |
| Rastreio transversal | 142/142 candidatas classificadas; 0 pendentes dessa classificação |
| Código | 186 testes passaram no encerramento anterior; a entrega operacional repete as verificações pertinentes |
| Arranque e arquivos | Verificação HTTP do servidor, corpus, recursos iniciais, downloads e PDF |
| Navegador e dispositivos | Pendentes inspeção visual, busca e leitura na sua máquina e no celular; permissões reais de copiar e baixar |
| Internet | Se desejar compartilhar por link, escolher hospedagem, publicar e testar a versão publicada |
| Documentação | Sete grupos examinados: dois encerrados no alcance e cinco pendentes; não são inventário exaustivo de dúvidas |
| Edição definitiva | Harmonização editorial final, compatibilidade global e aprovação competente pendentes |

Os sete grupos tratam voto do ministro jubilado, adaptação de estatutos locais, notas de emerência, proposta integral dos regimentos de seminários, base do RI-SE, estatutos institucionais e divergências documentais. Fontes e critérios constam em `pendientes_confirmacion_documental_2026_pt.md`. Parte exige documentos adicionais ou interpretação competente; verificações informáticas não resolvem essas questões.

## Compartilhar

O servidor só atende na própria máquina. `127.0.0.1` não dá acesso a outro celular ou computador. Para compartilhar por link, publicar a pasta compilada `build/` em hospedagem estática e verificar consultas, documentos e PDF. Hospedagem em subpasta exige configurar o caminho e recompilar.

O projeto SvelteKit conserva as fontes; o pacote pronto conserva a compilação desta entrega. Alterações futuras exigem regeneração quando aplicável, testes e nova compilação. Aprovação oficial não é requisito técnico para iniciar o buscador, mas seu caráter de edição de trabalho deve continuar visível enquanto não houver aprovação.
