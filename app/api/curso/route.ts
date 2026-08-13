import dueHtml from "../../../public/private-courses/due-diligence.html?raw";
import auctionHtml from "../../../public/private-courses/arrematacao.html?raw";
import incorporationHtml from "../../../public/private-courses/incorporacao.html?raw";

const htmlByCourse:Record<string,string>={"due-diligence":dueHtml,arrematacao:auctionHtml,incorporacao:incorporationHtml};
const previewMeta:Record<string,{documentName:string;buttonName:string}>={
  "due-diligence":{documentName:"Relatório de Due Diligence Imobiliária",buttonName:"Meu Relatório"},
  arrematacao:{documentName:"Dossiê de Viabilidade da Arrematação",buttonName:"Meu Dossiê"},
  incorporacao:{documentName:"Dossiê de Organização da Pasta de Incorporação",buttonName:"Meu Dossiê"},
};

function fullSummary(source:string){
  const moduleMatch=source.match(/const MODULES=(\[[^;]+\]);/);
  let modules:string[]=[];
  try{modules=moduleMatch?JSON.parse(moduleMatch[1]):[]}catch{}
  const items=[...source.matchAll(/<section class="screen[^>]*data-module="(\d+)"[^>]*data-title="([^"]*)"/g)].map(match=>({module:Number(match[1]),title:match[2]}));
  let current=-1;
  let html='<div class="preview-summary-note"><b>Sumário para consulta.</b> Na prévia, os títulos não abrem as etapas pagas.</div>';
  items.forEach((item,index)=>{
    if(item.module!==current){current=item.module;html+=`<h3>${modules[current]||`Etapa ${current}`}</h3><ol>`}
    html+=`<li><span>${item.title}</span></li>`;
    if(!items[index+1]||items[index+1].module!==current)html+="</ol>";
  });
  return html;
}

function previewHtml(source:string,slug:string){
  const meta=previewMeta[slug];
  const summary=fullSummary(source);
  const screenPattern=/<section class="screen[^>]*data-title="([^"]*)"[\s\S]*?<\/section>/g;
  const screens=[...source.matchAll(screenPattern)];
  let boundary=screens.findIndex(match=>/capítulos|etapas do curso|mapa do curso/i.test(match[1]));
  if(boundary<0) boundary=screens.findIndex(match=>/ementa/i.test(match[1]));
  if(boundary<0) boundary=Math.min(3,screens.length-1);
  const allowed=new Set(screens.slice(0,boundary+1).map(match=>match[0]));
  const coursePage=`/pessoal/formacao/${slug}#comprar`;
  const returnAction=`event.preventDefault();window.parent.postMessage({type:'course-return',slug:'${slug}'},'*');return false`;
  const lock=`<section class="screen" data-module="0" data-title="Continuação exclusiva"><div class="content"><span class="tag">Fim da prévia</span><h2>Você conheceu as etapas do curso.</h2><p class="lead">Algumas páginas foram omitidas desta visualização. Ao adquirir o curso, você poderá continuar o percurso, preencher o seu caso e construir o documento final.</p><div class="bridge"><b>O modelo vazio de “${meta.documentName}” está disponível no botão “${meta.buttonName}”.</b> Abra-o para conhecer a estrutura do resultado que será construído durante o curso.</div><p style="margin-top:28px"><a href="${coursePage}" target="_parent" onclick="${returnAction}" style="display:inline-block;padding:14px 20px;background:#a45f59;color:#fff;text-decoration:none;font-weight:700">Voltar à página do curso e adquirir →</a></p></div><div class="nav"><button class="prev" data-prev="" type="button">← Voltar à ementa</button></div></section>`;
  let lastAllowed="";
  const reduced=source.replace(screenPattern,whole=>{if(allowed.has(whole)){lastAllowed=whole;return whole}return ""});
  const withLock=lastAllowed?reduced.replace(lastAllowed,lastAllowed+lock):reduced;
  const authorLinksFixed=withLock.replaceAll('href="paula-magalhaes-pessoal.html"','href="/pessoal" target="_top"');
  const onclickIds=[...source.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)\.onclick/g)].map(match=>match[1]);
  const missingIds=[...new Set(onclickIds)].filter(id=>!authorLinksFixed.includes(`id="${id}"`)&&!authorLinksFixed.includes(`id='${id}'`));
  const compatibilityNodes=missingIds.length?`<div hidden aria-hidden="true">${missingIds.map(id=>`<button id="${id}" type="button"></button>`).join("")}</div>`:"";
  const compatible=compatibilityNodes?authorLinksFixed.replace(/<body([^>]*)>/i,`<body$1>${compatibilityNodes}`):authorLinksFixed;
  const previewStyle='<style>#sideReset,[id*="Reset"],[data-action="reset"],.danger{display:none!important}.preview-summary-note{padding:14px;margin-bottom:18px;background:#f7ede8;border-left:3px solid #a45f59}.preview-summary-note+ h3{margin-top:10px}#fullIndex a{pointer-events:none;color:inherit;text-decoration:none}#fullIndex li span{display:block;padding:5px 0}.preview-return{position:fixed;right:14px;bottom:14px;z-index:55;display:inline-block;border:0;background:#171312;color:#fff;padding:11px 14px;cursor:pointer;font-weight:700;text-decoration:none}</style>';
  const dossierBody='<div style="padding:8px 0"><p style="color:#756560">Esta é a estrutura vazia de <b>'+meta.documentName+'</b>, que será construída com as respostas do aluno ao longo do curso.</p><div class="dossier-section"><h4>1. Identificação do caso</h4><p>Imóvel ou empreendimento: <b>não preenchido</b></p><p>Objetivo da análise: <b>não preenchido</b></p></div><div class="dossier-section"><h4>2. Documentos e informações</h4><p>Fontes consultadas, documentos disponíveis e lacunas: <b>não preenchido</b></p></div><div class="dossier-section"><h4>3. Achados e riscos</h4><p>Pontos identificados, impactos e providências: <b>não preenchido</b></p></div><div class="dossier-section"><h4>4. Plano de ação</h4><p>Condições, responsáveis e sequência de execução: <b>não preenchido</b></p></div><div class="dossier-section"><h4>5. Conclusão</h4><p>Resultado fundamentado do caso concreto: <b>não preenchido</b></p></div><div class="bridge"><b>Na versão completa,</b> o conteúdo preenchido durante as etapas é levado para este documento e poderá ser gerado em PDF.</div></div>';
  const previewScript=`<a class="preview-return" href="${coursePage}" target="_parent" onclick="${returnAction}">← Voltar à página do curso</a><script>(function(){var button=document.getElementById('btnDossier');var dossierButtons=['btnDossier','sideDossier','finalDossier'].map(function(id){return document.getElementById(id)}).filter(Boolean);var modal=document.getElementById('dossierModal');var content=document.getElementById('dossierContent');var indexButton=document.getElementById('btnIndex');var indexModal=document.getElementById('indexModal');var indexContent=document.getElementById('fullIndex');if(button)button.textContent=${JSON.stringify(meta.buttonName)};if(dossierButtons.length&&modal&&content){var openPreviewDossier=function(){var heading=modal.querySelector('h2,h3');if(heading)heading.textContent=${JSON.stringify(meta.documentName)};content.innerHTML=${JSON.stringify(dossierBody)};modal.classList.add('show')};dossierButtons.forEach(function(item){item.onclick=openPreviewDossier})}if(indexButton&&indexModal&&indexContent){indexButton.onclick=function(){indexContent.innerHTML=${JSON.stringify(summary)};indexModal.classList.add('show')}}document.querySelectorAll('.modal .close,[data-close]').forEach(function(close){close.onclick=function(event){event.preventDefault();event.stopPropagation();document.querySelectorAll('.modal').forEach(function(item){item.classList.remove('show')})}});document.querySelectorAll('.modal').forEach(function(item){item.addEventListener('click',function(event){if(event.target===item)item.classList.remove('show')})});})();<\/script>`;
  const withHead=compatible.replace("</head>",`${previewStyle}</head>`);
  const bodyEnd=withHead.lastIndexOf("</body>");
  return bodyEnd>=0?withHead.slice(0,bodyEnd)+previewScript+withHead.slice(bodyEnd):withHead+previewScript;
}

export async function GET(request:Request){
  const url=new URL(request.url);
  const preview=url.searchParams.get("preview");
  if(preview&&htmlByCourse[preview])return new Response(previewHtml(htmlByCourse[preview],preview),{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","x-robots-tag":"noindex, nofollow"}});
  return new Response("Conteúdo indisponível.",{status:404,headers:{"x-robots-tag":"noindex, nofollow"}});
}
