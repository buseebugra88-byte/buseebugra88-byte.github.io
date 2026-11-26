/*
  OKUMA KÖŞEM

  1) ŞU AN OKUDUKLARIM
     Okumaya başladığın kitabı "simdi" listesine ekle, bitirince oradan sil.
     sayfa / toplam yazarsan altında küçük bir ilerleme çubuğu çıkar (istemezsen boş bırak).

  2) KİTAP YORUMLARI
     Yeni yorum eklemek için "yorumlar" listesinin [ hemen altına şu kalıbı kopyala ve doldur:

    {
      kitap: "Kitabın adı",
      yazar: "Yazarı",
      tarih: "2026-11-26",
      puan: 4,                         ← 1 ile 5 arası
      oneri: "Öneririm",               ← "Öneririm", "Belki" ya da "Önermem"
      foto: "fotograflar/kitap.jpg",   ← kendi çektiğin fotoğraf (yoksa "" bırak)
      alinti: "",                      ← kitaptan sevdiğin kısa bir cümle (isteğe bağlı)
      metin: `Yorumun buraya.

Paragraflar arasında bir boş satır bırak.`
    },

  Fotoğrafı "fotograflar" klasörüne yükle, adını foto satırına yaz.
  En yeni yorum en üstte olsun diye yenileri listenin başına ekle.
*/
window.OKUMA = {
  simdi: [],

  yorumlar: [
  ]
};
