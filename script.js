// ===== НАВИГАЦИОННОЕ МЕНЮ =====
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ФИЛЬТРАЦИЯ НОМЕРОВ =====
const filterButtons = document.querySelectorAll('.filter-btn');
const filterItems = document.querySelectorAll('[data-category]');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Удаляем активный класс со всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс на нажатую кнопку
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        filterItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = '';
                item.classList.remove('hidden');
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = '';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            }
        });
    });
});

// ===== ГАЛЕРЕЯ - МОДАЛЬНОЕ ОКНО =====
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.modal-close');
const galleryItems = document.querySelectorAll('.gallery-item');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

let currentImageIndex = 0;
let images = [];

// Собираем все изображения галереи
galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('h3');
    
    images.push({
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent : ''
    });

    item.addEventListener('click', () => {
        openModal(index);
    });
});

function openModal(index) {
    if (!modal) return;
    
    currentImageIndex = index;
    modal.classList.add('active');
    modal.style.display = 'flex';
    updateModalImage();
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function updateModalImage() {
    if (images[currentImageIndex]) {
        modalImg.src = images[currentImageIndex].src;
        modalImg.alt = images[currentImageIndex].alt;
        modalCaption.textContent = images[currentImageIndex].caption;
    }
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModalImage();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalImage();
}

// События для модального окна
if (closeModal) {
    closeModal.addEventListener('click', closeModalFunc);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
}

// Клавиатурная навигация для галереи
document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeModalFunc();
    } else if (e.key === 'ArrowLeft') {
        showPrevImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});

// ===== FAQ АККОРДЕОН =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    }
});

// ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Валидация
        const name = data.name;
        const phone = data.phone;
        const message = data.message;
        
        if (!name || name.trim().length < 2) {
            showNotification('Пожалуйста, введите ваше имя', 'error');
            return;
        }
        
        if (!phone || phone.trim().length < 9) {
            showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            return;
        }
        
        if (!message || message.trim().length < 10) {
            showNotification('Пожалуйста, введите сообщение (минимум 10 символов)', 'error');
            return;
        }
        
        // Имитация отправки формы
        console.log('Отправка данных:', data);
        
        // Показываем уведомление об успехе
        showNotification('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
        
        // Очищаем форму
        contactForm.reset();
    });
}

// ===== КНОПКИ БРОНИРОВАНИЯ =====
// const bookingButtons = document.querySelectorAll('.booking-btn');

// bookingButtons.forEach(button => {
//     button.addEventListener('click', (e) => {
//         e.preventDefault();
//         showNotification('Переход на страницу бронирования... В реальном проекте здесь будет форма бронирования.', 'info');
//     });
// });

// ===== ФУНКЦИЯ УВЕДОМЛЕНИЙ =====
function showNotification(message, type = 'info') {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-size: 1rem;
        line-height: 1.5;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== АНИМАЦИЯ ПРИ ПРОКРУТКЕ =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Наблюдаем за элементами для анимации
const animateElements = document.querySelectorAll('.feature-card, .room-card, .testimonial-card, .service-card, .team-card, .gallery-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== ВАЛИДАЦИЯ ДАТА В ФОРМЕ =====
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (checkinInput && checkoutInput) {
    // Устанавливаем минимальную дату - сегодня
    const today = new Date().toISOString().split('T')[0];
    checkinInput.setAttribute('min', today);
    checkoutInput.setAttribute('min', today);
    
    // При изменении даты заезда, обновляем минимальную дату выезда
    checkinInput.addEventListener('change', () => {
        const checkinDate = new Date(checkinInput.value);
        const nextDay = new Date(checkinDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        checkoutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);
        
        // Если дата выезда раньше новой минимальной, сбрасываем её
        if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
            checkoutInput.value = '';
        }
    });
}

// ===== СКРЫТИЕ/ПОКАЗ НАВИГАЦИИ ПРИ ПРОКРУТКЕ =====
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Прокрутка вниз
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Прокрутка вверх
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 100);
});

// Добавляем transition для navbar
if (navbar) {
    navbar.style.transition = 'transform 0.3s ease';
}

// ===== ПОДСЧЕТ ГОСТЕЙ (можно расширить) =====
const guestsSelect = document.getElementById('guests');

if (guestsSelect) {
    guestsSelect.addEventListener('change', (e) => {
        console.log('Выбрано гостей:', e.target.value);
    });
}

// ===== ЗАГРУЗКА СТРАНИЦЫ =====
window.addEventListener('load', () => {
    console.log('🏖️ Сайт "Иссык-Куль Резорт" загружен успешно!');
    console.log('📞 Контакты: +996 555 123 456');
    console.log('📧 Email: info@issykkul-resort.kg');
});

// ===== ОТСЛЕЖИВАНИЕ КЛИКОВ ПО ТЕЛЕФОНУ И EMAIL =====
document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const type = link.href.startsWith('tel:') ? 'телефон' : 'email';
        console.log(`Клик по ${type}:`, link.href);
    });
});

// ===== LAZY LOADING ДЛЯ ИЗОБРАЖЕНИЙ =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        if (!this.dataset.fallbackUsed) {
            this.dataset.fallbackUsed = 'true';
            // Можно установить placeholder изображение
            console.warn('Ошибка загрузки изображения:', this.src);
        }
    });
});

// ===== CONSOLE ART =====
console.log(`
%c
╔══════════════════════════════════════════╗
║   🏖️  ИССЫК-КУЛЬ РЕЗОРТ 🏖️              ║
║   Добро пожаловать на наш сайт!         ║
║   ────────────────────────────────────  ║
║   📞 +996 555 123 456                   ║
║   📧 info@issykkul-resort.kg            ║
║   📍 Чолпон-Ата, Иссык-Куль             ║
╚══════════════════════════════════════════╝
`, 'color: #0066cc; font-family: monospace; font-size: 12px;');
