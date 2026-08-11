import Link from "next/link";
import {redirect} from "next/navigation";
import {env} from "cloudflare:workers";
export const dynamic="force-dynamic";

const courses:Record<string,{title:string;price:string}>={
  "due-diligence":{title:"Due Diligence Imobiliária por Camadas",price:"R$ 100,00"},
  arrematacao:{title:"Arrematação Judicial de Imóveis",price:"R$ 100,00"},
  incorporacao:{title:"Registro de Incorporação Imobiliária",price:"R$ 200,00"},
};

export default async function Comprar({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const course=courses[slug];
  if(!course)return <main className="access-shell"><section className="access-card"><h1>Curso não encontrado</h1><Link className="button primary" href="/pessoal#cursos">Voltar aos cursos</Link></section></main>;
  const setting=await env.DB.prepare("SELECT provider, checkout_url, active FROM course_checkout_settings WHERE course_slug = ? LIMIT 1").bind(slug).first<{provider:string;checkout_url:string;active:number}>();
  if(setting?.active&&setting.checkout_url){
    redirect(setting.checkout_url);
  }
  const whatsapp=`https://wa.me/5531994204205?text=${encodeURIComponent(`Olá, Paula. Quero adquirir o curso ${course.title}, no valor de ${course.price}.`)}`;
  return <main className="checkout-redirect"><section><h1>{course.title}</h1><p>Investimento: <strong>{course.price}</strong></p><div className="checkout-pending"><strong>O checkout on-line será disponibilizado aqui.</strong><p>Enquanto o endereço definitivo não é inserido, você pode solicitar o pagamento diretamente.</p></div><a className="button primary" href={whatsapp} target="_blank" rel="noreferrer">Solicitar pagamento pelo WhatsApp →</a><Link className="text-link" href={`/pessoal/formacao/${slug}`}>← Voltar ao curso</Link></section></main>;
}
