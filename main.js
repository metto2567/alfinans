// main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("ALFINANS DEBUG: Page Transition Script Loaded (DOMContentLoaded)");
    const body = document.body;

    // Giriş Animasyonu
    // Önceki çıkış durumunu temizle (özellikle bfcache için önemli)
    body.classList.remove('page-exiting');
    // Sayfa yüklendiğinde giriş animasyonunu tetikle
    requestAnimationFrame(() => { // Tarayıcının boyama için hazır olmasını bekle
        body.classList.add('page-loaded');
        console.log("ALFINANS DEBUG: Applied 'page-loaded' class to body.");
    });

    // Animasyon uygulanacak tüm uygun <a> etiketlerini seç
    const linksToAnimate = document.querySelectorAll('a[href]');

    linksToAnimate.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            console.log(`ALFINANS DEBUG: Link clicked. HREF: "${href}"`);

            // Animasyon UYGULANMAYACAK durumlar:
            if (!href || // href değeri yoksa
                href.startsWith('#') || // Sayfa içi anchor ise (#top gibi)
                href.startsWith('mailto:') || // mailto linki ise
                href.startsWith('tel:') || // tel linki ise
                this.getAttribute('target') === '_blank' || // Yeni sekmede açılacaksa (_blank)
                (href.startsWith('http://') || href.startsWith('https://')) && !href.includes(window.location.hostname) // Tam URL ise ve mevcut domaini içermiyorsa (dış link)
            ) {
                console.log("ALFINANS DEBUG: Animation SKIPPED for this link:", href);
                return; // Animasyon yapma, varsayılan link davranışını sürdür
            }

            // Eğer link zaten bulunulan sayfaya işaret ediyorsa (örn: aynı sayfadaki bir linke tekrar tıklama)
            // Bu kontrol, özellikle URL sonunda / olup olmaması gibi durumlar için daha karmaşık olabilir.
            // Şimdilik basit bir kontrol yapıyoruz. Eğer sorun devam ederse bu kısmı daha da geliştirebiliriz.
            if (href === window.location.pathname || href === window.location.href || (window.location.origin + href) === window.location.href) {
                // Eğer link tıklanan sayfanın kendisiyse ve sadece hash değişmiyorsa,
                // animasyon yapmaya gerek yok, özellikle sayfa yeniden yüklenmeyecekse.
                // Ancak, eğer bir şekilde aynı sayfaya link verip sayfanın yeniden yüklenmesi isteniyorsa
                // bu kontrol kaldırılabilir veya ayarlanabilir.
                // Şimdilik, aynı sayfaya giden linkler için de animasyon yapmasına izin verelim, belki bir state değişimi oluyordur.
                // console.log("ALFINANS DEBUG: Clicked on a link to the current page, allowing default behavior for now or could prevent animation:", href);
                // return; // Bu satırı aktif edersen aynı sayfaya linklerde animasyon olmaz.
            }


            e.preventDefault(); // Varsayılan yönlendirmeyi engelle
            console.log("ALFINANS DEBUG: Default link behavior PREVENTED. Applying 'page-exiting' class.");

            body.classList.remove('page-loaded'); // Giriş animasyonu class'ını kaldır
            body.classList.add('page-exiting');   // Çıkış animasyonunu başlat

            setTimeout(() => {
                console.log("ALFINANS DEBUG: Navigating to:", href);
                window.location.href = href; // Animasyon süresi (0.5s) sonunda yönlendir
            }, 500); // Bu süre CSS'deki transition süresiyle (0.5s) eşleşmeli
        });
    });
});

window.addEventListener('pageshow', function(event) {
    // Tarayıcı geri/ileri butonları kullanıldığında (bfcache'den yüklenme durumu)
    if (event.persisted) {
        console.log("ALFINANS DEBUG: Page loaded from bfcache (e.g., back/forward button).");
        const body = document.body;
        body.classList.remove('page-exiting'); // Olası 'page-exiting' class'ını temizle
        requestAnimationFrame(() => { // Giriş animasyonunu tekrar uygula
            body.classList.add('page-loaded');
        });
    }
});

