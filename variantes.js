/* Variantes da página para os anúncios do Google (?u=...).
 *
 * Sem ?u= a página fica como o app desenhou. Com ?u= conhecido:
 * - o botão do WhatsApp 0800 abre com a mensagem daquela campanha
 *   (é assim que o time sabe a unidade e o público sem perguntar);
 * - troca o título, o texto, os dois itens com ✓ e o horário;
 * - esconde "Ligar grátis" e o WhatsApp de parceiro (anúncio é 100% 0800);
 * - o clique no 0800 conta como conversão no Google Ads.
 * Entra na página pelo aplicar-versao-pc.py (<script src="variantes.js">).
 */
(function () {
  // O app roda os scripts da página duas vezes; sem a trava, cada clique
  // mandava a conversão em dobro.
  if (window.__variantesOuroGas) return;
  window.__variantesOuroGas = true;

  // Google Ads: conta 314-303-9797. Vazio = não carrega a tag.
  var TAG_ADS = "AW-18548109725";
  var ROTULO_WHATSAPP = "frUQCKGmyK8dEJ3jtoxF"; // conversão "Clique WhatsApp 0800" (contagem: uma)

  var ZAP = "wa.me/558001151808";

  var HORARIO_GRL = ["7h – 20h", "7h – 12h"];
  var HORARIO_ARA = ["7h – 19h", "8h – 13h"];

  var VARIANTES = {
    grl: {
      mensagem: "Olá! Vi no Google e quero pedir gás em Fortaleza.",
      itens: [null, "Entrega em <strong>até 30 minutos</strong> em Fortaleza."],
      horario: HORARIO_GRL,
    },
    ara: {
      mensagem: "Olá! Vi no Google e quero pedir gás em Aracati.",
      itens: [null, "Entrega em <strong>até 30 minutos</strong> em Aracati, Majorlândia, Canoa Quebrada, Fortim e Icapuí."],
      horario: HORARIO_ARA,
    },
    "emp-grl": {
      mensagem: "[EMPRESA] Olá! Vi no Google e tenho um comércio em Fortaleza. Quero comprar gás.",
      empresa: true,
      titulo: "Gás para o <span>seu negócio</span>",
      texto: "P13 e P45 com entrega para mercantis, restaurantes, padarias e todo comércio de Fortaleza.",
      botao: ["Pedir gás no WhatsApp", "0800 115 1808 · atendimento para empresas"],
      itens: ["<strong>Preço especial</strong> para empresas.", "<strong>Entrega programada</strong> em Fortaleza inteira."],
      horario: HORARIO_GRL,
    },
    "emp-ara": {
      mensagem: "[EMPRESA] Olá! Vi no Google e tenho um comércio na região de Aracati. Quero comprar gás.",
      empresa: true,
      titulo: "Gás para o <span>seu negócio</span>",
      texto: "P13 e P45 com entrega para pousadas, restaurantes, mercantis e comércios de Aracati, Canoa Quebrada, Majorlândia, Fortim, Icapuí, Itaiçaba e Jaguaruana.",
      botao: ["Pedir gás no WhatsApp", "0800 115 1808 · atendimento para empresas"],
      itens: ["<strong>Preço especial</strong> para empresas.", "<strong>Entrega programada</strong> para o seu comércio."],
      horario: HORARIO_ARA,
    },
    p20: {
      mensagem: "[EMPRESA] Olá! Vi no Google e quero gás P20 para empilhadeira.",
      empresa: true,
      titulo: "Gás P20 para <span>empilhadeira</span>",
      tamanhoTitulo: "20px", // "empilhadeira" vaza da coluna em 390 px com 23 px
      texto: "Cilindro P20 com entrega para indústrias e depósitos de Fortaleza e região metropolitana.",
      botao: ["Pedir P20 no WhatsApp", "0800 115 1808 · atendimento para empresas"],
      itens: ["<strong>Entrega programada</strong>: sua operação não para.", "<strong>Preço especial</strong> para empresas."],
      horario: HORARIO_GRL,
    },
    parceiro: {
      mensagem: "[PARCEIRO] Olá! Vi no Google e quero abrir uma revenda de gás com a Ouro Gás.",
      empresa: true,
      titulo: "Abra sua <span>revenda de gás</span>",
      texto: "Seja parceiro do Grupo Ouro Gás. Você entra com a vontade; nós entramos com conhecimento, sistemas, método validado, abastecimento e contabilidade.",
      botao: ["Quero ser parceiro", "Fale com a gente no WhatsApp 0800 115 1808"],
      itens: ["Método que já funciona nas <strong>nossas revendas</strong> no Ceará.", "<strong>Sistemas, abastecimento e contabilidade</strong> do primeiro dia."],
      horario: null,
    },
    "en-ara": {
      mensagem: "[EMPRESA] Hello! I found you on Google and I need gas (P45/P13).",
      empresa: true,
      ingles: true,
      titulo: "Cooking gas <span>delivered to your door</span>",
      texto: "P13 and P45 gas cylinders for pousadas, restaurants and homes in Canoa Quebrada, Majorlândia and Aracati.",
      botao: ["Order on WhatsApp", "0800 115 1808 · no delivery fee"],
      itens: ["<strong>No delivery fee.</strong>", "Delivery in <strong>up to 30 minutes</strong>."],
      horario: HORARIO_ARA,
    },
  };

  var codigo = new URLSearchParams(location.search).get("u");
  // hasOwnProperty: ?u=constructor ou toString não podem virar variante.
  var v = codigo && Object.prototype.hasOwnProperty.call(VARIANTES, codigo.toLowerCase())
    ? VARIANTES[codigo.toLowerCase()] : null;

  if (TAG_ADS) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + TAG_ADS;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", TAG_ADS);
  }

  function linkZap(a) {
    return (a.getAttribute("href") || "").indexOf(ZAP) !== -1;
  }

  // Na hora do clique: mensagem da campanha e conversão. Vale mesmo se o
  // app redesenhar a página depois. Com o gtag.js já carregado, o clique
  // segue normal (o beacon sai mesmo com a página fechando): segurar o
  // toque faz o celular abrir a página do wa.me em vez do app. Só se o
  // gtag.js ainda não chegou a ida espera a conversão, com teto de 800 ms
  // para quem bloqueia o Google não ficar com o botão morto.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || !linkZap(a)) return;
    if (v) a.setAttribute("href", "https://" + ZAP + "?text=" + encodeURIComponent(v.mensagem));
    if (!TAG_ADS || !ROTULO_WHATSAPP || !window.gtag) return;
    if (window.google_tag_manager || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || a.target === "_blank") {
      window.gtag("event", "conversion", { send_to: TAG_ADS + "/" + ROTULO_WHATSAPP, transport_type: "beacon" });
      return;
    }
    e.preventDefault();
    var destino = a.href;
    var foi = false;
    function ir() {
      if (foi) return;
      foi = true;
      location.href = destino;
    }
    window.gtag("event", "conversion", {
      send_to: TAG_ADS + "/" + ROTULO_WHATSAPP,
      transport_type: "beacon",
      event_callback: ir,
    });
    setTimeout(ir, 800);
  }, true);

  if (!v) return;

  // O elemento mais interno cujo texto começa com `texto` (as caixas de
  // fora também começam com ele; o último na ordem do documento é o de dentro).
  function porTexto(seletor, texto) {
    var lista = document.querySelectorAll(seletor);
    var achado = null;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].textContent.trim().indexOf(texto) === 0) achado = lista[i];
    }
    return achado;
  }

  function aplicar() {
    var botao = null;
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) if (linkZap(links[i])) botao = links[i];
    if (!botao || botao.dataset.variante === codigo) return;
    botao.dataset.variante = codigo;
    botao.setAttribute("href", "https://" + ZAP + "?text=" + encodeURIComponent(v.mensagem));

    if (v.botao) {
      var spans = botao.querySelectorAll("span");
      if (spans[0]) spans[0].textContent = v.botao[0];
      if (spans[1]) spans[1].textContent = v.botao[1];
    }

    var titulo = porTexto("div", "Você é beneficiário");
    if (titulo && v.titulo) {
      titulo.innerHTML = v.titulo.replace("<span>", '<span style="color:#D41317">');
      if (v.tamanhoTitulo) titulo.style.fontSize = v.tamanhoTitulo;
      var texto = titulo.nextElementSibling;
      if (texto && v.texto) texto.textContent = v.texto;
    }
    if (v.empresa) {
      var selo = document.querySelector('img[alt="Gás do Povo"]');
      if (selo) selo.style.display = "none";
    }

    var item1 = porTexto("div", "Única revenda");
    var item2 = porTexto("div", "Compartilhe");
    [item1, item2].forEach(function (el, n) {
      if (el && v.itens[n]) el.innerHTML = v.itens[n].replace(/<strong>/g, '<strong style="color:#D41317">');
    });

    var rotulo = porTexto("div", "HORÁRIO DE ATENDIMENTO");
    if (rotulo) {
      var linhas = rotulo.parentElement.children;
      if (!v.horario) {
        rotulo.parentElement.style.display = "none";
      } else {
        for (var k = 1; k < linhas.length && k <= 2; k++) {
          var cel = linhas[k].querySelectorAll("span");
          if (cel[1]) cel[1].textContent = v.horario[k - 1];
          if (v.ingles && cel[0]) cel[0].textContent = k === 1 ? "Monday to Saturday" : "Sundays and holidays";
        }
        if (v.ingles) rotulo.textContent = "OPENING HOURS";
      }
    }

    // Anúncio é 100% WhatsApp 0800: sem ligação e sem o outro WhatsApp.
    for (var j = 0; j < links.length; j++) {
      var h = links[j].getAttribute("href") || "";
      if (h.indexOf("tel:") === 0 || h.indexOf("wa.me/5585994085766") !== -1) links[j].style.display = "none";
    }

    if (v.ingles) {
      var revendas = porTexto("span", "Nossas revendas");
      if (revendas) revendas.textContent = "Our stores";
      var selo2 = porTexto("span", "Distribuidor autorizado");
      if (selo2) selo2.style.display = "none";
      var site = porTexto("span", "Nosso site");
      if (site) site.textContent = "Website";
      var spansMapa = document.querySelectorAll("a span");
      for (var m = 0; m < spansMapa.length; m++) {
        if (spansMapa[m].textContent === "Mapa →") spansMapa[m].textContent = "Map →";
      }
      document.documentElement.lang = "en";
      document.title = "Grupo Ourogás · Gas delivery in Canoa Quebrada and Aracati";
    } else if (v.titulo) {
      document.title = "Grupo Ourogás · " + v.titulo.replace(/<\/?span>/g, "");
    }
  }

  // O app desenha a página depois que este script roda; reaplica enquanto ele
  // monta ou redesenha (o botão marcado evita repetir).
  aplicar();
  var obs = new MutationObserver(function () { aplicar(); });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); }, 10000);
})();
