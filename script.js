document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const screens = document.querySelectorAll('.screen');
    const dateInput = document.getElementById('dateInput');
    const connectBtn = document.getElementById('connectBtn');
    const errorMsg = document.getElementById('errorMsg');
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const fisherShadow = document.getElementById('fisher-shadow');
    
    // Правильная дата (замените на реальную дату рождения)
    const correctDate = '19032005';
    
    // Текущий экран
    let currentScreen = 0;
    
    // Инициализация
    function init() {
        // Показать первый экран
        showScreen(0);
        
        // Настройка музыки
        setupMusic();
        
        // Настройка анимаций при скролле
        setupScrollAnimations();
    }
    
    // Показать определенный экран
    function showScreen(index) {
        screens.forEach((screen, i) => {
            screen.classList.toggle('active', i === index);
        });
        currentScreen = index;
        
        // Особые действия для определенных экранов
        if (index === 4) { // Вердикт
            setTimeout(() => {
                fisherShadow.classList.add('active');
            }, 2000);
        }
    }
    
    // Настройка музыки
    function setupMusic() {
        let musicPlaying = false;
        
        musicToggle.addEventListener('click', function() {
            if (musicPlaying) {
                backgroundMusic.pause();
                musicToggle.textContent = '🔇';
            } else {
                backgroundMusic.play().catch(e => {
                    console.log("Автовоспроизведение заблокировано. Нажмите на кнопку для включения звука.");
                });
                musicToggle.textContent = '🔊';
            }
            musicPlaying = !musicPlaying;
        });
    }
    
    // Проверка даты
    connectBtn.addEventListener('click', function() {
        const enteredDate = dateInput.value.trim();
        
        if (enteredDate === correctDate) {
            // Правильная дата - переходим к следующему экрану
            showScreen(1);
            // Прокручиваем к верху
            window.scrollTo(0, 0);
        } else {
            // Неправильная дата - показываем ошибку
            errorMsg.textContent = "> ОШИБКА: НЕВЕРНЫЙ КЛЮЧ ДОСТУПА";
            errorMsg.style.display = 'block';
            
            // Анимация ошибки
            dateInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                dateInput.style.animation = '';
            }, 500);
        }
    });
    
    // Анимация встряски для ошибки
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Навигация между экранами при скролле
    function setupScrollAnimations() {
        let isScrolling = false;
        
        window.addEventListener('wheel', function(e) {
            if (isScrolling) return;
            
            isScrolling = true;
            
            if (e.deltaY > 0 && currentScreen < screens.length - 1) {
                // Скролл вниз - следующий экран
                showScreen(currentScreen + 1);
            } else if (e.deltaY < 0 && currentScreen > 0) {
                // Скролл вверх - предыдущий экран
                showScreen(currentScreen - 1);
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
        
        // Также добавляем навигацию по клавишам
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' && currentScreen < screens.length - 1) {
                showScreen(currentScreen + 1);
                e.preventDefault();
            } else if (e.key === 'ArrowUp' && currentScreen > 0) {
                showScreen(currentScreen - 1);
                e.preventDefault();
            }
        });
    }
    
    // Запуск инициализации
    init();
});
