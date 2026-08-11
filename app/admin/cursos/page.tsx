import Link from "next/link";
import {requireChatGPTUser} from "../../chatgpt-auth";
import CheckoutSettings from "./CheckoutSettings";
export const dynamic="force-dynamic";
const ADMIN_EMAIL="fidiusformacaoestrategica@gmail.com";

export default async function AdminCursos(){
  const user=await requireChatGPTUser("/admin/cursos");
  if(user.email.toLowerCase()!==ADMIN_EMAIL)return <main className="access-shell"><section className="access-card"><h1>Acesso restrito</h1><p>Esta área é exclusiva da administradora dos cursos.</p><Link className="button primary" href="/">Voltar</Link></section></main>;
  return <main className="admin-shell"><section className="admin-panel"><span className="eyebrow">Administração dos cursos</span><h1>Plataformas de pagamento</h1><CheckoutSettings/><Link className="text-link" href="/pessoal#cursos">Voltar aos cursos →</Link></section></main>;
}
