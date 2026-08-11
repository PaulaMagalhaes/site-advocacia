"use client";

import Link from "next/link";
import {useEffect} from "react";

export type CourseInfo={
  slug?:string;
  title:string;
  label:string;
  lead:string;
  price:string;
  outcome:string;
  syllabus:string[];
  whatsappText:string;
};

export default function CoursePreview({course}:{course:CourseInfo}){
  const slug=course.slug??(course.title.startsWith("Due")?"due-diligence":course.title.startsWith("Arrematação")?"arrematacao":"incorporacao");
  useEffect(()=>{
    const returnToPurchase=(event:MessageEvent)=>{
      if(event.origin!==window.location.origin||event.data?.type!=="course-return"||event.data?.slug!==slug)return;
      history.replaceState(null,"",`${window.location.pathname}#comprar`);
      const scrollToPurchase=()=>{
        const purchase=document.getElementById("comprar");
        if(!purchase)return;
        purchase.setAttribute("tabindex","-1");
        purchase.focus({preventScroll:true});
        purchase.scrollIntoView({behavior:"auto",block:"start"});
      };
      scrollToPurchase();
      window.setTimeout(scrollToPurchase,150);
      window.setTimeout(scrollToPurchase,400);
      window.setTimeout(scrollToPurchase,1000);
    };
    window.addEventListener("message",returnToPurchase);
    return()=>window.removeEventListener("message",returnToPurchase);
  },[slug]);
  return <main className="course-preview-page">
    <div className="page-header"><header className="top"><Link className="brand" href="/pessoal"><img className="brand-logo" src="/logo-pm.png" alt=""/><span>Paula Gomes de Magalhães<small>Cursos e materiais</small></span></Link><nav><Link className="back-link" href="/pessoal#cursos">← Voltar aos cursos</Link><Link href="/">Página principal</Link></nav></header></div>

    <section className="course-preview-hero"><div><span className="eyebrow">Conheça o curso · {course.label}</span><h1>{course.title}</h1><p>{course.lead}</p><div className="course-price"><small>Investimento</small><strong>{course.price}</strong><span>Acesso individual por 60 dias</span></div></div><aside className="preview-status"><span>Navegue pela demonstração</span><b>Apresentação</b><b>Como o curso funciona</b><b>Ementa completa</b></aside></section>

    <section className="section cream real-course-preview" aria-label="Prévia interativa do curso">
      <div className="section-title preview-intro"><div><span className="eyebrow">Prévia interativa</span></div><h2>Entre no curso e navegue pelas <em>primeiras páginas.</em></h2></div>
      <p className="section-lead">Use o sumário e os botões do próprio curso. Você poderá conhecer a apresentação, entender o funcionamento, percorrer a ementa e abrir o modelo vazio do dossiê.</p>
      <div className="course-preview-frame"><iframe title={`Prévia do curso ${course.title}`} src={`/api/curso?preview=${slug}&v=4`}/></div>
    </section>

    <section className="section rose purchase-section purchase-platform-only" id="comprar"><div><div className="eyebrow">Pagamento on-line</div><h2>Adquirir o curso por {course.price}</h2><p>Ao continuar, você será encaminhado ao ambiente seguro da plataforma contratada. O pagamento, o acesso ao curso e os documentos da compra serão disponibilizados pela própria plataforma.</p><Link className="button light checkout-button" href={`/comprar/${slug}`}>Ir para o pagamento seguro →</Link></div></section>

    <section className="section consumer-terms"><div><span className="eyebrow">Compra on-line</span><h2>Direito de arrependimento e documentos da compra.</h2></div><div className="terms-grid"><article><h3>Direito de arrependimento</h3><p>Nas compras realizadas pela internet, o consumidor poderá desistir da contratação no prazo legal de 7 dias, contado da assinatura ou do recebimento do serviço, nos termos do art. 49 do Código de Defesa do Consumidor. Os valores pagos serão devolvidos conforme a legislação aplicável.</p></article><article><h3>Acesso e documentos</h3><p>O acesso ao curso, o histórico da compra e os documentos fiscais serão disponibilizados diretamente pela plataforma contratada, conforme as regras e os canais informados no momento da aquisição.</p></article></div></section>
  </main>
}
