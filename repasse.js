// Repasse do link curto no GitHub Pages (decisão 18). JS puro de navegador: sem import, sem dependência.
// O teste (scripts/test-repasse.ts) importa ESTA função e confere que urlWhatsApp/fraseComCodigo daqui
// dão a mesma saída das de lib/mensagem.

// Mesmo alfabeto de lib/mensagem/codigo.ts (sem 0/O/1/l/I), 7 caracteres.
var ALFABETO_CODIGO = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

function codigoValido(s) {
  if (typeof s !== "string" || s.length !== 7) return false;
  for (var i = 0; i < s.length; i++) if (ALFABETO_CODIGO.indexOf(s.charAt(i)) < 0) return false;
  return true;
}

function fraseComCodigo(frase, codigo) {
  return codigo ? frase + " #S-" + codigo : frase;
}

function urlWhatsApp(numero, texto) {
  return "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto);
}

/**
 * @param {string} caminho  ex.: "/x7K2pQa"
 * @param {{ servidor: string | null, numero: string, frase: string }} cfg
 * @returns {string | null}  null = não é um link curto (mostrar o 404 comum)
 */
function destinoDoRepasse(caminho, cfg) {
  if (typeof caminho !== "string" || caminho.charAt(0) !== "/") return null;
  var codigo = caminho.slice(1);
  if (!codigoValido(codigo)) return null;
  if (cfg.servidor) return "https://" + cfg.servidor + "/" + codigo;
  return urlWhatsApp(cfg.numero, fraseComCodigo(cfg.frase, codigo));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { destinoDoRepasse: destinoDoRepasse, urlWhatsApp: urlWhatsApp, fraseComCodigo: fraseComCodigo };
}
