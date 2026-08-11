"use client";
import {useState} from "react";
import type {CourseInfo} from "./CoursePreview";

export default function CourseSampler({course}:{course:CourseInfo}){
  const [step,setStep]=useState(0);
  const steps=["Apresentação","Como funciona","Ementa"];
  return <section className="section cream course-sampler" aria-label="Demonstração navegável do curso">
    <div className="sampler-top"><div><span className="eyebrow">Demonstração navegável</span><h2>Conheça o curso <em>por dentro.</em></h2></div><div className="sampler-progress" aria-label={`Etapa ${step+1} de 3`}>{steps.map((s,i)=><button key={s} className={i===step?"active":""} onClick={()=>setStep(i)} aria-current={i===step?"step":undefined}><b>{i+1}</b><span>{s}</span></button>)}</div></div>
    <div className="sampler-screen">
      {step===0&&<div className="sampler-cover"><span>{course.label}</span><h3>{course.title}</h3><p>{course.lead}</p><small>Conteúdo e desenho do curso · Paula Gomes de Magalhães</small></div>}
      {step===1&&<div><span className="eyebrow">Aprender fazendo</span><h3>O curso acompanha o seu caso até o dossiê final.</h3><div className="learning-flow compact"><article><b>01</b><h4>Você traz o caso</h4><p>Escolha um imóvel ou uma operação real.</p></article><article><b>02</b><h4>O curso orienta</h4><p>As perguntas explicam o que investigar e por quê.</p></article><article><b>03</b><h4>Você constrói</h4><p>As respostas formam um único dossiê revisável por 60 dias.</p></article><article><b>04</b><h4>Você conclui</h4><p>Gere o resultado em PDF ao final do percurso.</p></article></div><div className="course-outcome"><span>Produto do percurso</span><strong>{course.outcome}</strong></div></div>}
      {step===2&&<div><span className="eyebrow">Ementa</span><h3>O que você vai aprender</h3><ol className="syllabus-list">{course.syllabus.map((item,i)=><li key={item}><b>{String(i+1).padStart(2,"0")}</b><span>{item}</span></li>)}</ol><div className="preview-boundary"><span>Fim da demonstração</span><h4>Agora você já conhece a proposta, o método e o conteúdo.</h4><p>Para iniciar o percurso prático com o seu caso, siga para a aquisição do curso.</p></div></div>}
    </div>
    <div className="sampler-nav"><button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}>← Anterior</button>{step<2?<button className="primary" onClick={()=>setStep(step+1)}>Continuar →</button>:<a className="button primary" href="#comprar">Adquirir o curso →</a>}</div>
  </section>
}
