import Link from "next/link";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return <main>
    <header className="top"><Link className="brand" href="/"><img className="brand-logo" src="/logo-pm.png" alt=""/><span>Paula Gomes de Magalhães<small>Direito · Pesquisa · Tecnologia</small></span></Link><nav aria-label="Navegação principal"><Link href="/pessoal">Trajetória</Link><a href="/advocacia/">Escritório</a><a href="https://imovel123.com" target="_blank" rel="noreferrer">Imóvel123</a></nav></header>
    <section className="gateway">
      <div className="gateway-copy"><p className="kicker">Escolha o que você procura</p><h1>Conhecimento jurídico que encontra a <em>prática.</em></h1><p className="lead">Conheça a trajetória acadêmica de Paula, encontre apoio jurídico especializado ou acesse a tecnologia da Imóvel123.</p></div>
      <div className="gateway-photo"><img src="/paula.jpg" alt="Paula Gomes de Magalhães"/><div className="photo-note">Doutora e pós-doutoranda pela UFMG</div></div>
    </section>
    <section className="routes" aria-label="Áreas do site">
      <Link className="route route-light" href="/pessoal"><span className="route-number">01</span><p>Pesquisa · Docência · Projetos</p><h2>Conheça meus cursos e trajetória</h2><span className="route-link">Acessar perfil <Arrow/></span></Link>
      <a className="route route-dark" href="/advocacia/"><span className="route-number">02</span><p>Direito Registral e Imobiliário</p><h2>Paula Magalhães Advocacia</h2><span className="route-link">Conhecer o escritório <Arrow/></span></a>
      <a className="route route-rose" href="https://imovel123.com" target="_blank" rel="noreferrer"><span className="route-number">03</span><p>Análise técnica de imóveis</p><h2>Imóvel123</h2><span className="route-link">Analisamos, explicamos. Você decide. <Arrow/></span></a>
    </section>
    <footer className="minimal-footer"><span>© 2026 Paula Gomes de Magalhães</span><span>Belo Horizonte · Atuação nacional</span></footer>
  </main>
}
