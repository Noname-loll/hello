document.addEventListener('DOMContentLoaded', function() {
    const screens = document.querySelectorAll('.screen');
    const dateInput = document.getElementById('dateInput');
    const connectBtn = document.getElementById('connectBtn');
    const errorMsg = document.getElementById('errorMsg');
    const fisherShadow = document.getElementById('fisher-shadow');
    
    // Правильная дата (ЗАМЕНИТЕ на настоящую дату рождения в формате ДДММГОДГ)
    const correctDate = '19032005';
    
    let currentScreen = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let mobileNav = null;

    function init() {
        showScreen(0);
        setupScrollHandlers();
        setupTouchHandlers();
        
        console.log('Всего экранов:', screens.length);
    }
    
    function showScreen(index) {
        if (index < 0 || index >= screens.length) return;
        
        screens.forEach((screen, i) => {
            screen.classList.toggle('active', i === index);
        });
        currentScreen = index;
        
        // Показываем навигацию только НЕ на первом экране
        if (mobileNav) {
            if (index === 0) {
                mobileNav.style.display = 'none';
            } else {
                mobileNav.style.display = 'flex';
            }
        }
        
        // Особые действия для определенных экранов
        if (index === 4) {
            setTimeout(() => {
                if (fisherShadow) fisherShadow.classList.add('active');
            }, 2000);
        }
        
        console.log('Переключено на экран:', index);
        updateNavDots();
    }
    
    function nextScreen() {
        if (currentScreen < screens.length - 1) {
            showScreen(currentScreen + 1);
        }
    }
    
    function prevScreen() {
        if (currentScreen > 0) {
            showScreen(currentScreen - 1);
        }
    }
    
    function setupScrollHandlers() {
        let scrollTimeout;
        
        window.addEventListener('wheel', function(e) {
            if (isScrolling || currentScreen === 0) return;
            
            clearTimeout(scrollTimeout);
            
            // Более чувствительный скролл
            if (e.deltaY > 50) { // Скролл вниз
                nextScreen();
                isScrolling = true;
            } else if (e.deltaY < -50) { // Скролл вверх
                prevScreen();
                isScrolling = true;
            }
            
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800);
        }, { passive: true });
        
        // Навигация клавишами (только не на первом экране)
        document.addEventListener('keydown', function(e) {
            if (currentScreen === 0) return;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
                nextScreen();
                e.preventDefault();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                prevScreen();
                e.preventDefault();
            }
        });
    }
    
    function setupTouchHandlers() {
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (isScrolling || currentScreen === 0) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Чувствительность для свайпов
            if (diff > 50) { // Свайп вверх
                nextScreen();
            } else if (diff < -50) { // Свайп вниз
                prevScreen();
            }
        }, { passive: true });
    }
    
    // Обработчик кнопки подключения
    connectBtn.addEventListener('click', function() {
        const enteredDate = dateInput.value.trim();
        
        if (enteredDate === correctDate) {
            showScreen(1);
            // Создаем навигацию только после успешного входа
            if (!mobileNav) {
                createMobileNav();
            }
        } else {
            errorMsg.textContent = "> ОШИБКА: НЕВЕРНЫЙ КЛЮЧ ДОСТУПА";
            errorMsg.style.display = 'block';
            
            dateInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                dateInput.style.animation = '';
            }, 500);
        }
    });
    
    // Также разрешаем ввод по Enter
    dateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            connectBtn.click();
        }
    });
    
    function createMobileNav() {
        const navHTML = `
            <div class="mobile-nav">
                <button class="nav-btn prev-btn">↑</button>
                <div class="nav-dots"></div>
                <button class="nav-btn next-btn">↓</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', navHTML);
        
        mobileNav = document.querySelector('.mobile-nav');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.nav-dots');
        
        // Создаем точки-индикаторы
        for (let i = 1; i < screens.length; i++) { // Начинаем с 1, пропускаем экран входа
            const dot = document.createElement('span');
            dot.className = `nav-dot ${i === 1 ? 'active' : ''}`;
            dot.addEventListener('click', () => showScreen(i));
            dotsContainer.appendChild(dot);
        }
        
        prevBtn.addEventListener('click', prevScreen);
        nextBtn.addEventListener('click', nextScreen);
        
        updateNavDots();
    }
    
    function updateNavDots() {
        if (!mobileNav) return;
        
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, i) => {
            // i соответствует экрану i+1 (потому что пропускаем экран 0)
            dot.classList.toggle('active', (i + 1) === currentScreen);
        });
    }
    
    init();
});
