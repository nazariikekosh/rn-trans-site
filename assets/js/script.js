// ==========================================================================
// Головний скрипт для сайту RN Trans LLC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ЛОГІКА МОБІЛЬНОГО МЕНЮ (БУРГЕР)
     ========================================================================== */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    // Клік по кнопці гамбургера (відкрити / закрити)
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      document.body.classList.toggle('nav-open');
    });

    // Клік в будь-якому місці екрана повз меню
    document.addEventListener('click', (event) => {
      if (document.body.classList.contains('nav-open')) {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
          document.body.classList.remove('nav-open');
        }
      }
    });

    // Автоматичне закриття меню при кліку на будь-яке навігаційне посилання
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
      });
    });
  }


  /* ==========================================================================
     2. ПЛАВНЕ ПРОЯВЛЕННЯ ЕЛЕМЕНТІВ ПРИ СКРОЛІ (INTERSECTION OBSERVER)
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Спрацьовує, коли 15% секції з'являється у вікні
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');

        const childCards = entry.target.querySelectorAll('.fade-in-load');
        childCards.forEach(card => {
          card.classList.add('animated');
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const containers = document.querySelectorAll('.scroll-animate-container');
  containers.forEach(container => {
    animationObserver.observe(container);
  });


  /* ==========================================================================
     3. ІНІЦІАЛІЗАЦІЯ СЛАЙДЕРА ГАЛЕРЕЇ (SWIPER JS)
     ========================================================================== */
  const swiper = new Swiper('.gallery-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 30 }
    }
  });


  /* ==========================================================================
     4. КОНТРОЛЬ ОНОВЛЕНОГО ПЛАВАЮЧОГО ВІДЖЕТА (WIDGET LOGIC)
     ========================================================================== */
  const widgetContainer = document.querySelector('.floating-contact-widget');
  const widgetMainBtn = document.querySelector('.widget-main-btn');
  const quizTriggerBtn = document.getElementById('open-quiz-trigger');
  const quizModal = document.getElementById('quiz-modal');

  // Перемикання випадаючих месенджерів (нижня кнопка)
  if (widgetMainBtn && widgetContainer) {
    widgetMainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      widgetContainer.classList.toggle('active');
    });

    // Закриваємо вікно месенджерів, якщо клікнули повз віджет
    document.addEventListener('click', () => {
      widgetContainer.classList.remove('active');
    });
  }

  // Клік по окремій кнопці калькулятора (верхня кнопка) -> Відкриває Квіз
  if (quizTriggerBtn && quizModal) {
    quizTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (widgetContainer) widgetContainer.classList.remove('active'); // Ховаємо месенджери

      quizModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Забороняємо скрол сайту під квізом
    });
  }


  /* ==========================================================================
     5. АНІМАЦІЯ ЦИФР (COUNTERS ANIMATION - ПОСТІЙНЕ ОНОВЛЕННЯ З НУЛЯ)
     ========================================================================== */
  const counterValues = document.querySelectorAll('.counter-value');
  const counterSection = document.querySelector('.counters-section');

  const startCounters = () => {
    counterValues.forEach(counter => {
      // Примусово скидаємо лічильники в 0 перед кожним новим стартом анімації
      counter.innerText = "0";

      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const speed = target > 1000 ? Math.ceil(target / 40) : 1;

        if (count < target) {
          counter.innerText = count + speed > target ? target : count + speed;
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  // Постійне відстеження: запускаємо лічильники щоразу, коли блок з'являється у полі зору
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters();
      }
    });
  }, { threshold: 0.2 });

  if (counterSection) counterObserver.observe(counterSection);


  /* ==========================================================================
     6. РОБОТА ІНТЕРАКТИВНОГО КВІЗУ (QUIZ FORM LOGIC)
     ========================================================================== */
  const quizCloseBtn = document.querySelector('.quiz-close-btn');
  const quizSteps = document.querySelectorAll('.quiz-step');
  const progressBar = document.getElementById('quiz-progress');
  const quizForm = document.getElementById('rn-quiz-form');

  let currentStep = 1;
  const totalSteps = quizSteps.length;

  // Функція оновлення інтерфейсу квізу (кроки + прогрес)
  const updateQuizState = (step) => {
    quizSteps.forEach(s => s.classList.remove('active'));

    const activeStepEl = document.querySelector(`.quiz-step[data-step="${step}"]`);
    if (activeStepEl) activeStepEl.classList.add('active');

    const progressPercentage = (step / totalSteps) * 100;
    if (progressBar) progressBar.style.width = `${progressPercentage}%`;
  };

  // Закриття квізу (хрестик або клік по фону)
  if (quizModal) {
    if (quizCloseBtn) {
      quizCloseBtn.addEventListener('click', () => {
        quizModal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    quizModal.addEventListener('click', (e) => {
      if (e.target === quizModal) {
        quizModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Кнопки "Далі"
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateQuizState(currentStep);
      }
    });
  });

  // Кнопки "Назад"
  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateQuizState(currentStep);
      }
    });
  });

  // Фінальна відправка даних форми квізу
  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(quizForm);
      const quizResults = {
        carType: formData.get('car_type'),
        routeFrom: formData.get('route_from'),
        messenger: formData.get('preferred_messenger'),
        phone: formData.get('client_phone')
      };

      console.log('Дані квізу успішно зібрано:', quizResults);

      // Вікно успіху (сюди потім підключиш свій PHP або Telegram webhook)
      alert(`Дякуємо! Заявку прийнято.\nПрорахунок для авто "${quizResults.carType}" з країни "${quizResults.routeFrom}" буде надіслано на номер ${quizResults.phone} у ${quizResults.messenger}.`);

      // Повне скидання квізу у початковий стан після успішної відправки
      quizForm.reset();
      currentStep = 1;
      updateQuizState(1);
      if (quizModal) quizModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

});