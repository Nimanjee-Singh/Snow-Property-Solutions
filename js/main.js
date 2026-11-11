// ===== Utility =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Header scroll state =====
const header = document.getElementById('site-header');
function updateHeader() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
updateHeader();
window.addEventListener('scroll', updateHeader);

// ===== Mobile menu =====
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  menuToggle.setAttribute('aria-expanded', String(isHidden));
  menuToggle.innerHTML = isHidden
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// ===== Back to top / quote floating button =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// ===== Reveal on scroll animation =====
const revealTargets = document.querySelectorAll(
  '.service-card, .process-step, .gallery-item, #about img, .testimonial-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// ===== Load testimonials from Table API =====
const submittedReviews = [
  {
    showRating: false,
    review: "Excellent painting and decorating service from start to finish. Very professional, reliable and tidy. The finish was outstanding, and I'm extremely happy with the results. Highly recommended!",
    name: 'James Mitchell',
    location: ''
  },
  {
    showRating: false,
    review: 'Quick, reliable and professional service. Furniture was assembled perfectly, and everything was left clean and tidy. Would happily use them again.',
    name: 'Sarah Thompson',
    location: ''
  },
  {
    showRating: false,
    review: 'The painting work was good and the finish was satisfactory. The project took a little longer than expected, but the result was acceptable.',
    name: 'David Clarke',
    location: ''
  },
  {
    showRating: false,
    review: 'Great experience from beginning to end. The team was punctual, polite and took real care with our property. Excellent workmanship and great value.',
    name: 'Emma Wilson',
    location: ''
  }
];

async function loadTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  const heading = document.getElementById('testimonials-heading');
  const description = document.getElementById('testimonials-description');
  try {
    const res = await fetch('tables/testimonials?limit=8');
    const json = await res.json();
    const storedReviews = json && Array.isArray(json.data) ? json.data : [];
    heading.textContent = 'What Our Customers Say';
    description.textContent = 'Customer feedback on our painting, decorating and property services.';
    renderTestimonialCards(grid, [...submittedReviews, ...storedReviews]);
  } catch (err) {
    renderTestimonialCards(grid, submittedReviews);
    console.error('Failed to load testimonials', err);
  }
}

function renderTestimonialCards(grid, rows) {
  grid.innerHTML = '';
  rows.forEach(row => {
    const rating = Math.max(0, Math.min(5, Number(row.rating) || 5));
    const stars = row.showRating === false
      ? ''
      : '<i class="fa-solid fa-star"></i>'.repeat(rating) +
        '<i class="fa-regular fa-star"></i>'.repeat(5 - rating);
    const card = document.createElement('div');
    card.className = 'testimonial-card reveal';
    card.innerHTML = `
      ${stars ? `<div class="testimonial-stars">${stars}</div>` : ''}
      <p class="testimonial-quote">&ldquo;${escapeHtml(row.review || '')}&rdquo;</p>
      <p class="testimonial-author">${escapeHtml(row.name || 'Happy Customer')}</p>
      <p class="testimonial-location">${escapeHtml(row.location || '')}</p>
    `;
    grid.appendChild(card);
    observer.observe(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadTestimonials();
