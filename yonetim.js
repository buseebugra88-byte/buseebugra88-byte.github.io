/* Buse Buğra — Yönetim paneli
   Değişiklikleri GitHub deposuna (sitenin kendisine) kaydeder.
   Anahtar (token) yalnızca bu tarayıcıda saklanır. */
{
  const e = SITE.esc;
  const $ = s => document.querySelector(s);
  const app = $('#app');
  const DEPO = { sahip: 'buseebugra88-byte', ad: 'buseebugra88-byte.github.io', dal: 'main' };
  const DOSYA = {
    ICERIK: { yol: 'icerik.js', baslik: 'SİTENİN GENEL BİLGİLERİ VE ROMANLAR' },
    YAZILAR: { yol: 'yazilar.js', baslik: 'BLOG YAZILARI' },
    OKUMA: { yol: 'kitaplar.js', baslik: 'OKUMA KÖŞEM: KİTAP YORUMLARI' }
  };
  const KATEGORI = ['Kalemimden', 'Fizyoterapi ve sinir bilimi', 'Yazarlık'];
  const TEMALAR = [['kafe', 'Mum ışığında okuma köşesi'], ['retro', 'Şeker kutusu (retro)'], ['pudra', 'Pudra ve bordo'], ['murekkep', 'Mürekkep ve gül'], ['lavanta', 'Lavanta akşamı'], ['gece', 'Gece mavisi'], ['adacayi', 'Adaçayı ve krem']];

  const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} } };
  const S = { token: ls.get('bb-token'), demo: false, tab: 'yazilar', edit: null, data: {}, sha: {}, kirli: new Set(), mesgul: false };
  const kopya = o => JSON.parse(JSON.stringify(o));
  const bugun = () => new Date().toISOString().slice(0, 10);

  /* ---------- küçük yardımcılar ---------- */
  let tt;
  const bildir = (m, sure = 3200) => { const t = $('#toast'); t.textContent = m; t.style.display = 'block'; clearTimeout(tt); tt = setTimeout(() => t.style.display = 'none', sure); };
  const b64 = s => { const b = new TextEncoder().encode(s); let x = ''; for (let i = 0; i < b.length; i += 0x8000) x += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(x); };
  const unb64 = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g, '')), c => c.charCodeAt(0)));
  const coz = (metin, ad) => { const w = {}; new Function('window', metin)(w); return w[ad]; };
  const yaz = (ad) => `/*\n  ${DOSYA[ad].baslik}\n  Bu dosya Yönetim panelinden (yonetim.html) güncellenir.\n*/\nwindow.${ad} = ${JSON.stringify(S.data[ad], null, 2)};\n`;

  async function api(yol, ayar = {}) {
    const r = await fetch(`https://api.github.com/repos/${DEPO.sahip}/${DEPO.ad}${yol}`, {
      ...ayar, headers: { Authorization: `Bearer ${S.token}`, Accept: 'application/vnd.github+json', ...(ayar.headers || {}) }
    });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(`${r.status}: ${j.message || 'GitHub isteği başarısız'}`); }
    return r.status === 204 ? null : r.json();
  }
  const dosyaOku = async yol => { const j = await api(`/contents/${encodeURI(yol)}?ref=${DEPO.dal}`); return { sha: j.sha, metin: unb64(j.content) }; };
  async function dosyaYaz(yol, icerik64, mesaj) {
    let sha;
    try { sha = (await api(`/contents/${encodeURI(yol)}?ref=${DEPO.dal}`)).sha; } catch (err) { if (!String(err.message).startsWith('404')) throw err; }
    return api(`/contents/${encodeURI(yol)}`, { method: 'PUT', body: JSON.stringify({ message: mesaj, content: icerik64, branch: DEPO.dal, ...(sha ? { sha } : {}) }) });
  }

  /* fotoğrafı küçültüp depoya yükler, sitedeki yolunu döndürür */
  async function fotoYukle(dosya, ad) {
    const img = await new Promise((ok, hata) => { const i = new Image(); i.onload = () => ok(i); i.onerror = hata; i.src = URL.createObjectURL(dosya); });
    const en = 1600, oran = Math.min(1, en / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * oran); c.height = Math.round(img.height * oran);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL('image/jpeg', .85);
    if (S.demo) return dataUrl;
    const yol = `fotograflar/${SITE.slug(ad || 'foto') || 'foto'}-${Date.now().toString(36)}.jpg`;
    bildir('Fotoğraf yükleniyor…', 60000);
    await dosyaYaz(yol, dataUrl.split(',')[1], `Fotoğraf eklendi: ${yol}`);
    bildir('Fotoğraf yüklendi.');
    return yol;
  }
  const fotoSec = () => new Promise(ok => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = () => ok(i.files[0] || null); i.click(); });
  const gorsel = yol => !yol ? '' : yol.startsWith('data:') ? yol : (S.demo ? yol : `https://raw.githubusercontent.com/${DEPO.sahip}/${DEPO.ad}/${DEPO.dal}/${yol}`);

  /* ---------- veri ---------- */
  async function yukle() {
    if (S.demo) {
      S.data = { ICERIK: kopya(window.ICERIK || {}), YAZILAR: kopya(window.YAZILAR || []), OKUMA: kopya(window.OKUMA || { simdi: [], yorumlar: [] }) };
      return;
    }
    for (const ad of Object.keys(DOSYA)) {
      const { metin } = await dosyaOku(DOSYA[ad].yol);
      S.data[ad] = coz(metin, ad);
    }
    S.data.OKUMA = S.data.OKUMA || { simdi: [], yorumlar: [] };
    S.data.OKUMA.yorumlar = S.data.OKUMA.yorumlar || [];
  }
  const degisti = ad => { S.kirli.add(ad); ciz(); };

  async function yayinla() {
    if (!S.kirli.size || S.mesgul) return;
    if (S.demo) { bildir('Önizleme modundasın; değişiklikler kaydedilmez. Giriş yapınca yayınlayabilirsin.'); return; }
    S.mesgul = true; ciz();
    try {
      for (const ad of [...S.kirli]) { await dosyaYaz(DOSYA[ad].yol, b64(yaz(ad)), `Panelden güncellendi: ${DOSYA[ad].yol}`); S.kirli.delete(ad); }
      bildir('Yayınlandı! Site 1-2 dakika içinde güncellenir.', 5000);
    } catch (err) { bildir('Kaydedilemedi: ' + err.message, 8000); }
    S.mesgul = false; ciz();
  }
  addEventListener('beforeunload', ev => { if (S.kirli.size) { ev.preventDefault(); ev.returnValue = ''; } });

  /* ---------- giriş ---------- */
  function girisCiz(hata = '') {
    app.innerHTML = `<div class="login">
      <h1 style="font-size:36px">Yönetim paneli</h1>
      <p class="lead" style="font-size:17px">Yazılarını, kitap yorumlarını ve roman bilgilerini buradan düzenleyip yayınlarsın. Ziyaretçiler bu sayfayı kullanamaz; değişiklik yapmak için sana özel GitHub anahtarı gerekir.</p>
      <details><summary style="cursor:pointer;font-weight:600">Anahtarı nasıl alırım? (bir kez yapılır)</summary>
        <ol style="margin-top:10px">
          <li>github.com'da sağ üstteki profil resmine tıkla, <b>Settings</b>'e gir.</li>
          <li>Sol menünün en altında <b>Developer settings</b> → <b>Personal access tokens</b> → <b>Fine-grained tokens</b> → <b>Generate new token</b>.</li>
          <li>Token name: <b>Site paneli</b>. Expiration: 1 yıl.</li>
          <li>Repository access: <b>Only select repositories</b> → <b>${e(DEPO.ad)}</b>.</li>
          <li>Permissions → Repository permissions → <b>Contents</b>: <b>Read and write</b>.</li>
          <li><b>Generate token</b>'a bas, çıkan anahtarı kopyala ve aşağıya yapıştır.</li>
        </ol></details>
      <form class="f" id="giris">
        <label>GitHub anahtarın<input type="password" id="tok" autocomplete="off" required placeholder="github_pat_…"></label>
        <span class="hint">Anahtar yalnızca bu tarayıcıda saklanır; kimseyle paylaşma.</span>
        ${hata ? `<p class="demo" style="color:var(--indigo)">${e(hata)}</p>` : ''}
        <div class="btns"><button class="btn solid" type="submit">Giriş yap</button><button class="btn ghost" type="button" id="demo">Önizleme modunda dene</button></div>
      </form>
      <a href="index.html" class="hint">Siteye dön</a>
    </div>`;
    $('#giris').onsubmit = async ev => {
      ev.preventDefault(); S.token = $('#tok').value.trim();
      try { await api(''); ls.set('bb-token', S.token); baslat(); }
      catch (err) { S.token = null; girisCiz(err.message.startsWith('404') ? 'Depo bulunamadı ya da anahtarın bu depoya erişimi yok.' : err.message.startsWith('401') ? 'Anahtar geçersiz. Yeniden kopyalayıp dene.' : 'Bağlanılamadı: ' + err.message); }
    };
    $('#demo').onclick = () => { S.demo = true; baslat(); };
  }
  async function baslat() {
    app.innerHTML = '<div class="login"><p class="lead">Yükleniyor…</p></div>';
    try { await yukle(); ciz(); }
    catch (err) { if (!S.demo && /^(401|403)/.test(err.message)) { ls.set('bb-token', null); S.token = null; } girisCiz('Veriler okunamadı: ' + err.message); }
  }

  /* ---------- ana çizim ---------- */
  const SEKME = [['yazilar', 'Yazılar'], ['yorumlar', 'Kitap yorumları'], ['romanlar', 'Romanlar'], ['genel', 'Genel ayarlar']];
  function ciz() {
    app.innerHTML = `<header class="adm-top"><div class="wrap">
        <a class="brand" href="index.html" target="_blank" rel="noopener">Buse Buğra<small>yönetim</small></a>
        ${S.demo ? '<span class="pill warn">Önizleme modu: kaydetmez</span>' : ''}
        <span class="pill ${S.kirli.size ? 'warn' : ''}">${S.kirli.size ? 'Yayınlanmamış değişiklik var' : 'Her şey yayında'}</span>
        <button class="btn solid xs" id="yay" ${!S.kirli.size || S.mesgul ? 'disabled' : ''}>${S.mesgul ? 'Yayınlanıyor…' : 'Değişiklikleri yayınla'}</button>
        <button class="btn ghost xs" id="cik">${S.demo ? 'Giriş yap' : 'Çıkış'}</button>
      </div></header>
      <div class="adm">
        <nav class="tabs" role="tablist">${SEKME.map(([k, t]) => `<button role="tab" data-tab="${k}" aria-selected="${S.tab === k}">${t}</button>`).join('')}</nav>
        <section class="panel" id="pnl"></section>
      </div>`;
    $('#yay').onclick = yayinla;
    $('#cik').onclick = () => { if (S.kirli.size && !confirmBox()) return; ls.set('bb-token', null); location.reload(); };
    app.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { S.tab = b.dataset.tab; S.edit = null; ciz(); });
    ({ yazilar: yazilarCiz, yorumlar: yorumlarCiz, romanlar: romanlarCiz, genel: genelCiz })[S.tab]($('#pnl'));
  }
  const confirmBox = () => { bildir('Önce değişiklikleri yayınla ya da sayfayı yenile.'); return false; };

  /* ---------- yazılar ---------- */
  function yazilarCiz(p) {
    const L = S.data.YAZILAR;
    if (S.edit) return yaziForm(p, S.edit.i);
    p.innerHTML = `<div class="row"><h2>Yazılar</h2><button class="btn solid" id="yeni">Yeni yazı</button></div>
      <ul class="list">${L.map((y, i) => `<li><div><b>${e(y.baslik)}</b><small>${e(y.tarih)} · ${e(y.kategori)}</small></div>
        <div class="acts"><button class="btn ghost xs" data-d="${i}">Düzenle</button><button class="btn ghost xs danger" data-s="${i}">Sil</button></div></li>`).join('') || '<li>Henüz yazı yok.</li>'}</ul>`;
    $('#yeni').onclick = () => { S.edit = { i: -1 }; ciz(); };
    p.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { S.edit = { i: +b.dataset.d }; ciz(); });
    p.querySelectorAll('[data-s]').forEach(b => b.onclick = () => silOnay(b, () => { L.splice(+b.dataset.s, 1); degisti('YAZILAR'); }));
  }
  function silOnay(b, fn) {
    if (b.dataset.onay) return fn();
    b.dataset.onay = 1; b.textContent = 'Emin misin? Sil'; b.style.borderColor = 'var(--indigo)'; b.style.color = 'var(--indigo)';
    setTimeout(() => { if (b.isConnected) { delete b.dataset.onay; b.textContent = 'Sil'; b.style = ''; } }, 4000);
  }
  function metinAraclari(alan, ad) {
    return `<div class="toolbar">
      <button type="button" class="btn ghost xs" data-ek="baslik">Ara başlık</button>
      <button type="button" class="btn ghost xs" data-ek="alinti">Alıntı</button>
      <button type="button" class="btn ghost xs" data-ek="foto">Fotoğraf ekle</button></div>`;
  }
  function araclariBagla(p, ta, adFn) {
    const ekle = s => { const a = ta.selectionStart, b = ta.selectionEnd, v = ta.value; const on = v.slice(0, a).replace(/\s*$/, ''), son = v.slice(b).replace(/^\s*/, ''); ta.value = (on ? on + '\n\n' : '') + s + (son ? '\n\n' + son : ''); ta.focus(); };
    p.querySelectorAll('[data-ek]').forEach(b => b.onclick = async () => {
      const t = b.dataset.ek, sec = ta.value.slice(ta.selectionStart, ta.selectionEnd).trim();
      if (t === 'baslik') ekle('## ' + (sec || 'Ara başlık'));
      if (t === 'alinti') ekle('> ' + (sec || 'Alıntı'));
      if (t === 'foto') { const f = await fotoSec(); if (!f) return; try { const yol = await fotoYukle(f, adFn()); ekle(`![](${yol})`); } catch (err) { bildir('Fotoğraf yüklenemedi: ' + err.message, 6000); } }
    });
  }
  function yaziForm(p, i) {
    const L = S.data.YAZILAR, y = i >= 0 ? L[i] : { baslik: '', tarih: bugun(), kategori: 'Kalemimden', ozet: '', metin: '' };
    const kats = [...new Set([...KATEGORI, ...L.map(x => x.kategori).filter(Boolean)])];
    p.innerHTML = `<div class="row"><h2>${i >= 0 ? 'Yazıyı düzenle' : 'Yeni yazı'}</h2><button class="btn ghost xs" id="geri">Listeye dön</button></div>
      <form class="f" id="fy">
        <label>Başlık<input name="baslik" required value="${e(y.baslik)}"></label>
        <div class="two"><label>Tarih<input type="date" name="tarih" value="${e(y.tarih)}"></label>
          <label>Kategori<input name="kategori" list="kats" value="${e(y.kategori)}"><datalist id="kats">${kats.map(k => `<option value="${e(k)}">`).join('')}</datalist></label></div>
        <label>Yazı ${metinAraclari()}<textarea class="big" name="metin" placeholder="Paragrafların arasında bir boş satır bırak.">${e(y.metin)}</textarea>
          <span class="hint">Şiirlerde dizeleri alt alta yaz, kıtaların arasına bir boş satır bırak.</span></label>
        <label>Özet <span class="hint">(boş bırakırsan ilk cümlelerden oluşur)</span><textarea name="ozet" style="min-height:70px">${e(y.ozet || '')}</textarea></label>
        <details><summary style="cursor:pointer;font-weight:600;color:var(--soft)">Yazının devamı başka yerde mi?</summary>
          <div class="f" style="margin-top:12px"><label>Devamının bağlantısı<input name="devamLink" type="url" value="${e(y.devamLink || '')}" placeholder="https://…"></label>
          <label class="chk"><input type="checkbox" name="devami" ${y.devami ? 'checked' : ''}> Sonuna "Devamı yakında" yaz</label></div></details>
        <div class="btns"><button class="btn solid" type="submit">Kaydet</button><button class="btn ghost" type="button" id="iptal">Vazgeç</button></div>
      </form>`;
    const f = $('#fy');
    araclariBagla(p, f.metin, () => f.baslik.value);
    $('#geri').onclick = $('#iptal').onclick = () => { S.edit = null; ciz(); };
    f.onsubmit = ev => {
      ev.preventDefault();
      const n = { baslik: f.baslik.value.trim(), tarih: f.tarih.value || bugun(), kategori: f.kategori.value.trim() || 'Kalemimden', ozet: f.ozet.value.trim(), metin: f.metin.value.replace(/\r/g, '').trim() };
      if (f.devamLink.value.trim()) n.devamLink = f.devamLink.value.trim();
      if (f.devami.checked) n.devami = 'yakında';
      if (i >= 0) L[i] = n; else L.unshift(n);
      L.sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));
      S.edit = null; degisti('YAZILAR'); bildir('Kaydedildi. Yayınlamak için üstteki butona bas.');
    };
  }

  /* ---------- kitap yorumları ---------- */
  function yorumlarCiz(p) {
    const L = S.data.OKUMA.yorumlar;
    if (S.edit) return yorumForm(p, S.edit.i);
    p.innerHTML = `<div class="row"><h2>Kitap yorumları</h2><button class="btn solid" id="yeni">Yeni yorum</button></div>
      <ul class="list">${L.map((y, i) => `<li><div><b>${e(y.kitap)}</b><small>${e(y.yazar || '')} · ${'★'.repeat(+y.puan || 0)} · ${e(y.oneri || '')}</small></div>
        <div class="acts"><button class="btn ghost xs" data-d="${i}">Düzenle</button><button class="btn ghost xs danger" data-s="${i}">Sil</button></div></li>`).join('') || '<li>Henüz yorum yok. İlkini yazmaya ne dersin?</li>'}</ul>`;
    $('#yeni').onclick = () => { S.edit = { i: -1 }; ciz(); };
    p.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { S.edit = { i: +b.dataset.d }; ciz(); });
    p.querySelectorAll('[data-s]').forEach(b => b.onclick = () => silOnay(b, () => { L.splice(+b.dataset.s, 1); degisti('OKUMA'); }));
  }
  function yorumForm(p, i) {
    const L = S.data.OKUMA.yorumlar, y = i >= 0 ? kopya(L[i]) : { kitap: '', yazar: '', tarih: bugun(), puan: 5, oneri: 'Öneririm', foto: '', alinti: '', metin: '' };
    p.innerHTML = `<div class="row"><h2>${i >= 0 ? 'Yorumu düzenle' : 'Yeni kitap yorumu'}</h2><button class="btn ghost xs" id="geri">Listeye dön</button></div>
      <form class="f" id="fy">
        <div class="two"><label>Kitabın adı<input name="kitap" required value="${e(y.kitap)}"></label><label>Yazarı<input name="yazar" value="${e(y.yazar)}"></label></div>
        <div class="two"><label>Puan<select name="puan">${[5, 4, 3, 2, 1].map(n => `<option value="${n}" ${+y.puan === n ? 'selected' : ''}>${'★'.repeat(n)} (${n})</option>`).join('')}</select></label>
          <label>Önerir miyim?<select name="oneri">${['Öneririm', 'Belki', 'Önermem'].map(o => `<option ${y.oneri === o ? 'selected' : ''}>${o}</option>`).join('')}</select></label>
          <label>Tarih<input type="date" name="tarih" value="${e(y.tarih)}"></label></div>
        <label>Kitabın fotoğrafı<div class="imgrow">${y.foto ? `<img class="thumb" src="${e(gorsel(y.foto))}" alt="">` : '<span class="thumb"></span>'}
          <button type="button" class="btn ghost xs" id="fs">${y.foto ? 'Fotoğrafı değiştir' : 'Fotoğraf yükle'}</button>${y.foto ? '<button type="button" class="btn ghost xs danger" id="fk">Kaldır</button>' : ''}</div></label>
        <label>Kitaptan sevdiğin bir cümle <span class="hint">(isteğe bağlı)</span><input name="alinti" value="${e(y.alinti || '')}"></label>
        <label>Yorumun ${metinAraclari()}<textarea class="big" name="metin">${e(y.metin)}</textarea></label>
        <div class="btns"><button class="btn solid" type="submit">Kaydet</button><button class="btn ghost" type="button" id="iptal">Vazgeç</button></div>
      </form>`;
    const f = $('#fy');
    const durum = () => ({ ...y, kitap: f.kitap.value, yazar: f.yazar.value, puan: +f.puan.value, oneri: f.oneri.value, tarih: f.tarih.value, alinti: f.alinti.value, metin: f.metin.value });
    araclariBagla(p, f.metin, () => f.kitap.value);
    $('#fs').onclick = async () => { const d = await fotoSec(); if (!d) return; try { const yeni = durum(); yeni.foto = await fotoYukle(d, f.kitap.value); Object.assign(y, yeni); yorumForm(p, i); } catch (err) { bildir('Fotoğraf yüklenemedi: ' + err.message, 6000); } };
    if ($('#fk')) $('#fk').onclick = () => { Object.assign(y, durum(), { foto: '' }); yorumForm(p, i); };
    $('#geri').onclick = $('#iptal').onclick = () => { S.edit = null; ciz(); };
    f.onsubmit = ev => {
      ev.preventDefault();
      const n = durum(); n.kitap = n.kitap.trim(); n.yazar = n.yazar.trim(); n.metin = n.metin.replace(/\r/g, '').trim(); n.tarih = n.tarih || bugun();
      if (i >= 0) L[i] = n; else L.unshift(n);
      S.edit = null; degisti('OKUMA'); bildir('Kaydedildi. Yayınlamak için üstteki butona bas.');
    };
  }

  /* ---------- romanlar ---------- */
  function romanlarCiz(p) {
    const L = S.data.ICERIK.romanlar || (S.data.ICERIK.romanlar = []);
    if (S.edit) return romanForm(p, S.edit.i);
    p.innerHTML = `<div class="row"><h2>Romanlar</h2><button class="btn solid" id="yeni">Yeni roman</button></div>
      <ul class="list">${L.map((r, i) => `<li><div class="imgrow">${r.kapak ? `<img class="thumb" style="width:48px" src="${e(gorsel(r.kapak))}" alt="">` : ''}<div><b>${e(r.ad)}</b><small>${e(r.tur)} · ${e(r.durum)}</small></div></div>
        <div class="acts">${i > 0 ? `<button class="btn ghost xs" data-u="${i}" aria-label="Yukarı taşı">↑</button>` : ''}<button class="btn ghost xs" data-d="${i}">Düzenle</button><button class="btn ghost xs danger" data-s="${i}">Sil</button></div></li>`).join('')}</ul>`;
    $('#yeni').onclick = () => { S.edit = { i: -1 }; ciz(); };
    p.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { S.edit = { i: +b.dataset.d }; ciz(); });
    p.querySelectorAll('[data-u]').forEach(b => b.onclick = () => { const k = +b.dataset.u; [L[k - 1], L[k]] = [L[k], L[k - 1]]; degisti('ICERIK'); });
    p.querySelectorAll('[data-s]').forEach(b => b.onclick = () => silOnay(b, () => { L.splice(+b.dataset.s, 1); degisti('ICERIK'); }));
  }
  function romanForm(p, i) {
    const L = S.data.ICERIK.romanlar, r = i >= 0 ? kopya(L[i]) : { ad: '', kapak: '', ilkBolum: '', sarkilar: [], karakterler: '', tur: '', durum: 'Yazılıyor', renk: 'indigo', tanitim: '' };
    p.innerHTML = `<div class="row"><h2>${i >= 0 ? e(r.ad) : 'Yeni roman'}</h2><button class="btn ghost xs" id="geri">Listeye dön</button></div>
      <form class="f" id="fy">
        <div class="two"><label>Romanın adı<input name="ad" required value="${e(r.ad)}"></label><label>Türü<input name="tur" value="${e(r.tur)}"></label></div>
        <div class="two"><label>Durumu<input name="durum" list="durumlar" value="${e(r.durum)}"><datalist id="durumlar"><option value="Yazılıyor"><option value="Tamamlandı"><option value="Tamamlandı, yayınevlerinde"><option value="Yayımlandı"></datalist></label>
          <label>Karakterler<input name="karakterler" value="${e(r.karakterler || '')}"></label></div>
        <label>Tanıtım<textarea name="tanitim">${e(r.tanitim)}</textarea><span class="hint">Romanın sonunu ele vermemeye dikkat et.</span></label>
        <label>Kapak<div class="imgrow">${r.kapak ? `<img class="thumb" src="${e(gorsel(r.kapak))}" alt="">` : '<span class="thumb"></span>'}<button type="button" class="btn ghost xs" id="fs">${r.kapak ? 'Kapağı değiştir' : 'Kapak yükle'}</button></div></label>
        <label>İlk bölüm dosyası <span class="hint">(ör. bolumler/kor-labirent.txt — boşsa "İlk bölümü oku" butonu çıkmaz)</span><input name="ilkBolum" value="${e(r.ilkBolum || '')}"></label>
        <label>Romanın şarkıları <span class="hint">Her satıra bir şarkı: Şarkı adı — Sanatçı</span>
          <textarea class="songs-ed" name="sarkilar" style="min-height:200px">${e((r.sarkilar || []).map(s => `${s.ad} — ${s.sanatci}`).join('\n'))}</textarea></label>
        <div class="btns"><button class="btn solid" type="submit">Kaydet</button><button class="btn ghost" type="button" id="iptal">Vazgeç</button></div>
      </form>`;
    const f = $('#fy');
    const durum = () => ({ ...r, ad: f.ad.value.trim(), tur: f.tur.value.trim(), durum: f.durum.value.trim(), karakterler: f.karakterler.value.trim(), tanitim: f.tanitim.value.trim(), ilkBolum: f.ilkBolum.value.trim(),
      sarkilar: f.sarkilar.value.split('\n').map(s => s.trim()).filter(Boolean).map(s => { const [ad, ...sn] = s.split(/\s+[—–-]\s+/); return { ad: ad.trim(), sanatci: sn.join(' - ').trim() }; }) });
    $('#fs').onclick = async () => { const d = await fotoSec(); if (!d) return; try { const y = durum(); y.kapak = await fotoYukle(d, 'kapak-' + f.ad.value); Object.assign(r, y); romanForm(p, i); } catch (err) { bildir('Kapak yüklenemedi: ' + err.message, 6000); } };
    $('#geri').onclick = $('#iptal').onclick = () => { S.edit = null; ciz(); };
    f.onsubmit = ev => { ev.preventDefault(); const n = durum(); if (i >= 0) L[i] = n; else L.push(n); S.edit = null; degisti('ICERIK'); bildir('Kaydedildi. Yayınlamak için üstteki butona bas.'); };
  }

  /* ---------- genel ---------- */
  function genelCiz(p) {
    const I = S.data.ICERIK;
    p.innerHTML = `<h2>Genel ayarlar</h2>
      <form class="f" id="fy">
        <div class="two"><label>Adın<input name="ad" value="${e(I.ad || '')}"></label><label>Unvanın<input name="unvan" value="${e(I.unvan || '')}"></label></div>
        <label>Renk teması<select name="tema">${TEMALAR.map(([k, t]) => `<option value="${k}" ${I.tema === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <div class="two"><label>E-posta<input type="email" name="eposta" value="${e(I.eposta || '')}"></label>
          <label>Instagram kullanıcı adı<input name="instagram" value="${e(I.instagram || '')}"></label>
          <label>Threads kullanıcı adı<input name="threads" value="${e(I.threads || '')}"></label></div>
        <label>YouTube kanalının bağlantısı<input name="youtube" type="url" value="${e(I.youtube || '')}" placeholder="https://www.youtube.com/@…"></label>
        <label>Şarkılarım <span class="hint">Her satıra bir şarkı: Şarkı adı — YouTube bağlantısı (Hakkımda sayfasında görünür)</span>
          <textarea class="songs-ed" name="sarkilarim" style="min-height:140px" placeholder="Yalnızlığın Valsi — https://youtu.be/…">${e((I.sarkilarim || []).map(s => `${s.ad} — ${s.link}`).join('\n'))}</textarea></label>
        <label>Hakkımda fotoğrafın<div class="imgrow">${I.fotograf ? `<img class="thumb" src="${e(gorsel(I.fotograf))}" alt="">` : '<span class="thumb"></span>'}<button type="button" class="btn ghost xs" id="fs">${I.fotograf ? 'Fotoğrafı değiştir' : 'Fotoğraf yükle'}</button></div></label>
        <fieldset style="border:1px solid var(--line);border-radius:12px;padding:14px 16px;display:grid;gap:8px"><legend style="padding:0 6px;font-weight:600;color:var(--soft);font-size:14px">Sitede görünen uygulamalar</legend>
          ${(I.uygulamalar || []).map((a, k) => `<label class="chk"><input type="checkbox" name="app${k}" ${a.gizli ? '' : 'checked'}> ${e(a.ad)}</label>`).join('')}</fieldset>
        <div class="btns"><button class="btn solid" type="submit">Kaydet</button></div>
      </form>`;
    const f = $('#fy');
    $('#fs').onclick = async () => { const d = await fotoSec(); if (!d) return; try { I.fotograf = await fotoYukle(d, 'buse'); degisti('ICERIK'); } catch (err) { bildir('Fotoğraf yüklenemedi: ' + err.message, 6000); } };
    f.onsubmit = ev => {
      ev.preventDefault();
      ['ad', 'unvan', 'tema', 'eposta', 'instagram', 'threads', 'youtube'].forEach(k => I[k] = f[k].value.trim());
      const eski = Object.fromEntries((I.sarkilarim || []).map(s => [s.link, s]));
      I.sarkilarim = f.sarkilarim.value.split('\n').map(s => s.trim()).filter(Boolean).map(s => { const m = s.match(/^(.*?)\s+[—–-]\s+(https?:\/\/\S+)$/); return m ? { ...(eski[m[2]] || {}), ad: m[1].trim(), link: m[2] } : null; }).filter(Boolean);
      I.instagram = I.instagram.replace(/^@/, ''); I.threads = I.threads.replace(/^@/, '');
      (I.uygulamalar || []).forEach((a, k) => { if (f['app' + k].checked) delete a.gizli; else a.gizli = true; });
      document.documentElement.dataset.tema = I.tema;
      degisti('ICERIK'); bildir('Kaydedildi. Yayınlamak için üstteki butona bas.');
    };
  }

  /* ---------- başla ---------- */
  if (S.token) baslat(); else girisCiz();
}
