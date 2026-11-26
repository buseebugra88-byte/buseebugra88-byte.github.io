/* Ortak yardımcılar: metni güvenli yazma ve kapak çizme */
window.SITE = {
  esc: s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  kapak(r, ek = '') {
    const e = SITE.esc;
    if (r.kapak) return `<div class="cover foto ${ek}"><img src="${e(r.kapak)}" alt="${e(r.ad)} kapağı" loading="lazy"></div>`;
    return `<div class="cover ${e(r.renk)} ${ek}"><small>${e(r.tur)}</small><b>${e(r.ad)}</b></div>`;
  },
  slug: s => String(s).toLocaleLowerCase('tr').replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
};

/* Alt bilgiye sosyal medya bağlantıları */
document.addEventListener('DOMContentLoaded', () => {
  const I = window.ICERIK || {}, f = document.querySelector('.foot nav');
  if (!f) return;
  const ekle = (ad, url) => { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = ad; f.appendChild(a); };
  if (I.instagram) ekle('Instagram', 'https://www.instagram.com/' + encodeURIComponent(I.instagram) + '/');
  if (I.threads) ekle('Threads', 'https://www.threads.net/@' + encodeURIComponent(I.threads));
});
