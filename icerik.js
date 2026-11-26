/*
  SİTENİN METİNLERİ
  Buradaki yazıları değiştirmek için tırnak içindeki metni düzenlemen yeterli.
  Tırnakları (" ") ve virgülleri silmemeye dikkat et.

  KAPAK FOTOĞRAFI EKLEMEK İÇİN:
  1) Fotoğrafı "kapaklar" klasörüne yükle (ör. kapaklar/kor-labirent.jpg)
  2) Aşağıda o romanın kapak satırına dosya adını yaz:  kapak: "kapaklar/kor-labirent.jpg",
  Kapak boş bırakılırsa ("") renkli hazır kapak görünür.

  İLK BÖLÜMÜ EKLEMEK İÇİN:
  1) Bölümün metnini düz yazı (.txt) olarak "bolumler" klasörüne yükle (ör. bolumler/kor-labirent.txt)
     Paragraflar arasında bir boş satır olsun.
  2) O romanın ilkBolum satırına dosya adını yaz:  ilkBolum: "bolumler/kor-labirent.txt",
  Boşken Romanlar sayfasında "İlk bölümü oku" butonu görünmez.

  ŞARKILAR: Her romanın sarkilar listesi Romanlar sayfasında "Romanın şarkıları" olarak görünür.
  Yeni şarkı eklemek için listeye bir satır ekle:  { ad: "Şarkı adı", sanatci: "Sanatçı" },
*/
window.ICERIK = {
  ad: "Buse Buğra",
  unvan: "Yazar ve fizyoterapist",
  eposta: "buseebugra88@gmail.com",
  instagram: "busebugra.author",     /* sadece kullanıcı adı; boş bırakırsan görünmez */
  threads: "busebugra.author",

  /* FOTOĞRAFIN: Hakkımda sayfasında görünür. Fotoğrafı "fotograflar" klasörüne yükleyip adını yaz,
     ör. fotograf: "fotograflar/buse.jpg", — boşken yerinde zarif bir "B" harfi durur. */
  fotograf: "",

  /* RENK TEMASI: aşağıdaki kelimeyi değiştir.
     Seçenekler: "kafe" (mum ışığında okuma köşesi), "retro" (şeker kutusu, kâğıt kesiği), "pudra" (pudra ve bordo), "murekkep" (mürekkep ve gül),
                 "lavanta" (lavanta akşamı), "gece" (gece mavisi), "adacayi" (adaçayı ve krem) */
  tema: "kafe",

  /* UYGULAMALARIM: Fizyoterapi ve Projeler sayfasında kart olarak görünür.
     Bir uygulamayı gizlemek için o bloğu silebilir ya da gizli: true yazabilirsin. */
  uygulamalar: [
    { ad: "Fizyo Seans", grup: "Fizyoterapi ve akademi", ikon: "ikonlar/fizyo.png", adres: "https://buseebugra88-byte.github.io/fizyo-seans/",
      aciklama: "Nörolojik, ortopedik, pediatrik ve kardiyopulmoner durumlar için tedavi programı hazırlama ve seans takibi. Hastaya verilecek ev egzersiz programını yazdırılabilir hâle getirir." },
    { ad: "SPSS Tez Rehberi", grup: "Fizyoterapi ve akademi", ikon: "ikonlar/spss.png", adres: "https://buseebugra88-byte.github.io/spss-tez-rehberi/SPSS-Tez-Rehberi-Claudesuz.html",
      aciklama: "Tez analizlerinde SPSS adımlarını, çıktıların nasıl yorumlanacağını ve teze hazır tablo ile paragrafları adım adım gösteren yardımcı." },
    { ad: "Çalışma Masam", grup: "Fizyoterapi ve akademi", ikon: "ikonlar/calisma.png", adres: "https://buseebugra88-byte.github.io/dijital-kutuphane/calisma.html",
      aciklama: "Ders notları, defterler ve akademik okumalar için sade bir çalışma alanı." },
    { ad: "Yazar Köşem", grup: "Yazarlık ve okuma", ikon: "ikonlar/yazar.png", adres: "https://buseebugra88-byte.github.io/dijital-kutuphane/yazar/",
      aciklama: "Romanlar, karakterler ve fikirler için bir yazı masası: bölümleri, karakter kartlarını ve not kırıntılarını bir arada tutar." },
    { ad: "Dijital Kütüphanem", grup: "Yazarlık ve okuma", ikon: "ikonlar/kutuphane.png", adres: "https://buseebugra88-byte.github.io/dijital-kutuphane/",
      aciklama: "E-kitaplar, PDF'ler ve makaleler için kişisel kütüphane; okuma takibi ve serilere göre raflar." },
    { ad: "Mühürlü Mektuplar", grup: "Yazarlık ve okuma", ikon: "ikonlar/mektup.png", adres: "https://buseebugra88-byte.github.io/dijital-kutuphane/mektup/",
      aciklama: "Mektup yazma hobisi için vintage zarflar ve ilham veren mektup kurguları." },
    { ad: "Yırtık Yaprak", grup: "Yazarlık ve okuma", ikon: "ikonlar/defter.png", adres: "https://buseebugra88-byte.github.io/dijital-kutuphane/defter/",
      aciklama: "Junk journal tadında, kâğıt ve bant dokulu bir not defteri." },
    { ad: "Plak Çalarım", grup: "Gündelik araçlar", ikon: "ikonlar/plak.png", adres: "https://buseebugra88-byte.github.io/VinylFlow/",
      aciklama: "Şarkıları dönen bir plağın üzerinden dinleten, plak çalar görünümlü müzik uygulaması." },
    { ad: "PDF Atölyem", grup: "Gündelik araçlar", ikon: "ikonlar/pdf.png", adres: "https://buseebugra88-byte.github.io/dijital-kutuphane/pdf/",
      aciklama: "PDF dosyalarını birleştirme, düzenleme ve dönüştürme gibi işler için küçük bir atölye." }
  ],

  romanlar: [
    {
      ad: "Kör Labirent",
      kapak: "kapaklar/kor-labirent.jpg",
      ilkBolum: "bolumler/kor-labirent.txt",
      sarkilar: [
        { ad: "Exit Music (For a Film)", sanatci: "Radiohead" },
        { ad: "Teardrop", sanatci: "Massive Attack" },
        { ad: "Time", sanatci: "Hans Zimmer" },
        { ad: "On the Nature of Daylight", sanatci: "Max Richter" },
        { ad: "Saman", sanatci: "Ólafur Arnalds" },
        { ad: "Run Boy Run", sanatci: "Woodkid" },
        { ad: "Youth", sanatci: "Daughter" },
        { ad: "The Scientist", sanatci: "Coldplay" },
        { ad: "Never Let Me Go", sanatci: "Florence + The Machine" },
        { ad: "Holocene", sanatci: "Bon Iver" },
        { ad: "Riverside", sanatci: "Agnes Obel" },
        { ad: "Breathe Me", sanatci: "Sia" }
      ],
      karakterler: "Lyra, Eryx",
      tur: "Psikolojik gerilim",
      durum: "Tamamlandı, yayınevlerinde",
      renk: "indigo",
      tanitim: "Lyra'nın gözünden anlatılan, kat kat derinleşen bir labirentte geçen bir hikâye. Yanında Eryx, önünde cevabı kolay bulunmayan sorular var."
    },
    {
      ad: "Dikilmiş Sessizlik",
      kapak: "kapaklar/dikilmis-sessizlik.jpg",
      ilkBolum: "bolumler/dikilmis-sessizlik.txt",
      sarkilar: [
        { ad: "Red Right Hand", sanatci: "Nick Cave & The Bad Seeds" },
        { ad: "Hurt", sanatci: "Johnny Cash" },
        { ad: "Roads", sanatci: "Portishead" },
        { ad: "Hand Covers Bruise", sanatci: "Trent Reznor & Atticus Ross" },
        { ad: "Angel", sanatci: "Massive Attack" },
        { ad: "Bathroom Dance", sanatci: "Hildur Guðnadóttir" },
        { ad: "Street Spirit (Fade Out)", sanatci: "Radiohead" },
        { ad: "Everybody Wants to Rule the World", sanatci: "Lorde" },
        { ad: "Do I Wanna Know?", sanatci: "Arctic Monkeys" },
        { ad: "Light of the Seven", sanatci: "Ramin Djawadi" },
        { ad: "Feral Love", sanatci: "Chelsea Wolfe" }
      ],
      karakterler: "Doran",
      tur: "Distopik psikolojik suç",
      durum: "Tamamlandı, yayınevlerinde",
      renk: "gece",
      tanitim: "Korkunun yasalardan çok alışkanlıklarla yönettiği bir düzende, sakin ve dikkatli bir dedektif olan Doran bir dizi cinayetin izini sürer."
    },
    {
      ad: "Öksüz Karakter",
      kapak: "kapaklar/oksuz-karakter.jpg",
      ilkBolum: "",
      sarkilar: [
        { ad: "How to Disappear Completely", sanatci: "Radiohead" },
        { ad: "Metamorphosis One", sanatci: "Philip Glass" },
        { ad: "Flight from the City", sanatci: "Jóhann Jóhannsson" },
        { ad: "Brain Damage", sanatci: "Pink Floyd" },
        { ad: "Running Up That Hill", sanatci: "Placebo" },
        { ad: "Says", sanatci: "Nils Frahm" },
        { ad: "Lullaby", sanatci: "The Cure" },
        { ad: "Sing for Absolution", sanatci: "Muse" }
      ],
      karakterler: "Rowan Mercer, Elara Vane",
      tur: "Psikolojik gerilim",
      durum: "Yazılıyor",
      renk: "gul",
      tanitim: "Bir yazar ve yarattığı dedektif. Rowan Mercer'ın romanlarındaki cinayetler kurgunun sınırlarını zorlamaya başladığında, Elara Vane sayfadan taşan bir dosyayla karşılaşır."
    },
    {
      ad: "Between the Notes",
      kapak: "kapaklar/between-the-notes.jpg",
      ilkBolum: "bolumler/between-the-notes.txt",
      sarkilar: [
        { ad: "Nuvole Bianche", sanatci: "Ludovico Einaudi" },
        { ad: "Clair de Lune", sanatci: "Claude Debussy" },
        { ad: "Cello Suite No. 1 – Prelude", sanatci: "J. S. Bach (Yo-Yo Ma)" },
        { ad: "Élégie", sanatci: "Gabriel Fauré" },
        { ad: "Le Cygne", sanatci: "Camille Saint-Saëns" },
        { ad: "Cello Concerto in E minor", sanatci: "Edward Elgar (Jacqueline du Pré)" },
        { ad: "Intermezzo Op. 118 No. 2", sanatci: "Johannes Brahms" },
        { ad: "River Flows in You", sanatci: "Yiruma" },
        { ad: "Near Light", sanatci: "Ólafur Arnalds" },
        { ad: "November", sanatci: "Max Richter" },
        { ad: "Eden", sanatci: "Hania Rani" },
        { ad: "Anchor", sanatci: "Novo Amor" },
        { ad: "With or Without You", sanatci: "2CELLOS" }
      ],
      karakterler: "Aria, Lucien",
      tur: "Romantik",
      durum: "Tamamlandı",
      renk: "lila",
      tanitim: "Bristol'daki köklü müzik okulu St. Aldwyn'de keman çalan Aria, herkesin sakin sandığı ama sahne korkusunu içinde saklayan bir öğrencidir. Çellist Lucien'le yolları kesiştiğinde, notaların arasında kalan sözler duyulmaya başlar."
    },
    {
      ad: "The Way You Catch Me",
      kapak: "kapaklar/the-way-you-catch-me.jpg",
      ilkBolum: "bolumler/the-way-you-catch-me.txt",
      sarkilar: [
        { ad: "Chandelier", sanatci: "Sia" },
        { ad: "Enchanted", sanatci: "Taylor Swift" },
        { ad: "Señorita", sanatci: "Shawn Mendes & Camila Cabello" },
        { ad: "Love Me Like You Do", sanatci: "Ellie Goulding" },
        { ad: "Shallow", sanatci: "Lady Gaga & Bradley Cooper" },
        { ad: "Work Song", sanatci: "Hozier" },
        { ad: "Wings", sanatci: "Birdy" },
        { ad: "Say You Won't Let Go", sanatci: "James Arthur" },
        { ad: "A Thousand Years", sanatci: "Christina Perri" },
        { ad: "Lover", sanatci: "Taylor Swift" },
        { ad: "You Are the Reason", sanatci: "Calum Scott" },
        { ad: "Dog Days Are Over", sanatci: "Florence + The Machine" },
        { ad: "Perfect", sanatci: "Ed Sheeran" }
      ],
      karakterler: "Rosalie Moreau, Rhys Beaumont",
      tur: "Romantik",
      durum: "Tamamlandı",
      renk: "pudra",
      tanitim: "Aerial dansçı Rosalie, altı aylık bir dünya turnesinin eşiğinde kendini koreograf Rhys'le aynı sahnede, sonra da aynı kameraların önünde bulur. Kameralar için başlayan bir rol, ışıklar sönünce de sürebilir mi?"
    }
  ]
};
