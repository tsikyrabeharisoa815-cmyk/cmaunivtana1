// ===================================================================
// CMA — comportements partagés du site
// ===================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---------- Moteur de recherche du site ---------- */
  // Index simple : chaque rubrique du site avec des mots-clés.
  var SEARCH_INDEX = [
    { title: "Accueil", url: "index.html", section: "Site", keywords: "accueil bienvenue cma centre multimedia audiovisuel universite antananarivo" },
    { title: "Présentation du CMA", url: "presentation.html", section: "Présentation", keywords: "presentation histoire equipe locaux studio centre multimedia audiovisuel qui sommes nous" },
    { title: "Nos missions", url: "missions.html", section: "Missions", keywords: "missions objectifs formation production diffusion accompagnement numerique" },
    { title: "Actualités", url: "actualites.html", section: "Actualités", keywords: "actualites news evenements annonces communiques" },
    { title: "Formations", url: "formations.html", section: "Formations", keywords: "formations ateliers montage video prise de son animation radio journalisme" },
    { title: "Radio et TV universitaires", url: "radio-tv.html", section: "Radio & TV", keywords: "radio tv universitaire direct programme grille antenne emission" },
    { title: "Galerie photos et vidéos", url: "galerie.html", section: "Galerie", keywords: "galerie photos videos reportages images tournage" },
    { title: "Partenaires", url: "partenaires.html", section: "Partenaires", keywords: "partenaires collaborations institutions sponsors" },
    { title: "Contact", url: "contact.html", section: "Contact", keywords: "contact adresse email telephone formulaire localisation" }
  ];

  var searchInput = document.getElementById('site-search');
  var searchResults = document.getElementById('search-results');

  function renderResults(query) {
    if (!searchResults) return;
    var q = query.trim().toLowerCase();
    if (!q) { searchResults.classList.remove('open'); searchResults.innerHTML = ''; return; }

    var matches = SEARCH_INDEX.filter(function (item) {
      return (item.title + ' ' + item.keywords).toLowerCase().indexOf(q) !== -1;
    });

    if (matches.length === 0) {
      searchResults.innerHTML = '<div class="empty">Aucun résultat pour « ' + escapeHtml(query) + ' ».</div>';
    } else {
      searchResults.innerHTML = matches.map(function (m) {
        return '<a href="' + m.url + '"><span class="r-eyebrow">' + m.section + '</span><span class="r-title">' + m.title + '</span></a>';
      }).join('');
    }
    searchResults.classList.add('open');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) { renderResults(e.target.value); });
    searchInput.addEventListener('focus', function (e) { if (e.target.value) renderResults(e.target.value); });
    document.addEventListener('click', function (e) {
      if (searchResults && !searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.classList.remove('open');
      }
    });
  }

  var searchForm = document.getElementById('site-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      renderResults(searchInput.value);
    });
  }

  /* ---------- Galerie : filtres + lightbox ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function (item) {
        var type = item.getAttribute('data-type');
        item.style.display = (filter === 'all' || filter === type) ? 'flex' : 'none';
      });
    });
  });

  var lightbox = document.getElementById('lightbox');
  var lightboxTitle = document.getElementById('lightbox-title');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxMediaWrap = document.getElementById('lightbox-media-wrap');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      if (!lightbox) return;
      lightboxTitle.textContent = item.getAttribute('data-title') || '';
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';

      if (lightboxMediaWrap) {
        lightboxMediaWrap.innerHTML = '';
        var mediaType = item.getAttribute('data-media-type');
        var mediaSrc = item.getAttribute('data-media');
        if (mediaType === 'video' && mediaSrc) {
          var video = document.createElement('video');
          video.className = 'lightbox-media';
          video.controls = true;
          var poster = item.getAttribute('data-poster');
          if (poster) video.poster = poster;
          var source = document.createElement('source');
          source.src = mediaSrc;
          source.type = 'video/mp4';
          video.appendChild(source);
          lightboxMediaWrap.appendChild(video);
        } else if (mediaType === 'image' && mediaSrc) {
          var img = document.createElement('img');
          img.className = 'lightbox-media';
          img.src = mediaSrc;
          img.alt = item.getAttribute('data-title') || '';
          lightboxMediaWrap.appendChild(img);
        }
      }

      lightbox.classList.add('open');
    });
  });
  var lightboxClose = document.querySelector('.lightbox-close');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', function () {
      lightbox.classList.remove('open');
      if (lightboxMediaWrap) lightboxMediaWrap.innerHTML = '';
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        if (lightboxMediaWrap) lightboxMediaWrap.innerHTML = '';
      }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox) {
      lightbox.classList.remove('open');
      if (lightboxMediaWrap) lightboxMediaWrap.innerHTML = '';
    }
  });

  /* ---------- Formulaire de contact ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var name = document.getElementById('c-name').value.trim();
      var email = document.getElementById('c-email').value.trim();
      var message = document.getElementById('c-message').value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.className = 'form-status err';
        status.textContent = "Merci de renseigner votre nom, un e-mail valide et un message.";
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…'; }

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            status.className = 'form-status ok';
            status.textContent = "Merci " + name + ", votre message a bien été envoyé au CMA.";
            contactForm.reset();
          } else {
            status.className = 'form-status err';
            status.textContent = "L'envoi a échoué. Vérifiez que le formulaire est bien relié à un service d'envoi (voir la note ci-dessous), ou réessayez plus tard.";
          }
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = "L'envoi a échoué (connexion). Réessayez plus tard.";
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer le message'; }
        });
    });
  }

  /* ---------- Lecteur en direct : bascule YouTube / Podcast ---------- */
  var liveTabs = document.querySelectorAll('.live-tab');
  if (liveTabs.length) {
    function loadFrameIframe(frame) {
      if (!frame) return;
      var iframe = frame.querySelector('iframe[data-src]');
      if (iframe && !iframe.getAttribute('src')) {
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
      }
    }

    // Charge la source de l'onglet actif au chargement de la page (lazy-load)
    loadFrameIframe(document.querySelector('.live-frame.active'));

    liveTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        liveTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var source = tab.getAttribute('data-source');
        document.querySelectorAll('.live-frame').forEach(function (frame) {
          frame.classList.remove('active');
        });
        var targetFrame = document.getElementById('live-' + source);
        if (targetFrame) {
          loadFrameIframe(targetFrame);
          targetFrame.classList.add('active');
        }
      });
    });
  }

  /* ---------- Carrousel actualités ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var dotsWrap = carousel.querySelector('[data-carousel-dots]');
    var prevBtn = carousel.querySelector('.carousel-arrow.prev');
    var nextBtn = carousel.querySelector('.carousel-arrow.next');
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    // Génère les points de navigation
    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Aller à l\'actualité ' + (i + 1));
      dot.addEventListener('click', function () {
        slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function scrollByOne(direction) {
      var slideWidth = slides[0].getBoundingClientRect().width + 20; // + gap
      track.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByOne(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByOne(1); });

    // Suivi de la diapositive active pour les points, via IntersectionObserver
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var index = slides.indexOf(entry.target);
            dots.forEach(function (d) { d.classList.remove('active'); });
            if (dots[index]) dots[index].classList.add('active');
          }
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach(function (slide) { observer.observe(slide); });
    }
  });


  /* ---------- Carrousel actualités ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var dotsWrap = carousel.querySelector('[data-carousel-dots]');
    var prevBtn = carousel.querySelector('.carousel-arrow.prev');
    var nextBtn = carousel.querySelector('.carousel-arrow.next');
    if (!track || !slides.length) return;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', "Aller à l'actualité " + (i + 1));
      dot.addEventListener('click', function () {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    function setActiveDot() {
      var trackRect = track.getBoundingClientRect();
      var closestIndex = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var dist = Math.abs(slide.getBoundingClientRect().left - trackRect.left);
        if (dist < closestDist) { closestDist = dist; closestIndex = i; }
      });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === closestIndex); });
    }

    function scrollByAmount(dir) {
      var slideWidth = slides[0].getBoundingClientRect().width + 20;
      track.scrollBy({ left: dir * slideWidth, behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByAmount(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByAmount(1); });

    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(setActiveDot, 100);
    });

    setActiveDot();

    // Défilement automatique (si data-autoplay="<ms>" est présent)
    var autoplayDelay = parseInt(carousel.getAttribute('data-autoplay'), 10);
    if (autoplayDelay > 0) {
      var autoplayTimer;

      function tick() {
        var maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 5) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollByAmount(1);
        }
      }

      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(tick, autoplayDelay);
      }
      function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
      }

      startAutoplay();
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
      carousel.addEventListener('touchend', startAutoplay, { passive: true });
    }
  });

});
