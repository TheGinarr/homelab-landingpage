/* Augenzwinkernder Cookie-Hinweis. Beide Buttons tun dasselbe: zur Kenntnis nehmen.
   Gemerkt wird das im localStorage (Schlüssel "site-hinweis") – ja, die Ironie ist bekannt. */
"use strict";
(function () {
  const KEY = "site-hinweis";
  try { if (localStorage.getItem(KEY) === "1") return; } catch (e) {}
  function zeigen() {
    const box = document.createElement("section");
    box.className = "keks";
    box.setAttribute("aria-label", "Cookie-Hinweis");
    box.innerHTML =
      '<p><span aria-hidden="true">🍪 </span>Diese Website verwendet ausschließlich amtlich notwendige Cookies ' +
      '(genau keins – höchstens backt Cloudflare eins gegen Bots). <a href="datenschutz.html#cookies">Die Details</a></p>' +
      '<div class="keks-actions"><button class="button primary" type="button">Zur Kenntnis genommen</button>' +
      '<button class="button" type="button">Ebenfalls zur Kenntnis genommen</button></div>';
    box.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      document.body.classList.remove("has-keks");
      box.remove();
    }));
    document.body.appendChild(box);
    document.body.classList.add("has-keks");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", zeigen); else zeigen();
})();
