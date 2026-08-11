import {env} from "cloudflare:workers";
import {getChatGPTUser} from "../../../chatgpt-auth";

const ADMIN_EMAIL="fidiusformacaoestrategica@gmail.com";
const COURSES=new Set(["due-diligence","arrematacao","incorporacao"]);
const PROVIDERS=new Set(["Hotmart","Eduzz","Kiwify","Monetizze","Outro"]);

async function authorized(){const user=await getChatGPTUser();return !!user&&user.email.toLowerCase()===ADMIN_EMAIL}

export async function GET(){
  if(!await authorized())return Response.json({error:"Não autorizado"},{status:403});
  const result=await env.DB.prepare("SELECT course_slug, provider, checkout_url, active, updated_at FROM course_checkout_settings ORDER BY course_slug").all();
  return Response.json({settings:result.results});
}

export async function POST(request:Request){
  if(!await authorized())return Response.json({error:"Não autorizado"},{status:403});
  const body=await request.json() as {courseSlug?:string;provider?:string;checkoutUrl?:string;active?:boolean};
  if(!body.courseSlug||!COURSES.has(body.courseSlug)||!body.provider||!PROVIDERS.has(body.provider)||!body.checkoutUrl?.trim())return Response.json({error:"Preencha curso, plataforma e link do checkout."},{status:400});
  let url:URL;try{url=new URL(body.checkoutUrl)}catch{return Response.json({error:"Informe um endereço completo iniciado por https://"},{status:400})}
  if(url.protocol!=="https:")return Response.json({error:"O checkout deve usar um endereço seguro https://"},{status:400});
  const now=Date.now();
  await env.DB.prepare("INSERT INTO course_checkout_settings (course_slug, provider, checkout_url, active, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(course_slug) DO UPDATE SET provider=excluded.provider, checkout_url=excluded.checkout_url, active=excluded.active, updated_at=excluded.updated_at").bind(body.courseSlug,body.provider,url.toString(),body.active===false?0:1,now).run();
  return Response.json({ok:true,courseSlug:body.courseSlug,provider:body.provider,checkoutUrl:url.toString(),active:body.active!==false,updatedAt:now});
}
