export const normalize = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export const topics = {
  membresía:['membresia','membro','membros','comungante','comungantes','comunhao','rol','admissao','demissao','transferencia','profissao de fe','batismo','jurisdicao'],
  miembros:['miembro','miembros','membro','membros','comungante','comungantes','rol'],
  bautismo:['bautismo','batismo','batizar','batizados'],
  actas:['acta','actas','ata','atas','lavratura','confeccao','registro','secretario'],
  disciplina:['disciplina','disciplinar','penalidade','penalidades','tribunal','tribunais','restauracao','processo','deposicao','afastamento'],
  elección:['eleccion','elecciones','eleicao','eleicoes','reeleicao','reeleito','mandato','candidato','candidatura','candidaturas'],
  consejo:['consejo','conselho','conselhos'],
  pastor:['pastor','pastores','pastorado','pastoreio','ministro','ministros','emerito','jubilacao'],
  diáconos:['diacono','diaconos','diaconal','diaconato','disponibilidade'],
  presbíteros:['presbitero','presbiteros','presbiterato'],
  recursos:['recurso','recursos','apelacao','prazo','prazos','impugnado'],
  asamblea:['asamblea','assembleia','assembleias','presidencia','presidir'],
  mujeres:['mujer','mujeres','mulher','mulheres','feminino','feminina'],
  cena:['cena','ceia','vinho','pao','comunhao'],
  finanzas:['finanzas','financeiro','financeira','tesoureiro','tesouraria','dizimo','dizimos','oferta','ofertas','patrimonio','orcamento'],
  emérito:['emerito','emeritos','jubilacao','jubilado','aposentadoria'],
  misiones:['misiones','missao','missoes','missionario','missionaria','evangelizacao','plantacao'],
  reforma:['reforma','emenda','emendas','promulgar','alteracao','revogar','regulamento','regimento'],
  niños:['nino','ninos','crianca','criancas','infancia','menor','menores'],
  adolescentes:['adolescente','adolescentes','upa','mocidade','jovens']
};
const STOP = new Set(['de','del','la','las','el','los','sobre','que','en','un','una','todos','todo','habla','hablan','acerca','por','para','y','o','e','a','do','da','dos','das','como','cual','cuales','quien','donde','es','son','se','me','quiero','saber','necesito','quero','qual','quais','ao','na','nas','nos','um','uma','os','as','em','funciona']);

export function effectsFor(record,corpus){return (corpus.normativeEffects||[]).filter(e=>e.source===record.id||e.targets.includes(record.id));}

// These contexts identify document sections and links; they do not change normative text.
const conceptFamilies=[
 ['membresia','membresias','membresia','miembro','miembros','membro','membros','comulgante','comulgantes','comungante','comungantes'],
 ['iglesia','iglesias','igreja','igrejas'],['local','locales','locais'],
 ['admision','admisiones','admissao','admissoes','recepcion','recepcao','admitir','recibir','receber'],
 ['transferencia','transferencias','transferir'],['bautismo','bautismos','batismo','batismos','bautizar','batizar'],
 ['acta','actas','ata','atas'],['reunion','reuniones','reuniao','reunioes'],
 ['consejo','consejos','conselho','conselhos'],['nino','ninos','crianca','criancas','menor','menores'],
 ['pastor','pastores'],['jubilado','jubilados','jubilacao','jubilacion'],
 ['presbitero','presbiteros'],['diacono','diaconos'],['plazo','plazos','prazo','prazos'],
 ['recurso','recursos','apelacion','apelacao'],['eleccion','elecciones','eleicao','eleicoes'],
 ['derecho','derechos','direito','direitos'],['obligacion','obligaciones','deber','deberes','dever','deveres'],
 ['registro','registros','registrar'],['solicitud','solicitudes','pedido','pedidos','solicitacao','solicitacoes']
];
const churchMembership=['membresia','miembros de la iglesia','membros da igreja','miembro de la iglesia','membro da igreja','miembros de una iglesia','membros de uma igreja','miembros de esta iglesia','membros desta igreja','miembros comulgantes','membros comungantes','miembros no comulgantes','membros nao comungantes','miembro comulgante','membro comungante','admision de miembros','admissao de membros','recepcion de miembros','recepcao de membros','registro de miembros','rol de membros','carta de transferencia','profesion de fe','profissao de fe'];
const localChurch=['iglesia local','iglesias locales','igreja local','igrejas locais','iglesia de la localidad','igreja da localidade','congregacion','congregaciones','congregacao','congregacoes'];
const hasTerm=(hay,term)=>new RegExp('(?:^| )'+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?: |$)').test(hay);
function ownContext(r){
 if(r.norm==='PL')return 'iglesia local igreja local';
 if(r.norm==='EST-IG')return 'iglesia local igreja local'+(r.kind==='articulo'&&r.article>=5&&r.article<=15?' membresia':'');
 if(r.norm==='CI'&&r.kind==='articulo'&&r.article>=11&&r.article<=24)return 'membresia miembros membros iglesia local igreja local';
 return '';
}
export function createIndex(corpus) {
 const amendments = new Map(corpus.amendments.map(a=>[a.id,a]));
 const noteContexts=new Map();
 for(const r of corpus.records){const context=ownContext(r);if(context)for(const id of r.notes||[])noteContexts.set(id,[noteContexts.get(id)||'',context].join(' '));}
 return corpus.records.map(r=>{
  const scope=normalize([ownContext(r),noteContexts.get(r.id)||''].join(' '));
  const bodyEs=r.textEs||'';const bodyPt=r.textOriginal||'';
  return {...r,_scope:scope,_bodies:[bodyEs,bodyPt,r.integratedTextEs||'',r.integratedTextPt||''].filter(Boolean).map(body=>({body,normalized:normalize(body)})),_search:normalize([r.title,bodyPt,bodyEs,r.integratedTextPt,r.integratedTextEs,r.summaryEs,r.status,...effectsFor(r,corpus).flatMap(e=>[e.noteEs,e.notePt,e.limitsEs,e.limitsPt]),...(r.links||[]).flatMap(id=>[amendments.get(id)?.textEs||'',amendments.get(id)?.textPt||''])].filter(Boolean).join(' '))};
 });
}
function nearbyMatch(body,groups,scope='',avoidStatistics=false){
 const normalized=typeof body==='string'?normalize(body):body.normalized;
 if(groups.some(group=>!group.some(term=>hasTerm(normalized,term))&&!group.some(term=>hasTerm(scope,term))))return null;
 const words=normalized.split(' ');const hits=groups.map(group=>{
  const scoped=group===churchMembership&&hasTerm(scope,'membresia')?[...group,'miembro','miembros','membro','membros']:group;
  const found=[];for(const term of scoped){const terms=term.split(' ');for(let i=0;i<=words.length-terms.length;i++)if(terms.every((t,j)=>words[i+j]===t))found.push({position:i,term});}
  return found;
 });
 const active=hits.map((h,i)=>({h,i})).filter(x=>x.h.length);
 if(hits.some((h,i)=>!h.length&&!groups[i].some(t=>hasTerm(scope,t))))return null;
 // Context may fill a missing group, but a body occurrence is still required.
 if(!active.length)return null;
 const events=active.flatMap(({h,i})=>h.map(x=>({...x,group:i}))).sort((a,b)=>a.position-b.position);
 const counts=new Map();let left=0,best=null;
 for(let right=0;right<events.length;right++){
  counts.set(events[right].group,(counts.get(events[right].group)||0)+1);
  while(counts.size===active.length){
   const span=events[right].position-events[left].position;
   const window=words.slice(Math.max(0,events[left].position-25),events[right].position+40);
   const inventory=avoidStatistics&&window.filter(w=>/^\d+$/.test(w)).length>=4&&['pastores','presbiteros','diaconos','alumnos','alunos','evangelistas','misioneros','missionarios','congregaciones','congregacoes'].filter(w=>window.includes(w)).length>=2;
   if(!inventory&&(!best||span<best.span))best={span,start:events[left].position,end:events[right].position,terms:[...new Set(events.slice(left,right+1).map(x=>x.term))]};
   const g=events[left++].group;counts.set(g,counts.get(g)-1);if(!counts.get(g))counts.delete(g);
  }
 }
 if(!best||best.span>60)return null;
 return {...best,bodyGroups:active.length,contextGroups:groups.length-active.length};
}
function excerpt(body,match){
 if(!body||!match)return body?.slice(0,280)||'';
 const raw=[...body.matchAll(/\S+/g)];const offsets=[];
 for(const token of raw)for(const word of normalize(token[0]).split(' ').filter(Boolean))offsets.push({start:token.index,end:token.index+token[0].length});
 const start=offsets[Math.max(0,match.start-14)]?.start||0;const end=offsets[Math.min(offsets.length-1,match.end+35)]?.end||body.length;
 return (start?'… ':'')+body.slice(start,end);
}

function queryWords(query){
 const article=/\bart(?:iculo|igo)?\s*(\d+)\b/.exec(normalize(query));
 const cleaned=normalize(query).replace(/\bart(?:iculo|igo)?\s*\d+\b/g,'');
 return {article:article?Number(article[1]):null,tokens:[...new Set(cleaned.split(' ').filter(t=>t&&!STOP.has(t)))],phrases:[...query.matchAll(/"([^"\n]+)"/g)].map(m=>normalize(m[1]))};
}
function wordPassage(entry,tokens,{prefixLast,query,phrases}){
 const body=entry.normalized;
 if(phrases.some(p=>!hasTerm(body,p)))return null;
 const last=tokens.length-1;
 if(tokens.some((t,i)=>!(prefixLast&&i===last?new RegExp('(?:^| )'+t+'[a-z0-9]*(?: |$)').test(body):hasTerm(body,t))))return null;
 const words=entry.words||(entry.words=body.split(' '));
 const events=[];
 for(let position=0;position<words.length;position++)for(let group=0;group<tokens.length;group++)if(prefixLast&&group===last?words[position].startsWith(tokens[group]):words[position]===tokens[group])events.push({position,group});
 let left=0,best=null;const counts=new Map();
 for(let right=0;right<events.length;right++){
  const g=events[right].group;counts.set(g,(counts.get(g)||0)+1);
  while(counts.size===tokens.length){
   const span=events[right].position-events[left].position;
   if(!best||span<best.span)best={start:events[left].position,end:events[right].position,span};
   const first=events[left++].group;counts.set(first,counts.get(first)-1);if(!counts.get(first))counts.delete(first);
  }
 }
 if(tokens.length&&!best)return null;
 best=best||{start:0,end:0,span:0};
 const phrase=normalize(query.replace(/"/g,''));
 const exact=phrase&&(prefixLast?new RegExp('(?:^| )'+phrase+'[a-z0-9]*(?: |$)').test(body):hasTerm(body,phrase));
 const inSentence=exact||entry.body.split(/[.!?;\n]+/).some(sentence=>{
  const hay=normalize(sentence);return tokens.every((t,i)=>prefixLast&&i===last?new RegExp('(?:^| )'+t+'[a-z0-9]*(?: |$)').test(hay):hasTerm(hay,t));
 });
 return {...best,tier:exact?'phrase':inSentence?'sentence':'article',score:(exact?3000:inSentence?2000:1000)+120/(1+best.span)};
}
function wordSearch(index,query,{norm='',kind='',status='',literal=false,prefixLast=true,language='es'}={}){
 const plan=queryWords(query);if(!plan.tokens.length&&plan.article===null&&!plan.phrases.length)return [];
 let inlineNorm='';
 if(plan.article!==null){const i=plan.tokens.findIndex(t=>index.some(r=>normalize(r.norm)===t));if(i>=0)inlineNorm=plan.tokens.splice(i,1)[0];}
 const partial=prefixLast&&!literal&&!query.includes('"')&&!/\s$/.test(query);
 return index.flatMap(r=>{
  if(norm&&r.norm!==norm||kind&&r.kind!==kind||status&&r.status!==status||inlineNorm&&normalize(r.norm)!==inlineNorm)return [];
  if(plan.article!==null&&(r.kind!=='articulo'||r.article!==plan.article))return [];
  const matches=(r._bodies||[]).map(entry=>wordPassage(entry,plan.tokens,{prefixLast:partial,query,phrases:plan.phrases}));
  let best=null;for(const match of matches)if(match&&(!best||match.score>best.score))best=match;
  if(!best)return [];
  const esIndex=(r._bodies||[]).findIndex(p=>p.body===r.textEs),ptIndex=(r._bodies||[]).findIndex(p=>p.body===r.textOriginal);
  return [{...r,score:best.score+(matches[language==='pt'?ptIndex:esIndex]?40:0)+(r.kind==='articulo'?20:r.kind==='pagina'?-20:0),matchTier:best.tier,matchedLanguages:[...(matches[esIndex]?['es']:[]),...(matches[ptIndex]?['pt']:[])],matchLanguage:matches[language==='pt'?ptIndex:esIndex]?language:matches[esIndex]?'es':'pt',matchContext:'direct',matchedTerms:plan.tokens,matchExcerptEs:excerpt(r.textEs,matches[esIndex]),matchExcerptPt:excerpt(r.textOriginal,matches[ptIndex])}];
 }).sort((a,b)=>b.score-a.score||a.norm.localeCompare(b.norm)||(a.article||a.page)-(b.article||b.page));
}
// Return text segments, never HTML; rendering preserves the source and escapes markup.
export function highlightParts(text='',query='',{prefixLast=true}={}){
 const tokens=[...new Set(normalize(query).split(' ').filter(t=>t&&!STOP.has(t)))];
 if(!tokens.length)return [{text,match:false}];
 const partial=prefixLast&&!query.includes('"')&&!/\s$/.test(query),ranges=[];
 for(const word of text.matchAll(/[\p{L}\p{M}\p{N}]+/gu)){
  const normalized=normalize(word[0]);if(tokens.some((t,i)=>partial&&i===tokens.length-1?normalized.startsWith(t):normalized===t))ranges.push({start:word.index,end:word.index+word[0].length});
 }
 if(!ranges.length)return [{text,match:false}];
 const parts=[];let cursor=0;for(const range of ranges){if(range.start>cursor)parts.push({text:text.slice(cursor,range.start),match:false});parts.push({text:text.slice(range.start,range.end),match:true});cursor=range.end;}
 if(cursor<text.length)parts.push({text:text.slice(cursor),match:false});return parts;
}
export function suggestQueries(query,results,{language='es',limit=6}={}){
 if(query.includes('"'))return [];
 const normalized=normalize(query);const wanted=normalized.split(' ').filter(Boolean);if(!wanted.length)return [];
 const found=new Map();const input=query.trim();
 for(const r of results.slice(0,20))for(const body of [language==='pt'?r.textOriginal:r.textEs,language==='pt'?r.textEs:r.textOriginal].filter(Boolean)){
  const words=[...body.matchAll(/[\p{L}\p{M}\p{N}]+/gu)];
  for(let start=0;start<=words.length-wanted.length;start++){
   if(!wanted.every((t,i)=>i===wanted.length-1?normalize(words[start+i][0]).startsWith(t):normalize(words[start+i][0])===t))continue;
   const last=words[start+wanted.length-1];let suggestion;
   if(normalize(last[0])!==wanted.at(-1))suggestion=input.replace(/[\p{L}\p{M}\p{N}]+$/u,last[0]);
   else if(words[start+wanted.length])suggestion=input+' '+words[start+wanted.length][0];
   if(suggestion&&normalize(suggestion)!==normalized&&!found.has(normalize(suggestion)))found.set(normalize(suggestion),suggestion);
   if(found.size>=limit)return [...found.values()];
  }
 }
 return [...found.values()];
}

export function search(index,query,{norm='',kind='',status='',literal=false,mode='precise',prefixLast=true,language='es'}={}) {
 if(mode==='words')return wordSearch(index,query,{norm,kind,status,literal,prefixLast,language});
 const q=normalize(query);if(!q)return [];
 const articleMatch = /\bart(?:iculo|igo)?\s*(\d+)\b/.exec(q);
 const digits=articleMatch?Number(articleMatch[1]):null;
 const phrases=[...query.matchAll(/"([^"\n]+)"/g)].map(m=>normalize(m[1]));
 const tokens=q.replace(/\bart(?:iculo|igo)?\s*\d+\b/g,'').split(' ').filter(t=>t&&!STOP.has(t));
 const topicEntries=Object.entries(topics).map(([key,words])=>[normalize(key),words.map(normalize)]);
 const precise=mode!=='expanded'&&!literal&&tokens.length>1&&!phrases.length;
 let groups;
 if(precise){
  groups=[];const church=tokens.some(t=>conceptFamilies[1].includes(t)),local=tokens.some(t=>conceptFamilies[2].includes(t));
  if(church&&local)groups.push(localChurch);
  for(const token of tokens){if(church&&local&&(conceptFamilies[1].includes(token)||conceptFamilies[2].includes(token)))continue;groups.push(church&&local&&conceptFamilies[0].includes(token)?churchMembership:conceptFamilies.find(f=>f.includes(token))||[token]);}
 }else groups=tokens.map(t=>literal?[t]:(topicEntries.find(([key,words])=>t===key||words.includes(t))?.[1]||conceptFamilies.find(f=>f.includes(t))||[t]));
 groups=[...new Map(groups.map(g=>[g.join('|'),g])).values()];
 return index.filter(r=>!norm||r.norm===norm).filter(r=>!kind||r.kind===kind).filter(r=>!status||r.status===status).flatMap(r=>{
  if(digits!==null&&(r.kind!=='articulo'||r.article!==digits))return [];
  if(phrases.some(phrase=>!hasTerm(r._search,phrase)))return [];
  if(!groups.length&&digits===null&&!phrases.length)return [];
  if(precise&&!kind&&!norm&&r.kind==='pagina')return []; // Duplicate page annex remains available through its filter or expanded search.
  let score=0,reasons=[],best=null,bodyMatches=[];
  if(precise){
   bodyMatches=(r._bodies||[]).map(body=>nearbyMatch(body,groups,r._scope,groups.includes(churchMembership)));
   for(const match of bodyMatches)if(match&&(!best||match.bodyGroups>best.bodyGroups||(match.bodyGroups===best.bodyGroups&&match.span<best.span)))best=match;
   if(!best)return [];
   score=best.bodyGroups*24-best.contextGroups*4+(60-best.span)/6;reasons=best.terms;
   // Section context contributes recall without letting long unrelated records dominate.
   if(groups.includes(churchMembership)&&hasTerm(r._scope,'membresia'))score+=45;
   if(r.norm==='EST-IG'&&groups.some(g=>g===localChurch))score+=14;
   if(r.norm==='CI'&&r.article>=11&&r.article<=24&&groups.some(g=>g===localChurch))score+=12;
  }else{
   for(const group of groups){const matched=group.filter(t=>hasTerm(r._search,t));if(!matched.length)return [];reasons.push(...matched);score+=4;}
   if(hasTerm(r._search,q))score+=12;
  }
  if(r.kind==='articulo')score+=precise?28:8;
  if(precise&&groups.includes(churchMembership)&&/\b(son miembros|sao membros)\b/.test(normalize((r.textEs||r.textOriginal||'').slice(0,180))))score+=72;if(r.kind==='pagina')score-=12;
  const esIndex=(r._bodies||[]).findIndex(p=>p.body===r.textEs),ptIndex=(r._bodies||[]).findIndex(p=>p.body===r.textOriginal);
  const esMatch=precise?bodyMatches[esIndex]:null,ptMatch=precise?bodyMatches[ptIndex]:null;
  return [{...r,score,matchedTerms:[...new Set(reasons)],matchContext:best?.contextGroups?'document-context':'direct',matchExcerptEs:excerpt(r.textEs,esMatch),matchExcerptPt:excerpt(r.textOriginal,ptMatch)}];
 }).sort((a,b)=>b.score-a.score||a.norm.localeCompare(b.norm)||(a.article||a.page)-(b.article||b.page));
}

export function related(record,corpus){
 const ids=new Set([...(record.notes||[]),...(record.links||[]),...(record.linkedArticles||[])]);
 for(const a of corpus.amendments)if(a.target===record.id)ids.add(a.source);
 return corpus.records.filter(r=>ids.has(r.id));
}
export function confirmationsFor(record,corpus){
 return (corpus.documentaryConfirmations||[]).filter(item=>['open','partially-resolved'].includes(item.status)&&item.sources.some(source=>source.id===record.id));
}
function confirmationSections(record,corpus,language='es'){
 const pt=language==='pt';
 return confirmationsFor(record,corpus).map(item=>`### ${pt?'Confirmação documental pendente':'Confirmación documental pendiente'} — ${item.id}\n\n${pt?item.titlePt:item.titleEs}\n\n${pt?item.findingPt:item.findingEs}\n\n${pt?'Anotação editorial separada do texto normativo.':'Apunte editorial separado del texto normativo.'}`);
}
export function makeAnswer(query,results,corpus,options={}){
 if(options.language)return makeBilingualAnswer(query,results,corpus,options);
 const parts=[`# Consulta: ${query}`,`Resultados: ${results.length}.\n\nEdición de trabajo no oficial. Se citan textos documentales; la traducción y el cotejo textual del Digesto están completos (398/398); la revisión editorial final sigue pendiente. Las notas históricas no se dan por vigentes sin contrastar las resoluciones posteriores.`];
 const lookup=new Map(corpus.records.map(r=>[r.id,r]));
 for(const r of results){
  parts.push(`## ${r.title}\n\nID: ${r.id}. Estado: ${r.status}. Página PDF: ${r.page}.\n\n### Texto original portugués\n\n${r.textOriginal}`);
  parts.push(...confirmationSections(r,corpus));
  if(r.historicalCompatibilityReview)parts.push('### Compatibilidad histórica\n\n'+r.historicalCompatibilityReview.findingEs);
  if(r.crossReferenceClassification)parts.push('### Referencia identificada\n\n'+r.crossReferenceClassification.resolvedBodyEs+'\n\n'+r.crossReferenceClassification.findingEs);
  if(r.crossHistoricalCompatibilityReview)parts.push('### Cotejo transversal\n\n'+r.crossHistoricalCompatibilityReview.findingEs);
  for(const nid of r.crossCompatibilityNoteIds||[])parts.push('### Advertencia transversal — '+nid+'\n\n'+lookup.get(nid).crossHistoricalCompatibilityReview.findingEs);
  for(const e of effectsFor(r,corpus))parts.push('### Efecto documentado 2026 — '+e.source+'\n\n'+e.noteEs+'\n\n'+e.limitsEs);
  if(r.textEs)parts.push('### Traducción de trabajo\n\n'+r.textEs);
  for(const a of corpus.amendments.filter(a=>a.target===r.id))parts.push(`### EC ${a.ec} — ${a.source}\n\nAlcance: ${a.scope}.\n\n${a.textEs}`);
  for(const nid of r.notes||[]){const n=lookup.get(nid);if(n){parts.push(`### ${n.title} — original portugués\n\n${n.textOriginal}`);if(n.historicalCompatibilityReview)parts.push('### Compatibilidad histórica — '+n.id+'\n\n'+n.historicalCompatibilityReview.findingEs);}}
  const links=related(r,corpus).filter(x=>x.kind==='resolucion');
  for(const link of links)parts.push(`### Resolución relacionada: ${link.title}\n\n${link.summaryEs||''}\n\nEstado: ${link.status}. Página PDF: ${link.page}.\n\n${link.textOriginal}`);
 }
 return parts.join('\n\n');
}

// A missing Spanish translation remains visible; never label Portuguese as Spanish.
export function reading(record,language='es',integrated=false){
 const key=integrated?(language==='pt'?'integratedTextPt':'integratedTextEs'):(language==='pt'?'textOriginal':'textEs');
 const text=record[key]||(language==='pt'?record.textOriginal:record.textEs);
 return {comparativeReviewCompleteForUnit:!!record.translationReview&&!((integrated&&record[key])),approvedAsDefinitiveSpanishSource:false,semanticReview:record.translationReview?.reviewStatus||'pendiente',text:text||record.textOriginal,language:text?language:'pt',pending:language==='es'&&!text,integrated:!!(integrated&&record[key])};
}
export function makeBilingualAnswer(query,results,corpus,{language='es',integrated=false}={}){
 const pt=language==='pt';const progress=corpus.metadata.normativeIntegrationProgress;const parts=[`# ${pt?'Consulta':'Consulta'}: ${query}`,`${pt?'Resultados':'Resultados'}: ${results.length}.\n\n${pt?'Edição de trabalho não oficial. Integração parcial.':`Edición de trabajo no oficial. Integración parcial. Manual: NO APROBADO COMO FUENTE DEFINITIVA. Constitución histórica: 152 artículos y 361 notas cotejados. Código de Disciplina histórico: 135 artículos y 104 notas cotejados. Principios de Liturgia: 44 artículos y 59 notas cotejados. Estatuto IPB: 47 bloques de artículos y 15 notas cotejados. Reglamento del Supremo Concilio: 82 artículos y 3 notas cotejados. Reglamento de la Comisión Ejecutiva: 37 artículos y 3 notas cotejados. Modelo de Estatuto del Sínodo: 31 artículos y 9 notas cotejados. Modelo de Reglamento Interno del Sínodo: 96 artículos y 2 notas cotejados. Modelo de Estatuto del Presbiterio: 62 artículos y 135 notas cotejados. Modelo de Reglamento Interno del Presbiterio: 99 artículos y 2 notas cotejados. Modelo de Estatuto de la Iglesia: 57 artículos y 116 notas cotejados. Reglamento Interno de la Junta Diaconal: 34 artículos y una nota cotejados. Reglamento de Actas: 24 artículos y seis notas cotejados. Preliminares, separadores, sumario e índices: 58/58 páginas cotejadas. Inventario: 1774/1774 registros cotejados. Anexo: 560/560 páginas cotejadas; 0 pendientes. Digesto: ${corpus.metadata.digestoReviewProgress.reviewComplete?'398/398 decisiones traducidas y cotejadas; revisión editorial final pendiente.':'traducción parcial; los textos pendientes se muestran en portugués y están identificados.'}`}`];
 if(progress)parts.push(`${pt?'Efeitos examinados':'Efectos examinados'}: ${progress.reviewedDecisions}/${progress.totalDecisions}. ${pt?'Aprovação editorial definitiva pendente.':'Revisión editorial definitiva pendiente.'}`);
 const emitted=new Set();
 function section(r,level=2){
  if(emitted.has(r.id))return;emitted.add(r.id);
  const v=reading(r,language,integrated);
  parts.push(`${'#'.repeat(level)} ${r.title}\n\nID: ${r.id}. ${pt?'Situação':'Estado'}: ${r.status}. PDF: ${r.page}.\n\n${v.pending?'**Traducción pendiente — original portugués.**\n\n':''}${!pt&&v.comparativeReviewCompleteForUnit?(r.source==='digesto'?'**Decisión del Digesto 2026 cotejada con el original portugués por el asistente.**\n\n':'**Texto histórico 2025 cotejado con el original portugués por el asistente.**\n\n'):''}${!pt&&r.translationStatus==='automatica-sin-revision'?'**Traducción automática — revisión lingüística pendiente.**\n\n':''}${v.integrated?(pt?'**Redação integrada parcial.**':'**Redacción integrada parcial.**')+'\n\n':''}${v.text}`);
  parts.push(...confirmationSections(r,corpus,language));
  if(r.historicalCompatibilityReview)parts.push(`### ${pt?'Compatibilidade histórica':'Compatibilidad histórica'}\n\n${pt?r.historicalCompatibilityReview.findingPt:r.historicalCompatibilityReview.findingEs}`);
  if(r.crossReferenceClassification)parts.push(`### ${pt?'Referência identificada':'Referencia identificada'}\n\n${pt?r.crossReferenceClassification.resolvedBodyPt:r.crossReferenceClassification.resolvedBodyEs}\n\n${pt?r.crossReferenceClassification.findingPt:r.crossReferenceClassification.findingEs}`);
  if(r.crossHistoricalCompatibilityReview)parts.push(`### Cotejo transversal\n\n${pt?r.crossHistoricalCompatibilityReview.findingPt:r.crossHistoricalCompatibilityReview.findingEs}`);
  for(const nid of r.crossCompatibilityNoteIds||[]){const review=corpus.records.find(n=>n.id===nid).crossHistoricalCompatibilityReview;parts.push(`### ${pt?'Advertência transversal':'Advertencia transversal'} — ${nid}\n\n${pt?review.findingPt:review.findingEs}`);}
  for(const e of effectsFor(r,corpus))parts.push(`### ${pt?'Efeito documentado 2026':'Efecto documentado 2026'} — ${e.source}\n\n${pt?e.notePt:e.noteEs}\n\n${pt?e.limitsPt:e.limitsEs}`);
  for(const a of corpus.amendments.filter(a=>a.target===r.id))parts.push(`### EC ${a.ec} — ${a.source}\n\n${language==='pt'?a.textPt:a.textEs}`);
 }
 for(const r of results){section(r);for(const link of related(r,corpus))section(link,3);}
 return parts.join('\n\n');
}
