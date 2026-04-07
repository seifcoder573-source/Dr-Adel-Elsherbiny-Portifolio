// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Navigation Menu Toggle
    const navLinks = document.querySelector('.nav-links');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        });
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking
                navLinks.classList.remove('active');
            }
        });
    });

    // Add scroll animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-out');
        observer.observe(section);
    });

    // Language Switching Functionality
    function initializeLanguage() {
        const langToggle = document.querySelector('.lang-toggle');
        const langIcon = langToggle.querySelector('i');

        // Check for saved language preference
        const savedLang = localStorage.getItem('language') || 'en';
        document.documentElement.setAttribute('lang', savedLang);
        document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
        updateLanguageIcon(savedLang);
        translatePage(savedLang);

        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            
            document.documentElement.setAttribute('lang', newLang);
            document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
            localStorage.setItem('language', newLang);
            updateLanguageIcon(newLang);
            translatePage(newLang);
            
            // Add active state animation
            langToggle.classList.add('active');
            setTimeout(() => langToggle.classList.remove('active'), 1000);
        });
    }

    function updateLanguageIcon(lang) {
        const langIcon = document.querySelector('.lang-toggle i');
        langIcon.className = lang === 'en' ? 'fas fa-globe' : 'fas fa-globe-americas';
    }

    function translatePage(lang) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = getTranslation(key, lang);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    function getTranslation(key, lang) {
        const keys = key.split('.');
        let value = translations[lang];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }

    // Timeline Interaction
    function initializeTimeline() {
        const timelinePoints = document.querySelectorAll('.timeline-point');
        const timelineContents = document.querySelectorAll('.timeline-content');
        const timelineContainer = document.querySelector('.timeline-points');

        // Set initial active state
        function setInitialState() {
            timelinePoints[0].classList.add('active');
            timelineContents[0].classList.add('active');
        }

        // Handle point click
        timelinePoints.forEach(point => {
            point.addEventListener('click', () => {
                const year = point.getAttribute('data-year');
                
                // Remove active class from all points and contents
                timelinePoints.forEach(p => p.classList.remove('active'));
                timelineContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked point and corresponding content
                point.classList.add('active');
                document.querySelector(`.timeline-content[data-year="${year}"]`).classList.add('active');
            });
        });

        // Add dragging functionality
        let isDragging = false;
        let startX;

        timelineContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            timelineContainer.classList.add('dragging');
            startX = e.pageX - timelineContainer.offsetLeft;
        });

        timelineContainer.addEventListener('mouseleave', () => {
            isDragging = false;
            timelineContainer.classList.remove('dragging');
        });

        timelineContainer.addEventListener('mouseup', () => {
            isDragging = false;
            timelineContainer.classList.remove('dragging');
        });

        timelineContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const x = e.pageX - timelineContainer.offsetLeft;
            
            // Find the closest point
            const points = Array.from(timelinePoints);
            const closest = points.reduce((prev, curr) => {
                const box = curr.getBoundingClientRect();
                const offset = box.left + (box.width / 2);
                return Math.abs(e.pageX - offset) < Math.abs(e.pageX - prev) ? offset : prev;
            }, Infinity);
            
            const activePoint = points.find(point => {
                const box = point.getBoundingClientRect();
                return closest === box.left + (box.width / 2);
            });
            
            if (activePoint) {
                const year = activePoint.getAttribute('data-year');
                timelinePoints.forEach(p => p.classList.remove('active'));
                timelineContents.forEach(c => c.classList.remove('active'));
                activePoint.classList.add('active');
                document.querySelector(`.timeline-content[data-year="${year}"]`).classList.add('active');
            }
        });

        // Initialize timeline
        setInitialState();
    }

    // Theme Toggle Functionality
    function initializeTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = themeToggle.querySelector('i');

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add active state animation
            themeToggle.classList.add('active');
            setTimeout(() => themeToggle.classList.remove('active'), 1000);
        });

        function updateThemeIcon(theme) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Initialize all components
    initializeTimeline();
    initializeTheme();
    initializeLanguage();
}); 