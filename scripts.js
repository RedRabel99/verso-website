closeFullGallery()
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.gallery-slide');
const dots = document.querySelectorAll('.dot');
const container = document.querySelector('.gallery-container');
document.addEventListener("DOMContentLoaded", loadGallery)

let touchStartX = 0;
let touchEndX = 0;

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelectorAll('[data-link]');

// Toggle mobile menu when hamburger is clicked
hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Hide mobile menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden"); // Hide mobile menu
    });
});

// Touch events
container.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
});

container.addEventListener('touchmove', e => {
    touchEndX = e.touches[0].clientX;
});

container.addEventListener('touchend', () => {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
        changeSlide(swipeDistance > 0 ? -1 : 1);
    }
});

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

function openFullGallery() {
    document.getElementById('fullGalleryModal').style.display = 'flex';
}

function closeFullGallery() {
    document.getElementById('fullGalleryModal').style.display = 'none';
    document.getElementById('singleImageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeGalleryIfOutside(event) {
    // Close only if clicking on the modal background
    if (event.target.classList.contains('full-gallery-modal')) {
        closeFullGallery();
    }
}


function openSingleImage(src, alt) {
    const modal = document.getElementById('singleImageModal');
    const img = document.getElementById('singleImage');
    img.src = src;
    img.alt = alt;
    modal.style.display = 'flex';
}

function closeSingleImage() {
    document.getElementById('singleImageModal').style.display = 'none';
}

function closeSingleImageIfOutside(event) {
    const modal = document.getElementById('singleImageModal');
    const image = document.getElementById('singleImage');

    if (event.target != image) {
        closeSingleImage();
    }
}

function loadGallery() {
    const galleryContainer = document.getElementById("full-gallery-images");
    const imageCount = 45;
    
    for(let i = 1; i <= imageCount; i++){
        const img = document.createElement("img");
        img.src = `images/bathroom-picture-${i}.JPEG`;
        img.alt = `Zdjęcie łazienki ${i}`;
        img.loading = "lazy";
        img.onclick = function() {
            openSingleImage(this.src, this.alt);
        }
        galleryContainer.appendChild(img);
    }
}

function setupModalHistoryHandling(){
    let galleryOpen = false;
    let singleImageOpen = false;

    const originalOpenFullGallery = window.openFullGallery;
    window.openFullGallery = function(){
        originalOpenFullGallery();

        if(!galleryOpen){
            history.pushState({modal: 'gallery'}, '');
            galleryOpen = true;
        }
    };

    const originalCloseFullGallery = window.closeFullGallery;
    window.closeFullGallery = function (){
        originalCloseFullGallery();
        galleryOpen = false;
    };

    const originalOpenSingleImage = window.openSingleImage;
    window.openSingleImage = function(src){
        if(originalOpenSingleImage){
            originalOpenSingleImage(src);
        } else{
            const modal = document.getElementById('singleImageModal');
            const img = document.getElementById('singleImage');
            img.src = src;
            modal.style.display = 'flex';
        }

        if(!singleImageOpen){
            history.pushState({modal: 'singleImage'}, '');
            singleImageOpen = true;
        }
    }

    const originalCloseSingleImage = window.closeSingleImage;
    window.closeSingleImage = function() {
        originalCloseSingleImage();
        singleImageOpen = false;
    };
    
    // Handle the popstate event (when back button is pressed)
    window.addEventListener('popstate', function(event) {
        // Check which modal might be open and close it
        if (singleImageOpen) {
            closeSingleImage();
            return;
        }
        
        if (galleryOpen) {
            closeFullGallery();
            return;
        }
    });
}

document.addEventListener('DOMContentLoaded', setupModalHistoryHandling);