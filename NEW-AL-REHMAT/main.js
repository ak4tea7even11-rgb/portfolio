/*
 * AL-REHMAT MEDICOSE - Main JavaScript
 * Dynamic, Advanced, and Interactive Features
 */

document.addEventListener("DOMContentLoaded", () => {
    // Function to load HTML components
    async function loadComponent(selector, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.querySelector(selector).innerHTML = html;
        } catch (error) {
            console.error(`Error loading component from ${filePath}:`, error);
        }
    }
    
    // Load Header and Footer components on all pages
    const currentPath = window.location.pathname;
    let headerPath = './header.html';
    let footerPath = './footer.html';

    // Fix path for nested pages like about.html, services.html etc.
    if (currentPath.split('/').length > 2) {
        headerPath = './header.html';
        footerPath = './footer.html';
    }

    loadComponent('#header-placeholder', headerPath)
        .then(() => {
            const currentUrl = window.location.href.split('/').pop();
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.href.split('/').pop() === currentUrl) {
                    link.classList.add('active');
                }
            });

            setTimeout(setupHeader, 100);
            setTimeout(setupMenu, 100);
        });
    
    loadComponent('#footer-placeholder', footerPath);


    // Scroll Animation for elements
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));


    // Header Shrink/Color on Scroll
    function setupHeader() {
        const header = document.querySelector('.site-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }
    
    // Mobile Menu Toggle
    function setupMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navList.classList.toggle('active');
            });
        }
    }

    // Interactive 3D Tilt Effect on Cards (Advanced)
    const tiltElements = document.querySelectorAll('.tilt');

    function handleMouseMove(e) {
        const tilt = e.currentTarget;
        const rect = tilt.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const tiltX = (y / rect.height - 0.5) * 20; 
        const tiltY = (x / rect.width - 0.5) * -20;
        
        tilt.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        tilt.style.boxShadow = `0 ${y / 15 + 10}px ${y / 10 + 30}px rgba(13, 38, 76, .15)`;
    }

    function handleMouseLeave(e) {
        e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        e.currentTarget.style.boxShadow = `var(--shadow)`;
    }

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
    });
    
    // Smooth form submission feedback
    const contactForm = document.querySelector('.contact-form form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            contactForm.classList.add('sent');
            const button = contactForm.querySelector('.btn');
            button.innerHTML = 'Sending...';

            setTimeout(() => {
                contactForm.classList.remove('sent');
                button.innerHTML = 'Message Sent!';
                button.classList.add('btn-light');
                contactForm.reset();
            }, 2000);
        });
    }

    // Mini Cards par click event listener
    const miniCards = document.querySelectorAll('.mini-card');
    miniCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            console.log(action);
            if (action) {
                handleCardAction(action);
            }
        });
    });

    function handleCardAction(action) {
        if(!action) return console.log("No action.");

        if(action==="mail" || action==="location") {
            window.location.href = "http://127.0.0.1:5500/NEW-AL-REHMAT/contact.html";
        }
        if(action === "call") {
            console.log("Action: call")
            window.open("tel:+923485078360");
        }
    }
});