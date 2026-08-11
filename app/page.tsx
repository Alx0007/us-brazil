"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  addressLines,
  brand,
  burgers,
  cardPhoto,
  contact,
  copy,
  dish,
  formatPrice,
  fries,
  locale,
  navLinks,
  pad,
  reviews,
  sections,
  sides,
  type SectionKey,
} from "@/site.config";
import { Picture } from "./picture";

/**
 * Âncoras das seções que recebem link. As demais ganham `#<chave>`, para que
 * qualquer seção possa ser alvo de navegação depois de reordenada.
 */
const SECTION_ANCHOR: Partial<Record<SectionKey, string>> = {
  hero: "#home",
  manifesto: "#craft",
  menu: "#menu",
  about: "#about",
  reviews: "#reviews",
  contact: "#contact",
};

const anchorOf = (key: SectionKey) => SECTION_ANCHOR[key] ?? `#${key}`;
const idOf = (key: SectionKey) => anchorOf(key).slice(1);

/**
 * Destino de todo botão "Pedir": o cardápio online, quando houver, senão o
 * telefone. `orderProps` já traz o `target`/`rel` de link externo, e some
 * quando o destino é `tel:` — abrir uma ligação em aba nova não faz sentido.
 */
const orderProps = contact.orderHref
  ? { href: contact.orderHref, target: "_blank", rel: "noreferrer" }
  : { href: contact.phoneHref };

/** Complemento do rótulo acessível, para dizer aonde o botão leva. */
const orderTargetLabel = contact.orderHref
  ? `cardápio online da ${brand.name}`
  : `ligar para ${brand.name}`;

/** Renderiza quebras de linha vindas da config ("linha 1\nlinha 2"). */
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark--compact" : ""}`}>
      <Picture src={brand.logo} alt={brand.name} sizes="48px" />
      <span className="brand-word">{brand.name}</span>
    </span>
  );
}

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Stat({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const decimals = target < 10 ? 1 : 0;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1200, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setValue(target * eased);
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <div ref={ref} className="stat-number">
      {value.toLocaleString(locale.lang, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </div>
  );
}

function BurgerAssembly({ id }: { id: string }) {
  const [assembled, setAssembled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setAssembled(true),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={`assembly section-pad ${assembled ? "assembled" : ""}`}>
      <div className="assembly-copy" data-reveal>
        <p className="eyebrow">{copy.assembly.eyebrow}</p>
        <h2>
          {copy.assembly.titleTop}
          <br />
          {copy.assembly.titleBottom}
        </h2>
        <p>{copy.assembly.body}</p>
      </div>
      <div className="assembly-stage" aria-label="Montagem animada do hambúrguer">
        <div className="assembly-glow" />
        {[
          "bottom",
          "sauce",
          "patty",
          "cheese",
          "lettuce",
          "tomato",
          "pickle",
          "top",
        ].map((layer) => (
          <div className={`ingredient ingredient--${layer}`} key={layer} aria-hidden="true">
            <Picture src={copy.assembly.image} alt="" draggable={false} />
          </div>
        ))}
        <span className="crumb crumb--one" />
        <span className="crumb crumb--two" />
        <span className="crumb crumb--three" />
      </div>
      <p className="assembly-note">
        {copy.assembly.note} <Arrow down />
      </p>
    </section>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBurger, setActiveBurger] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroVisual = useRef<HTMLDivElement>(null);
  const burgerPanels = useRef<Array<HTMLElement | null>>([]);
  const active = burgers[activeBurger];
  const burgerTotal = pad(burgers.length);

  useReveal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Qual cartela está em foco: a do painel cujo centro está mais perto do
   * centro da tela.
   *
   * Distância nos dois eixos de propósito — no desktop os painéis são uma
   * coluna e quem decide é o eixo Y; no celular `.burger-panels` vira um
   * carrossel horizontal e quem decide é o X. A mesma conta serve para os dois.
   *
   * O listener é de captura porque o scroll do carrossel do celular acontece
   * num elemento interno, e evento de scroll não sobe por bubbling.
   */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const nodes = burgerPanels.current;
      const midX = window.innerWidth / 2;
      const midY = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;

      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        if (!node) continue;
        const box = node.getBoundingClientRect();
        const dx = box.left + box.width / 2 - midX;
        const dy = box.top + box.height / 2 - midY;
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      }

      setActiveBurger(best);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const onHeroMove = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.current?.style.setProperty("--tilt-x", `${y * -8}deg`);
    heroVisual.current?.style.setProperty("--tilt-y", `${x * 10}deg`);
    heroVisual.current?.style.setProperty("--light-x", `${(x + 0.5) * 100}%`);
    heroVisual.current?.style.setProperty("--light-y", `${(y + 0.5) * 100}%`);
  };

  const onHeroLeave = () => {
    heroVisual.current?.style.setProperty("--tilt-x", "0deg");
    heroVisual.current?.style.setProperty("--tilt-y", "0deg");
  };

  // Links de navegação que apontam para seções desligadas somem.
  const liveAnchors = new Set(sections.map(anchorOf));
  const liveNav = navLinks.filter(([, href]) => liveAnchors.has(href));

  // Alvo da seta "role" da capa: a seção logo abaixo dela.
  const heroIndex = sections.indexOf("hero");
  const afterHero = heroIndex >= 0 ? sections[heroIndex + 1] : undefined;

  const renderers: Record<SectionKey, () => ReactNode> = {
    hero: () => (
      <section id={idOf("hero")} className="hero" onMouseMove={onHeroMove} onMouseLeave={onHeroLeave}>
        <div className="hero-grid" />
        <div className="hero-label hero-label--left"><Lines text={copy.hero.labelLeft} /></div>
        <div className="hero-label hero-label--right"><Lines text={copy.hero.labelRight} /></div>
        <div className="hero-copy">
          <p className="hero-overline">{copy.hero.overline}</p>
          <h1><span>{copy.hero.titleTop}</span><span className="hero-outline">{copy.hero.titleOutline}</span></h1>
          <div className="hero-actions">
            <a className="button" href={anchorOf("menu")}>{copy.hero.ctaPrimary} <Arrow down /></a>
            <a className="text-link" {...orderProps}>{copy.hero.ctaSecondary} <Arrow /></a>
          </div>
        </div>
        <div className="hero-product" ref={heroVisual}>
          <div className="hero-aura" />
          <span className="orbit orbit--one" />
          <span className="orbit orbit--two" />
          <Picture src={copy.hero.image} alt={`Hambúrguer ${brand.name}`} priority sizes="(max-width: 640px) 100vw, 690px" quality={90} />
          <span className="hero-shadow" />
        </div>
        <div className="hero-proof">
          {copy.hero.proof.map((item) => (
            <div key={item.note}>
              <strong>{item.value}</strong>
              <span>{item.label}<small>{item.note}</small></span>
            </div>
          ))}
        </div>
        {afterHero && (
          <a className="hero-scroll" href={anchorOf(afterHero)} aria-label="Rolar para descobrir">
            <span>{copy.hero.scrollLabel}</span><i />
          </a>
        )}
      </section>
    ),

    manifesto: () => (
      <section id={idOf("manifesto")} className="manifesto section-pad">
        <div className="manifesto-index">{copy.manifesto.index}</div>
        <p data-reveal>
          {copy.manifesto.lineTop}<br />
          <span>{copy.manifesto.lineBottom}</span>
        </p>
        <div className="manifesto-side" data-reveal>
          <span />
          {copy.manifesto.side}
        </div>
      </section>
    ),

    assembly: () => <BurgerAssembly id={idOf("assembly")} />,

    menu: () => (
      <section id={idOf("menu")} className="signature section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">{copy.menu.eyebrow}</p>
            <h2>{copy.menu.titleTop}<br /><span>{copy.menu.titleBottom}</span></h2>
          </div>
          <p>{copy.menu.intro}</p>
        </div>

        <div className="burger-experience">
          <div className="burger-panels">
            {burgers.map((burger, index) => (
              <article
                className={`burger-panel ${activeBurger === index ? "is-active" : ""}`}
                data-index={index}
                key={burger.name}
                ref={(node) => { burgerPanels.current[index] = node; }}
              >
                <p className="burger-count">{pad(index + 1)} / {burgerTotal}</p>
                <p className="eyebrow">{burger.kicker}</p>
                <h3>{burger.name}</h3>
                <p className="burger-description">{burger.description}</p>
                <ul>
                  {burger.ingredients.map((ingredient) => <li key={ingredient}><span>✓</span>{ingredient}</li>)}
                </ul>
                <div className="burger-order">
                  <strong>{formatPrice(burger.price)}</strong>
                  <a className="button button--round" {...orderProps} aria-label={`Pedir ${burger.name}`}><Arrow /></a>
                </div>
              </article>
            ))}
          </div>

          <div className="burger-visual-wrap">
            <div
              className="burger-visual"
              style={{
                "--burger-tone": active.tone,
                "--photo-top": `${cardPhoto.top}%`,
                "--photo-left": `${cardPhoto.left}%`,
                "--photo-width": `${cardPhoto.width}%`,
              } as CSSProperties}
            >
              <div className="burger-visual-number">{pad(activeBurger + 1)}</div>
              <div className="burger-ring" />
              {burgers.map((burger, index) => (
                <article
                  className={`burger-card ${activeBurger === index ? "is-active" : ""}`}
                  key={burger.name}
                  aria-hidden={activeBurger !== index}
                >
                  {/*
                    Duas camadas: a arte do cartão (nome, subtítulo e chama já
                    embutidos) e o lanche recortado por cima. O texto do cartão
                    é decorativo — o painel ao lado já traz nome, descrição e
                    ingredientes como texto de verdade.
                  */}
                  {/*
                    `sizes` deliberadamente generoso: a arte inteira pesa ~45KB,
                    então não compensa o navegador baixar uma versão reduzida —
                    o texto do cartão é pixel e perde nitidez ao ser diminuído.
                  */}
                  <Picture
                    className="burger-card-art"
                    src={burger.card}
                    alt=""
                    sizes="(max-width: 640px) 100vw, 1400px"
                    quality={90}
                  />
                  <Picture
                    className="burger-card-photo"
                    src={burger.image}
                    alt={`Hambúrguer ${burger.name}`}
                    sizes="(max-width: 640px) 78vw, 900px"
                    quality={90}
                    onError={(event) => { event.currentTarget.src = copy.hero.image; }}
                  />
                </article>
              ))}
              <span className="burger-smoke burger-smoke--one" />
              <span className="burger-smoke burger-smoke--two" />
              <div className="burger-visual-meta"><span>{active.name}</span><span>{formatPrice(active.price)}</span></div>
            </div>
          </div>
        </div>
      </section>
    ),

    explode: () => (
      <section id={idOf("explode")} className="explode">
        <div className="explode-particles" aria-hidden="true">
          <span>●</span><span>▰</span><span>◒</span><span>✦</span><span>●</span><span>▰</span>
        </div>
        <p className="eyebrow" data-reveal>{copy.explode.eyebrow}</p>
        <h2 data-reveal>{copy.explode.titleTop}<br /><span>{copy.explode.titleBottom}</span></h2>
      </section>
    ),

    fries: () => (
      <section id={idOf("fries")} className="fries section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">{copy.fries.eyebrow}</p>
            <h2>{copy.fries.titleTop}<br /><span>{copy.fries.titleBottom}</span></h2>
          </div>
          <p>{copy.fries.intro}</p>
        </div>
        <div className="fries-layout">
          <div className="fries-product" data-reveal>
            {copy.fries.orbit && <div className="fries-orbit">{copy.fries.orbit}</div>}
            <Picture src={copy.fries.image} alt={`Batata recheada ${brand.name}`} sizes="(max-width: 980px) 90vw, 600px" />
          </div>
          <div className="fries-list">
            {fries.map((item, index) => (
              <a key={item.name} {...orderProps} className="fries-row" data-reveal>
                <span className="fries-index">{pad(index + 1)}</span>
                <span><strong>{item.name}</strong><small>{item.description}</small></span>
                <b>{formatPrice(item.price)}</b><Arrow />
              </a>
            ))}
          </div>
        </div>
      </section>
    ),

    dish: () => (
      <section id={idOf("dish")} className="dish section-pad">
        <div className="dish-image" data-reveal>
          <div className="steam"><i /><i /><i /></div>
          <Picture src={copy.dish.image} alt={`Massa da ${brand.name}`} sizes="(max-width: 640px) 110vw, 760px" />
          <p><Lines text={copy.dish.imageNote} /></p>
        </div>
        <div className="dish-copy" data-reveal>
          <p className="eyebrow">{copy.dish.eyebrow}</p>
          <h2>{copy.dish.titleTop}<br /><span>{copy.dish.titleBottom}</span></h2>
          {dish.map((item, index) => (
            <div className="dish-item" key={item.name}>
              <span>{pad(index + 1)}</span>
              <div><h3>{item.name}</h3>{item.description && <p>{item.description}</p>}</div>
              <strong>{formatPrice(item.price)}</strong>
            </div>
          ))}
        </div>
      </section>
    ),

    sides: () => (
      <section id={idOf("sides")} className="sides section-pad">
        <div className="section-heading section-heading--center" data-reveal>
          <div>
            <p className="eyebrow">{copy.sides.eyebrow}</p>
            <h2>{copy.sides.titleTop}<br /><span>{copy.sides.titleBottom}</span></h2>
          </div>
        </div>
        <div className="side-grid">
          {sides.map((item, index) => (
            <article key={item.name} data-reveal>
              <span className="side-num">{pad(index + 1)}</span>
              <div className={`side-art side-art--${pad((index % 4) + 1)}`}><i /><i /><i /></div>
              <h3>{item.name}</h3><p>{item.description}</p><strong>{formatPrice(item.price)}</strong>
              <a {...orderProps} aria-label={`Pedir ${item.name}`}><Arrow /></a>
            </article>
          ))}
        </div>
      </section>
    ),

    drinks: () => (
      <section id={idOf("drinks")} className="drinks section-pad">
        {/*
          Fotos recortadas das bebidas. A primeira da config vai embaixo à
          esquerda, a segunda em cima à direita. São decorativas — os nomes e
          preços estão no texto abaixo.
        */}
        {copy.drinks.items.slice(0, 2).map((item) => (
          <div
            className={`can can--${item.art.spot}`}
            key={item.name}
            aria-hidden="true"
            style={{
              "--drink-height": `${item.art.height}px`,
              "--drink-offset": `${item.art.offset}px`,
            } as CSSProperties}
          >
            <Picture src={item.image} alt="" sizes="320px" quality={90} />
          </div>
        ))}
        <div className="drinks-copy" data-reveal>
          <p className="eyebrow">{copy.drinks.eyebrow}</p>
          <h2>{copy.drinks.titleTop}<br /><span>{copy.drinks.titleBottom}</span></h2>
          <p>
            {copy.drinks.items.map((item, index) => (
              <Fragment key={item.name}>
                {index > 0 && " · "}
                {item.name} <strong>{formatPrice(item.price)}</strong>
              </Fragment>
            ))}
          </p>
        </div>
      </section>
    ),

    about: () => (
      <section id={idOf("about")} className="about section-pad">
        <div className="about-word" aria-hidden="true">{brand.name}</div>
        <div className="about-top" data-reveal>
          <p className="eyebrow">{copy.about.eyebrow}</p>
          <h2>
            {copy.about.titleTop}<br />
            {copy.about.titleMiddle}<br />
            <span>{copy.about.titleBottom}</span>
          </h2>
        </div>
        <div className="about-grid">
          {copy.about.cards.map((card, index) => (
            <div className="about-card" key={card.title} data-reveal>
              <Picture
                className="about-card-photo"
                src={card.image}
                alt=""
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <span>{pad(index + 1)}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    ),

    stats: () => (
      <section id={idOf("stats")} className="stats section-pad">
        {copy.stats.map((stat) => (
          <div className="stat" key={stat.label} data-reveal>
            <span>{stat.icon}</span>
            {stat.value === null
              ? <div className="stat-number">{stat.display}</div>
              : <Stat target={stat.value} suffix={stat.suffix} />}
            <p>{stat.label}</p>
          </div>
        ))}
      </section>
    ),

    reviews: () =>
      reviews.length === 0 ? null : (
        <section id={idOf("reviews")} className="reviews section-pad">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">{copy.reviews.eyebrow}</p>
              <h2>{copy.reviews.titleTop}<br /><span>{copy.reviews.titleBottom}</span></h2>
            </div>
            <p>{copy.reviews.intro}</p>
          </div>
          <div className="review-track">
            {reviews.map((review, index) => (
              <article key={review.quote} data-reveal>
                <div className="review-stars">★★★★★</div>
                <blockquote>“{review.quote}”</blockquote>
                <footer><span>{review.author}</span><span>{review.source} · {pad(index + 1)}</span></footer>
              </article>
            ))}
          </div>
        </section>
      ),

    contact: () => (
      <section id={idOf("contact")} className="contact section-pad">
        <div className="contact-glow" />
        <Picture className="contact-burger" src={copy.hero.image} alt="" sizes="(max-width: 640px) 125vw, 70vw" />
        <div className="contact-copy" data-reveal>
          <p className="eyebrow">{copy.contact.eyebrow}</p>
          <h2>{copy.contact.title}</h2>
          <p>{copy.contact.body}</p>
          <a className="call-giant" {...orderProps}><span>{copy.contact.cta}</span><Arrow /></a>
        </div>
        <div className="contact-details" data-reveal>
          <a href={contact.phoneHref}>
            <small>{copy.contact.labels.phone}</small>
            <strong>{contact.phoneDisplay}</strong>
          </a>
          <a href={contact.mapsHref} target="_blank" rel="noreferrer">
            <small>{copy.contact.labels.address}</small>
            <strong><Lines text={addressLines().join("\n")} /></strong>
          </a>
          <div>
            <small>{copy.contact.labels.services}</small>
            <strong>{contact.services}</strong>
          </div>
          <div>
            <small>{copy.contact.labels.hours}</small>
            <strong>{contact.hours}</strong>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      <header className={`site-nav ${scrolled ? "site-nav--solid" : ""}`}>
        <a href={anchorOf("hero")} aria-label={`${brand.name} — início`}><BrandMark /></a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {liveNav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <a className="button button--small desktop-call" {...orderProps}>
          {copy.hero.ctaSecondary} <Arrow />
        </a>
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div>
          {liveNav.map(([label, href], index) => (
            <a key={label} href={href} onClick={closeMenu} style={{ "--i": index } as CSSProperties}>{label}</a>
          ))}
        </div>
        <a className="button" href={contact.phoneHref} onClick={closeMenu}>
          {contact.phoneDisplay} <Arrow />
        </a>
      </div>

      {sections.map((key) => <Fragment key={key}>{renderers[key]()}</Fragment>)}

      <footer className="footer section-pad">
        <BrandMark compact />
        <p>{brand.tagline}</p>
        <div>
          <a href={contact.instagramHref} target="_blank" rel="noreferrer">{copy.footer.instagram} <Arrow /></a>
          {contact.facebookHref && (
            <a href={contact.facebookHref} target="_blank" rel="noreferrer">{copy.footer.facebook} <Arrow /></a>
          )}
          <a href={contact.mapsHref} target="_blank" rel="noreferrer">{copy.footer.maps} <Arrow /></a>
        </div>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          {copy.footer.backToTop}
        </button>
        <small>© {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.</small>
      </footer>

      <a className="floating-call" {...orderProps} aria-label={`${copy.contact.cta} — ${orderTargetLabel}`}>
        {copy.contact.cta.split(" ")[0]} <span>↗</span>
      </a>
    </main>
  );
}
