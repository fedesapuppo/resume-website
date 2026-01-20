// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Consolidated scroll handler with requestAnimationFrame to prevent jumps
let ticking = false;
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const hero = document.querySelector('.hero');
const heroShapes = document.querySelectorAll('.hero-shapes .shape');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Detect mobile devices
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Navbar shadow effect
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }

    // Active navigation link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (currentScroll >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Parallax effect with rounded values to prevent fractional pixel jumps
    if (hero && !isMobile && currentScroll < window.innerHeight) {
        // Round to whole pixels to prevent jumps
        const parallaxOffset = Math.round(currentScroll * 0.5);
        hero.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;

        // Subtle parallax on floating shapes (different speeds for depth)
        heroShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const offset = Math.round(currentScroll * speed);
            shape.style.transform = `translateY(${offset}px)`;
        });
    } else if (hero && isMobile) {
        // Reset on mobile
        hero.style.transform = 'translate3d(0, 0, 0)';
    }

    // Hide scroll indicator after scrolling
    if (scrollIndicator) {
        if (currentScroll > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }

    lastScroll = currentScroll;
    ticking = false;
}

// Single scroll listener with requestAnimationFrame throttling
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
}, { passive: true });

// Intersection Observer for fade-in animations
// Use more lenient settings on mobile for better visibility
const observerOptions = {
    threshold: isMobile ? 0.05 : 0.15,
    rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');

            // Clean up willChange after animation completes
            setTimeout(() => {
                entry.target.style.willChange = 'auto';
                observer.unobserve(entry.target);
            }, 650);
        }
    });
}, observerOptions);

// Observe timeline items, education cards, skill categories, contact cards, contribution cards, and section titles
document.querySelectorAll('.timeline-item, .education-card, .skill-category, .contact-card, .contribution-card, .section-title').forEach((el, index) => {
    el.style.willChange = 'opacity, transform';
    observer.observe(el);

    // Fallback: ensure elements become visible even if observer doesn't fire
    // This is especially important on some mobile browsers
    setTimeout(() => {
        if (!el.classList.contains('animate-in')) {
            el.classList.add('animate-in');
            el.style.willChange = 'auto';
        }
    }, 3000 + (index * 100)); // Stagger fallback animations
});

// Typing effect for hero subtitle (handles gradient text)
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1'; // Make sure it's visible
    let i = 0;

    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };

    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Enhanced button hover effects with ripple
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--ripple-x', x + 'px');
        this.style.setProperty('--ripple-y', y + 'px');
    });
});

// Add click effect to tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
        // Create a subtle pulse effect on click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Smooth scroll for scroll indicator click
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            const offsetTop = skillsSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    scrollIndicator.style.cursor = 'pointer';
}

// Add hover effect to timeline markers
document.querySelectorAll('.timeline-marker').forEach(marker => {
    marker.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
    });
    marker.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Lazy load optimization for shapes (only animate when visible)
const heroSection = document.querySelector('.hero');
if (heroSection && !isMobile) {
    const shapeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            heroShapes.forEach(shape => {
                if (entry.isIntersecting) {
                    shape.style.animationPlayState = 'running';
                } else {
                    shape.style.animationPlayState = 'paused';
                }
            });
        });
    }, { threshold: 0 });

    shapeObserver.observe(heroSection);
}

// Console message for developers
console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #dc2626;');
console.log('%cLooking at the code? Let\'s connect!', 'font-size: 14px; color: #334155;');
console.log('%cGitHub: https://github.com/fedesapuppo', 'font-size: 12px; color: #64748b;');
console.log('%cEmail: fedesapuppo@hotmail.com', 'font-size: 12px; color: #64748b;');
