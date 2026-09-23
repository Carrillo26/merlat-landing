/**
 * Merlat landing v2 — EN/ES i18n + nav + FintechX-inspired motion
 * localStorage key: merlat-lang
 */
(function () {
  "use strict";

  var STORAGE_KEY = "merlat-lang";
  var DEFAULT_LANG = "en";

  var I18N = {
    en: {
      "a11y.skip": "Skip to content",
      "cta.buy": "Buy $MERLAT on pump.fun",
      "cta.email": "Email",
      "cta.eyebrow": "Join the raise",
      "cta.sub": "Soft raise $50K–$100K on pump.fun. Thesis-backed. Risk disclosed.",
      "cta.telegram": "Telegram",
      "cta.title": "Build with us",
      "cta.twitter": "Twitter / X",
      "faq.a1": "$MERLAT launches on pump.fun as a community raise token. The thesis is a LATAM prediction market product — not a cartoon with zero business. Day-1 utility is fundraising + coordination; product utilities are labeled Planned / Roadmap.",
      "faq.a2": "Soft goal only: $50K–$100K USD via pump.fun. We do not publish a “raised” figure we have not achieved.",
      "faq.a3": "No. Merlat does not claim licensed real-money operations in Brazil or elsewhere unless explicitly stated after counsel review. Compliance is a funded workstream (25%).",
      "faq.a4": "Illustrative UI only — Spanish LATAM examples (football, macro, politics). Not tradable markets and not real odds or liquidity.",
      "faq.a5": "Primarily fundraising and community coordination. Fee discount and governance are Planned; staking / fee share is Roadmap — subject to legal review.",
      "faq.eyebrow": "Questions",
      "faq.q1": "Is Merlat a memecoin?",
      "faq.q2": "How much are you raising?",
      "faq.q3": "Are you licensed in Brazil?",
      "faq.q4": "What do the market cards show?",
      "faq.q5": "What does $MERLAT do on day one?",
      "faq.title": "FAQ",
      "footer.d1": "Crypto risk: Digital assets are highly volatile. You can lose all capital. Past performance is not indicative of future results.",
      "footer.d2": "Not financial advice: Nothing on this site is an offer, solicitation, or recommendation to buy or sell any asset.",
      "footer.d3": "Availability: Not available where prohibited. Users are responsible for complying with local law.",
      "footer.d4": "LATAM regulatory uncertainty: Prediction markets and related tokens face evolving rules across jurisdictions. Merlat does not claim licensed real-money operations in Brazil or elsewhere unless explicitly stated after counsel review.",
      "footer.d5": "Illustrative markets and percentages are mockups only. Placeholders like {{PUMPFUN_URL}} must be replaced before public launch.",
      "footer.rights": "All rights reserved.",
      "funds.eyebrow": "Locked allocation",
      "funds.legal": "Legal / compliance",
      "funds.liquidity": "Liquidity / token",
      "funds.marketing": "Marketing",
      "funds.ops": "Ops",
      "funds.product": "Product",
      "funds.sub": "Exactly how community capital is planned to be spent.",
      "funds.title": "Use of funds",
      "hero.cardNote": "No fake TVL. No fake licenses. Product first.",
      "hero.ctaBuy": "Buy $MERLAT",
      "hero.ctaHow": "See markets",
      "hero.eyebrow": "LATAM-first prediction · Community raise",
      "hero.lead": "Polymarket owns English-speaking crypto. Merlat is building the product thesis for Spanish & Portuguese speakers: local markets, native UX, and local payment rails on the roadmap — not a cartoon logo with zero business.",
      "hero.proof1": "Soft raise $50K–$100K",
      "hero.proof1label": "Soft raise",
      "hero.proof2": "ES / PT product focus",
      "hero.proof2label": "Product focus",
      "hero.proof3": "Honest token utilities",
      "hero.proof3label": "Product build",
      "hero.proof4label": "Honesty",
      "hero.proof4value": "Day-1",
      "hero.stat1label": "Demand today",
      "hero.stat1short": "Leaks to Polymarket",
      "hero.stat2label": "Merlat wedge",
      "hero.stat2short": "Local · ES/PT · rails",
      "hero.stat3label": "Token role",
      "hero.stat3short": "Fees · gov · stake",
      "hero.title": "Not just another memecoin. A LATAM prediction market thesis.",
      "how.eyebrow": "Simple model",
      "how.s1d": "Pick Yes or No on markets that matter in LATAM — sports, macro, culture, politics. Clear rules before you enter.",
      "how.s1t": "Predict",
      "how.s2d": "Capital sits in open pools. Winners take the opposing side when the market resolves — you trade against users, not a house edge.",
      "how.s2t": "Transparent pools",
      "how.s3d": "Merlat takes a modest cut of winning payouts. Predictable revenue. No opaque vig. Token holders may get fee discounts (see utilities).",
      "how.s3t": "Small fee",
      "how.sub": "Peer pools, not a house book. Transparent outcomes. Small fee on winning payouts.",
      "how.title": "How Merlat works",
      "latam.eyebrow": "The gap",
      "latam.o1": "Native ES/PT product — not a machine-translated afterthought",
      "latam.o2": "Local market catalog: football, elections, FX/inflation, culture",
      "latam.o3": "Payment rails roadmap: meet users where they already pay",
      "latam.o4": "Capture share of demand that currently leaks north to Polymarket",
      "latam.oppTitle": "The opportunity",
      "latam.p1": "Polymarket is English-first; UX and support feel foreign",
      "latam.p2": "On-ramps and payouts ignore PIX, SPEI, Mercado Pago, local cards",
      "latam.p3": "Thin coverage of regional events people actually care about",
      "latam.p4": "Trust & compliance expectations differ by country — copy-paste US UX fails",
      "latam.problemTitle": "The problem",
      "latam.sub": "Demand already exists. The friction is language, rails, and local market depth — not interest.",
      "latam.title": "Why LATAM",
      "markets.bullet1": "Spanish market cards inside the app",
      "markets.bullet2": "Sports, macro, and politics categories",
      "markets.bullet3": "Labeled examples — not live odds",
      "markets.catMacro": "Macro",
      "markets.catPolitics": "Política",
      "markets.catSports": "Fútbol",
      "markets.eyebrow": "Illustrative · not live",
      "markets.login": "Entrar",
      "markets.m1count": "3 mercados",
      "markets.m1o1": "Brasil",
      "markets.m1o2": "Argentina",
      "markets.m1o3": "Otro",
      "markets.m1q": "¿Ganador Copa América 2028?",
      "markets.m1vol": "$184k vol",
      "markets.m2count": "1 mercado",
      "markets.m2q": "¿La inflación de Argentina se mantiene sobre 30% interanual hasta 2027?",
      "markets.m2vol": "$295k vol",
      "markets.m3count": "2 mercados",
      "markets.m3q": "¿La coalición gobernante de México retiene la presidencia en 2030?",
      "markets.m3vol": "$128k vol",
      "markets.navLive": "En vivo",
      "markets.navPredict": "Predecir",
      "markets.navSearch": "Buscar",
      "markets.navSocial": "Social",
      "markets.no": "No",
      "markets.note": "Illustrative layouts for storytelling. They are not tradable markets and do not reflect real odds or liquidity.",
      "markets.signup": "Registrarse",
      "markets.sub": "Football, inflation, elections — the questions people already argue about in Spanish and Portuguese. Percentages below are mock UI only.",
      "markets.tabMacro": "Macro",
      "markets.tabPolitics": "Política",
      "markets.tabSports": "Deportes",
      "markets.tabTrending": "Tendencias",
      "markets.title": "Product preview",
      "markets.yes": "Sí",
      "nav.cta": "Buy $MERLAT",
      "nav.faq": "FAQ",
      "nav.funds": "Use of funds",
      "nav.how": "How it works",
      "nav.latam": "Why LATAM",
      "nav.markets": "Markets",
      "nav.raise": "The raise",
      "nav.roadmap": "Roadmap",
      "nav.token": "Token",
      "raise.eyebrow": "Community raise · pump.fun",
      "raise.honest": "We are not claiming a completed license, live real-money ops in Brazil, or any partnership we have not signed. Capital funds the build.",
      "raise.soft": "Soft raise goal",
      "raise.sub": "Soft goal: $50K–$100K USD. Enough to ship product, not theater.",
      "raise.title": "The raise",
      "raise.usd": "USD · community raise via pump.fun",
      "raise.w1": "Prediction markets are mainstream — LATAM still underserved",
      "raise.w2": "Memecoin traders want a thesis beyond “number go up”",
      "raise.w3": "Small raise keeps focus on MVP + compliance track, not burn",
      "raise.whyTitle": "Why now",
      "roadmap.eyebrow": "6–12 months",
      "roadmap.p1d": "This site, community channels, pump.fun raise, clear thesis for traders.",
      "roadmap.p1phase": "Now",
      "roadmap.p1t": "Landing + token",
      "roadmap.p2d": "Grow holders & LATAM contributors; gather market ideas; open waitlist.",
      "roadmap.p2phase": "Next",
      "roadmap.p2t": "Community",
      "roadmap.p3d": "Ship a constrained MVP — paper/play mode or early product — so users can feel Merlat before full rails.",
      "roadmap.p3phase": "MVP",
      "roadmap.p3t": "Waitlist / play or early product",
      "roadmap.p4d": "Legal review by jurisdiction; explore local payment rails. No claim of licensed real-money ops until true.",
      "roadmap.p4phase": "Track",
      "roadmap.p4t": "Payments & compliance",
      "roadmap.p5d": "Deeper market catalog, PT-first Brazil track where allowed, token utilities going live as labeled.",
      "roadmap.p5phase": "Later",
      "roadmap.p5t": "Expansion",
      "roadmap.sub": "Sensible sequence. Dates are targets, not guarantees.",
      "roadmap.title": "Roadmap",
      "token.contract": "Contract",
      "token.eyebrow": "$MERLAT · serious utilities",
      "token.honestBody": "At token launch on pump.fun, $MERLAT is primarily a fundraising + community coordination token. Core product utilities (fee discount, governance, staking/fee share) are roadmap, not live day one. We will label what ships at each milestone. Buying the token is speculative and risky.",
      "token.honestTitle": "Day-1 honesty",
      "token.planned": "Planned",
      "token.roadmap": "Roadmap",
      "token.sub": "No moon-speak. What the token is for — and what ships when.",
      "token.title": "Token utility",
      "token.u1d": "Hold or stake $MERLAT to reduce trading / payout fees on Merlat markets. Exact tiers publish with product launch.",
      "token.u1t": "Fee discount",
      "token.u2d": "Signal on market categories, fee parameters, and roadmap priorities. Not a promise of securities-style control — product governance.",
      "token.u2t": "Governance / voting",
      "token.u3d": "Explore staking and/or a share of protocol fees for long-term holders — subject to legal review and jurisdiction rules.",
      "token.u3t": "Staking or fee share",
      "trust.eyebrow": "Trust & security posture",
      "trust.t1d": "No invented TVL, licenses, or partnerships. Soft raise only.",
      "trust.t1t": "No fake claims",
      "trust.t2d": "25% of funds reserved for legal / compliance review by jurisdiction.",
      "trust.t2t": "Compliance track",
      "trust.t3d": "Planned vs roadmap clearly tagged. Day-1 = fundraising + coordination.",
      "trust.t3t": "Labeled utilities",
      "trust.title": "Built to be honest before it is big",
    },
    es: {
      "a11y.skip": "Saltar al contenido",
      "cta.buy": "Comprar $MERLAT en pump.fun",
      "cta.email": "Email",
      "cta.eyebrow": "Únete a la ronda",
      "cta.sub": "Meta suave $50K–$100K en pump.fun. Con tesis. Con riesgos claros.",
      "cta.telegram": "Telegram",
      "cta.title": "Construye con nosotros",
      "cta.twitter": "Twitter / X",
      "faq.a1": "$MERLAT lanza en pump.fun como token de ronda comunitaria. La tesis es un producto de prediction market LATAM — no un cartoon sin negocio. Utilidad día 1 = fundraising + coordinación; utilidades de producto etiquetadas Planificado / Roadmap.",
      "faq.a2": "Solo meta suave: $50K–$100K USD vía pump.fun. No publicamos una cifra “recaudada” que no hayamos alcanzado.",
      "faq.a3": "No. Merlat no afirma operaciones con dinero real licenciadas en Brasil u otros países salvo declaración explícita tras revisión legal. Compliance es un workstream financiado (25%).",
      "faq.a4": "Solo UI ilustrativa — ejemplos LATAM en español (fútbol, macro, política). No son mercados negociables ni odds o liquidez reales.",
      "faq.a5": "Principalmente fundraising y coordinación comunitaria. Descuento de fees y gobernanza están Planificados; staking / fee share es Roadmap — sujeto a revisión legal.",
      "faq.eyebrow": "Preguntas",
      "faq.q1": "¿Merlat es un memecoin?",
      "faq.q2": "¿Cuánto están recaudando?",
      "faq.q3": "¿Están licenciados en Brasil?",
      "faq.q4": "¿Qué muestran las tarjetas de mercado?",
      "faq.q5": "¿Qué hace $MERLAT el día uno?",
      "faq.title": "FAQ",
      "footer.d1": "Riesgo cripto: Los activos digitales son altamente volátiles. Puedes perder todo el capital. El desempeño pasado no garantiza resultados futuros.",
      "footer.d2": "No es asesoría financiera: Nada en este sitio es oferta, solicitud ni recomendación de comprar o vender ningún activo.",
      "footer.d3": "Disponibilidad: No disponible donde esté prohibido. Los usuarios deben cumplir la ley local.",
      "footer.d4": "Incertidumbre regulatoria LATAM: Los mercados de predicción y tokens relacionados enfrentan reglas en evolución. Merlat no afirma operaciones con dinero real licenciadas en Brasil u otros países salvo que se declare explícitamente tras revisión legal.",
      "footer.d5": "Los mercados y porcentajes ilustrativos son solo mockups. Placeholders como {{PUMPFUN_URL}} deben reemplazarse antes del lanzamiento público.",
      "footer.rights": "Todos los derechos reservados.",
      "funds.eyebrow": "Asignación fija",
      "funds.legal": "Legal / compliance",
      "funds.liquidity": "Liquidez / token",
      "funds.marketing": "Marketing",
      "funds.ops": "Ops",
      "funds.product": "Producto",
      "funds.sub": "Exactamente cómo se planea gastar el capital de la comunidad.",
      "funds.title": "Uso de fondos",
      "hero.cardNote": "Sin TVL inventado. Sin licencias falsas. Producto primero.",
      "hero.ctaBuy": "Comprar $MERLAT",
      "hero.ctaHow": "Ver mercados",
      "hero.eyebrow": "Predicción LATAM-first · Ronda comunitaria",
      "hero.lead": "Polymarket domina el cripto en inglés. Merlat construye la tesis de producto para hablantes de español y portugués: mercados locales, UX nativa y rieles de pago locales en la hoja de ruta — no un logo de cartoon sin negocio.",
      "hero.proof1": "Meta suave $50K–$100K",
      "hero.proof1label": "Ronda suave",
      "hero.proof2": "Producto enfocado en ES / PT",
      "hero.proof2label": "Foco producto",
      "hero.proof3": "Utilidades del token con seriedad",
      "hero.proof3label": "Build producto",
      "hero.proof4label": "Honestidad",
      "hero.proof4value": "Día 1",
      "hero.stat1label": "Demanda hoy",
      "hero.stat1short": "Se fuga a Polymarket",
      "hero.stat2label": "La cuña de Merlat",
      "hero.stat2short": "Local · ES/PT · rieles",
      "hero.stat3label": "Rol del token",
      "hero.stat3short": "Fees · gov · stake",
      "hero.title": "No es solo otro memecoin. Una tesis de prediction market para LATAM.",
      "how.eyebrow": "Modelo simple",
      "how.s1d": "Elige Sí o No en mercados que importan en LATAM — deportes, macro, cultura, política. Reglas claras antes de entrar.",
      "how.s1t": "Predice",
      "how.s2d": "El capital vive en pools abiertos. Los ganadores se llevan el lado contrario al resolverse el mercado — operas contra usuarios, no contra la casa.",
      "how.s2t": "Pools transparentes",
      "how.s3d": "Merlat toma un corte modesto de los pagos ganadores. Ingreso predecible. Sin vig opaco. Los holders pueden obtener descuentos (ver utilidades).",
      "how.s3t": "Fee pequeño",
      "how.sub": "Pools entre pares, no una casa. Resultados transparentes. Fee pequeño sobre pagos ganadores.",
      "how.title": "Cómo funciona Merlat",
      "latam.eyebrow": "La brecha",
      "latam.o1": "Producto nativo ES/PT — no una traducción automática de última hora",
      "latam.o2": "Catálogo local: fútbol, elecciones, FX/inflación, cultura",
      "latam.o3": "Roadmap de pagos: encontrarnos donde la gente ya paga",
      "latam.o4": "Capturar demanda que hoy se fuga hacia Polymarket",
      "latam.oppTitle": "La oportunidad",
      "latam.p1": "Polymarket es inglés-first; la UX y el soporte se sienten ajenos",
      "latam.p2": "On-ramps y retiros ignoran PIX, SPEI, Mercado Pago y tarjetas locales",
      "latam.p3": "Poca cobertura de eventos regionales que la gente sí sigue",
      "latam.p4": "Confianza y compliance cambian por país — pegar UX de EE.UU. no funciona",
      "latam.problemTitle": "El problema",
      "latam.sub": "La demanda ya existe. La fricción es idioma, rieles y profundidad local — no el interés.",
      "latam.title": "Por qué LATAM",
      "markets.bullet1": "Tarjetas de mercado en español dentro de la app",
      "markets.bullet2": "Categorías de deportes, macro y política",
      "markets.bullet3": "Ejemplos etiquetados — no odds en vivo",
      "markets.catMacro": "Macro",
      "markets.catPolitics": "Política",
      "markets.catSports": "Fútbol",
      "markets.eyebrow": "Ilustrativo · no en vivo",
      "markets.login": "Entrar",
      "markets.m1count": "3 mercados",
      "markets.m1o1": "Brasil",
      "markets.m1o2": "Argentina",
      "markets.m1o3": "Otro",
      "markets.m1q": "¿Ganador Copa América 2028?",
      "markets.m1vol": "$184k vol",
      "markets.m2count": "1 mercado",
      "markets.m2q": "¿La inflación de Argentina se mantiene sobre 30% interanual hasta 2027?",
      "markets.m2vol": "$295k vol",
      "markets.m3count": "2 mercados",
      "markets.m3q": "¿La coalición gobernante de México retiene la presidencia en 2030?",
      "markets.m3vol": "$128k vol",
      "markets.navLive": "En vivo",
      "markets.navPredict": "Predecir",
      "markets.navSearch": "Buscar",
      "markets.navSocial": "Social",
      "markets.no": "No",
      "markets.note": "Layouts ilustrativos para contar la historia. No son mercados negociables ni reflejan odds o liquidez reales.",
      "markets.signup": "Registrarse",
      "markets.sub": "Fútbol, inflación, elecciones — las preguntas que ya se discuten en español y portugués. Los porcentajes son UI de ejemplo.",
      "markets.tabMacro": "Macro",
      "markets.tabPolitics": "Política",
      "markets.tabSports": "Deportes",
      "markets.tabTrending": "Tendencias",
      "markets.title": "Vista del producto",
      "markets.yes": "Sí",
      "nav.cta": "Comprar $MERLAT",
      "nav.faq": "FAQ",
      "nav.funds": "Uso de fondos",
      "nav.how": "Cómo funciona",
      "nav.latam": "Por qué LATAM",
      "nav.markets": "Mercados",
      "nav.raise": "La ronda",
      "nav.roadmap": "Hoja de ruta",
      "nav.token": "Token",
      "raise.eyebrow": "Ronda comunitaria · pump.fun",
      "raise.honest": "No afirmamos licencia cerrada, operación con dinero real en Brasil, ni partnerships que no hayamos firmado. El capital financia el build.",
      "raise.soft": "Meta suave de la ronda",
      "raise.sub": "Meta suave: $50K–$100K USD. Suficiente para shippear producto, no teatro.",
      "raise.title": "La ronda",
      "raise.usd": "USD · ronda comunitaria vía pump.fun",
      "raise.w1": "Los prediction markets son mainstream — LATAM sigue desatendido",
      "raise.w2": "Los traders de memecoins quieren una tesis más allá del “number go up”",
      "raise.w3": "Una ronda chica mantiene foco en MVP + compliance, no en quemar caja",
      "raise.whyTitle": "Por qué ahora",
      "roadmap.eyebrow": "6–12 meses",
      "roadmap.p1d": "Este sitio, canales de comunidad, ronda en pump.fun, tesis clara para traders.",
      "roadmap.p1phase": "Ahora",
      "roadmap.p1t": "Landing + token",
      "roadmap.p2d": "Crecer holders y contribuidores LATAM; reunir ideas de mercados; abrir waitlist.",
      "roadmap.p2phase": "Siguiente",
      "roadmap.p2t": "Comunidad",
      "roadmap.p3d": "Shippear un MVP acotado — modo paper/play o producto temprano — para que la gente sienta Merlat antes de rieles completos.",
      "roadmap.p3phase": "MVP",
      "roadmap.p3t": "Waitlist / play o producto temprano",
      "roadmap.p4d": "Revisión legal por jurisdicción; explorar rieles locales. Sin afirmar ops con dinero real licenciadas hasta que sea verdad.",
      "roadmap.p4phase": "Track",
      "roadmap.p4t": "Pagos y compliance",
      "roadmap.p5d": "Catálogo más profundo, track PT-first Brasil donde esté permitido, utilidades del token en vivo según etiquetas.",
      "roadmap.p5phase": "Después",
      "roadmap.p5t": "Expansión",
      "roadmap.sub": "Secuencia sensata. Las fechas son objetivos, no garantías.",
      "roadmap.title": "Hoja de ruta",
      "token.contract": "Contrato",
      "token.eyebrow": "$MERLAT · utilidades serias",
      "token.honestBody": "Al lanzar el token en pump.fun, $MERLAT es principalmente un token de fundraising + coordinación comunitaria. Las utilidades de producto (descuento de fees, gobernanza, staking/fee share) están en roadmap, no vivas el día uno. Etiquetaremos qué se entrega en cada hito. Comprar el token es especulativo y riesgoso.",
      "token.honestTitle": "Honestidad día 1",
      "token.planned": "Planificado",
      "token.roadmap": "Roadmap",
      "token.sub": "Sin moon-speak. Para qué sirve el token — y qué se entrega cuándo.",
      "token.title": "Utilidad del token",
      "token.u1d": "Mantén o stakea $MERLAT para reducir fees de trading / payout en mercados Merlat. Los tiers exactos se publican con el lanzamiento del producto.",
      "token.u1t": "Descuento de fees",
      "token.u2d": "Señalar categorías de mercados, parámetros de fees y prioridades de roadmap. No es promesa de control tipo valor mobiliario — gobernanza de producto.",
      "token.u2t": "Gobernanza / voto",
      "token.u3d": "Explorar staking y/o una porción de fees del protocolo para holders de largo plazo — sujeto a revisión legal y reglas por jurisdicción.",
      "token.u3t": "Staking o fee share",
      "trust.eyebrow": "Confianza y postura de seguridad",
      "trust.t1d": "Sin TVL, licencias ni partnerships inventados. Solo meta suave.",
      "trust.t1t": "Sin claims falsos",
      "trust.t2d": "25% de los fondos reservados para revisión legal / compliance por jurisdicción.",
      "trust.t2t": "Track de compliance",
      "trust.t3d": "Planificado vs roadmap claramente marcado. Día 1 = fundraising + coordinación.",
      "trust.t3t": "Utilidades etiquetadas",
      "trust.title": "Honestos antes de ser grandes",
    },
  };

  function getStoredLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === "en" || v === "es") return v;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      // App mock = LATAM product UI: always Spanish, even on EN page
      if (el.closest(".app-mock")) return;
      var key = el.getAttribute("data-i18n");
      if (!key || dict[key] == null) return;
      var text = dict[key];

      if (key === "raise.sub" && lang === "en") {
        el.innerHTML = "Soft goal: <strong>$50K–$100K USD</strong>. Enough to ship product, not theater.";
      } else if (key === "raise.sub" && lang === "es") {
        el.innerHTML = "Meta suave: <strong>$50K–$100K USD</strong>. Suficiente para shippear producto, no teatro.";
      } else if (key === "token.honestBody" && lang === "en") {
        el.innerHTML = "At token launch on pump.fun, $MERLAT is primarily a fundraising + community coordination token. Core product utilities (fee discount, governance, staking/fee share) are <strong>roadmap</strong>, not live day one. We will label what ships at each milestone. Buying the token is speculative and risky.";
      } else if (key === "token.honestBody" && lang === "es") {
        el.innerHTML = "Al lanzar el token en pump.fun, $MERLAT es principalmente un token de fundraising + coordinación comunitaria. Las utilidades de producto (descuento de fees, gobernanza, staking/fee share) están en <strong>roadmap</strong>, no vivas el día uno. Etiquetaremos qué se entrega en cada hito. Comprar el token es especulativo y riesgoso.";
      } else if (key.indexOf("footer.d") === 0) {
        var parts = text.split(": ");
        if (parts.length >= 2) {
          el.innerHTML =
            "<strong>" + parts[0] + ":</strong> " + parts.slice(1).join(": ");
        } else {
          el.textContent = text;
        }
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-set-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    storeLang(lang);
  }

  function initNav() {
    var burger = document.getElementById("navBurger");
    var mobile = document.getElementById("mobileNav");
    if (!burger || !mobile) return;

    burger.addEventListener("click", function () {
      var open = mobile.hasAttribute("hidden");
      if (open) {
        mobile.removeAttribute("hidden");
        burger.setAttribute("aria-expanded", "true");
      } else {
        mobile.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
      }
    });

    mobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobile.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initLangToggle() {
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-set-lang"));
      });
    });
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initActiveNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".nav__links a[href^=\"#\"]")
    );
    if (!links.length) return;

    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href").slice(1);
        var el = document.getElementById(id);
        return el ? { id: id, el: el, link: link } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        var on = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }

    var visible = {};
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });
        var bestId = null;
        var bestRatio = 0;
        sections.forEach(function (s) {
          var r = visible[s.id] || 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = s.id;
          }
        });
        if (bestId) setActive(bestId);
      },
      {
        root: null,
        rootMargin: "-28% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach(function (s) {
      observer.observe(s.el);
    });

    // Initial hash / top
    if (location.hash) {
      var hashId = location.hash.slice(1);
      if (sections.some(function (s) { return s.id === hashId; })) {
        setActive(hashId);
      }
    }
  }

  function initReveals() {
    var targets = Array.prototype.slice.call(
      document.querySelectorAll("[data-reveal], [data-reveal-stagger]")
    );
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      targets.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.15,
      }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initMarketRotate() {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll(".app-mock__feed .app-card")
    );
    var signal = document.getElementById("appSignalText");
    if (!cards.length) return;

    // Spanish-only micro-signals (stay Spanish even in EN mode)
    var signals = [
      "Señal · Copa América en tendencia",
      "Señal · Inflación AR en debate",
      "Señal · Política MX 2030 activa",
    ];

    var idx = 0;
    cards.forEach(function (c, i) {
      c.classList.toggle("is-highlight", i === 0);
    });
    if (signal) signal.textContent = signals[0];

    if (prefersReducedMotion() || cards.length < 2) return;

    var running = null;
    var inView = true;

    function tick() {
      idx = (idx + 1) % cards.length;
      cards.forEach(function (c, i) {
        c.classList.toggle("is-highlight", i === idx);
      });
      if (signal) {
        signal.classList.add("is-fading");
        window.setTimeout(function () {
          signal.textContent = signals[idx % signals.length];
          signal.classList.remove("is-fading");
        }, 280);
      }
    }

    function sync() {
      var shouldRun = inView && !document.hidden;
      if (shouldRun && !running) {
        running = window.setInterval(tick, 3500);
      } else if (!shouldRun && running) {
        window.clearInterval(running);
        running = null;
      }
    }

    sync();

    var mock = document.querySelector(".app-mock");
    if (mock && "IntersectionObserver" in window) {
      var vis = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            inView = entry.isIntersecting;
            sync();
          });
        },
        { threshold: 0.1 }
      );
      vis.observe(mock);
    }

    document.addEventListener("visibilitychange", sync);
  }


  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getStoredLang());
    initLangToggle();
    initNav();
    initYear();
    initActiveNav();
    initReveals();
    initMarketRotate();
  });
})();
