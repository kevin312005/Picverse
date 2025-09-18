const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.slide-nav');
let currentSlide = 0;
let slideInterval;

if (slides.length > 0) {
    createDots();
    showSlide(currentSlide);
    startAutoSlide();
}

function createDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        slide.classList.toggle('fade', i === index);
    });

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    clearInterval(slideInterval);
    showSlide(index);
    startAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const artworkContainer = document.querySelector('.artwork-container');
    const artworkSlides = document.querySelectorAll('.artwork-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (!artworkContainer || !artworkSlides.length || !prevBtn || !nextBtn) {
        return;
    }

    let currentIndex = 0;
    let slideWidth = 0;
    let isTransitioning = false;

    function calculateSlideWidth() {
        const slide = artworkSlides[0];
        const slideStyle = window.getComputedStyle(slide);
        const slideRect = slide.getBoundingClientRect();
        const marginRight = parseFloat(slideStyle.marginRight) || 0;
        slideWidth = slideRect.width + marginRight;
    }

    function initSlider() {
        calculateSlideWidth();
        updateSliderPosition(false);
    }

    function updateSliderPosition(withTransition = true) {
        if (withTransition) {
            artworkContainer.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            artworkContainer.style.transition = 'none';
        }
        
        const translateX = -currentIndex * slideWidth;
        artworkContainer.style.transform = `translateX(${translateX}px)`;
    }

    function nextSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex++;
        
        if (currentIndex >= artworkSlides.length) {
            currentIndex = 0;
        }
        
        updateSliderPosition(true);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    function prevSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex--;
        
        if (currentIndex < 0) {
            currentIndex = artworkSlides.length - 1;
        }
        
        updateSliderPosition(true);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateSlideWidth();
            updateSliderPosition(false);
        }, 100);
    });

    let startX = null;
    let isDragging = false;

    artworkContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = false;
    }, { passive: true });

    artworkContainer.addEventListener('touchmove', function(e) {
        if (startX === null) return;
        isDragging = true;
    }, { passive: true });

    artworkContainer.addEventListener('touchend', function(e) {
        if (startX === null || !isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startX = null;
        isDragging = false;
    }, { passive: true });

    initSlider();

    
});

document.addEventListener('DOMContentLoaded', function() {
    const submissionForm = document.getElementById("submissionForm");
    
    if (submissionForm) {
        submissionForm.addEventListener("submit", function (event) {
            event.preventDefault();
          
            let errors = [];
          
            const email = document.getElementById("email").value.trim();
            const title = document.getElementById("title").value.trim();
            const description = document.getElementById("description").value.trim();
            const tags = document.getElementById("tags").value.trim();
            const file = document.getElementById("fileUpload").files[0];
            const aiGenerated = document.querySelector('input[name="aiGenerated"]:checked');
          
            if (!email.includes("@") || !email.includes(".")) {
              errors.push("Please enter a valid email.");
            }
          
            if (title.length < 3) {
              errors.push("Title must be at least 3 characters long.");
            }
          
            if (description === "") {
              errors.push("Description cannot be empty.");
            }
          
            if (tags.split(",").filter(tag => tag.trim() !== "").length === 0) {
              errors.push("Please enter at least one tag.");
            }
          
            if (!file) {
              errors.push("Please upload a file.");
            }
          
            if (!aiGenerated) {
              errors.push("Please indicate if the work is AI-generated.");
            }
          
            const errorBox = document.getElementById("errorMessages");
            if (errorBox) {
                errorBox.innerHTML = "";
            
                if (errors.length > 0) {
                  errorBox.innerHTML = errors.map(err => `<p>${err}</p>`).join("");
                } else {
                  alert("Form submitted successfully!");
                  this.reset();
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const discussionList = document.getElementById("discussionList");
    
    if (discussionList) {
        const discussions = [
          { title: "Tips for Digital Art Beginners", user: "Sarah Chen", replies: 24 },
          { title: "Best Drawing Tablets 2025", user: "John Ellis", replies: 18 },
          { title: "Color Theory Simplified", user: "Alice Thompson", replies: 32 },
        ];

        discussions.forEach((discussion) => {
          const div = document.createElement("div");
          div.className = "card";
          div.innerHTML = `
            <h3>${discussion.title}</h3>
            <p>Started by <strong>${discussion.user}</strong> · 💬 ${discussion.replies} replies</p>
          `;
          discussionList.appendChild(div);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const discussionItems = document.querySelectorAll('.discussion-item');
    
    discussionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f9f9f9';
            this.style.cursor = 'pointer';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', function() {
            console.log('Navigating to discussion thread:', this.querySelector('h3').textContent);
        });
    });
    
    const userItems = document.querySelectorAll('.user-item');
    
    userItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f9f9f9';
            this.style.cursor = 'pointer';
            this.style.borderRadius = '8px';
            this.style.padding = '5px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.padding = '0';
        });
        
        item.addEventListener('click', function() {
            const username = this.querySelector('h4').textContent;
            console.log('Viewing profile of:', username);
        });
    });
    
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f9f9f9';
            this.style.cursor = 'pointer';
            this.style.borderRadius = '8px';
            this.style.padding = '5px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.padding = '0';
        });
        
        item.addEventListener('click', function() {
            console.log('Viewing activity referenced content');
        });
    });

    function createCommentIcons() {
        const commentCounts = document.querySelectorAll('.comment-count');
        
        commentCounts.forEach(container => {
            const imgElement = container.querySelector('img');
            if (imgElement) {
                container.removeChild(imgElement);
            }
            
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("width", "16");
            svg.setAttribute("height", "16");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("stroke", "#888");
            svg.setAttribute("stroke-width", "2");
            svg.setAttribute("stroke-linecap", "round");
            svg.setAttribute("stroke-linejoin", "round");
            
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z");
            
            svg.appendChild(path);
            container.insertBefore(svg, container.firstChild);
        });
    }
    
    createCommentIcons();
});

// Hamburger menu logic for all pages (including submitpage)
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    // Close menu when clicking outside nav-menu or hamburger
    document.addEventListener('click', function(e) {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    // Close menu when any nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const heroSlides = [
    {
      img: "asset/slide1.jpg",
      title: "Unleash Your Creative Vision",
      artist: "Farren Angel"
    },
    {
      img: "asset/slide2.jpg",
      title: "See the World Through Digital Expression",
      artist: "John Lea"
    },
    {
      img: "asset/slide3.jpg",
      title: "Create Together, Inspire One Another",
      artist: "Steve Hover"
    }
  ];
  const heroBgImgs = document.querySelectorAll('.homepage-slide-bg');
  const heroTitle = document.getElementById('homepage-hero-title');
  const heroDesc = document.getElementById('homepage-hero-desc');
  if (heroBgImgs.length && heroTitle && heroDesc) {
    let heroIndex = 0;
    function showHeroSlide(idx) {
      heroBgImgs.forEach((img, i) => img.classList.toggle('active', i === idx));
      heroTitle.textContent = heroSlides[idx].title;
      heroDesc.textContent = "Featured Artist: " + heroSlides[idx].artist;
    }
    setInterval(() => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
    }, 5000);
  }

  document.querySelectorAll('.homepage-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      const tagSection = this.getAttribute('data-tag');
      if (tagSection) {
        window.location.href = 'gallery.html#' + encodeURIComponent(tagSection);
      } else {
        window.location.href = 'gallery.html';
      }
    });
  });
});