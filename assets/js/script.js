// ============================
// Site configuration (EDIT all values here)
// ============================
const SITE_CONFIG = {
  repoURL: 'https://mynameisjj-001.github.io/K.gold/', // EDIT if repo path changes
  email: 'wuraola081107@gmail.com',                   // EDIT: contact email
  phoneLocal: '07349393176',                          // EDIT: local display number
  phoneIntl: '+447349393176',                         // EDIT: international format for WhatsApp/tel (recommended)
  cvPath: 'assets/docs/Olamide_CV.pdf',               // EDIT: actual CV filename/path
  emailjs: {
    userId: '', serviceId: '', templateId: ''         // EDIT: EmailJS keys
  }
};


/* ============================
  Navbar progress
  ============================ */
(function(){
  const progressEl = document.getElementById('nav-progress');

  function updateNavProgress(){
    if(!progressEl) return;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (height > 0) ? (scrollTop / height) * 100 : 0;
    progressEl.style.width = percent + '%';
  }

  window.addEventListener('scroll', updateNavProgress, { passive: true });
  window.addEventListener('resize', updateNavProgress);
  updateNavProgress();
})();


/* ============================
  Preloader
  ============================ */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if(pre){
    setTimeout(()=> {
      pre.classList.add('hidden');
      setTimeout(()=> pre.style.display='none', 600);
    }, 900);
  }
});


/* ============================
  Greeting + Subtyped (Typed.js)
  ============================ */
(function(){
  function startTypedSequence(){
    // Greeting
    new Typed('#greeting', {
      strings: ["Hi 👋 I am Olamide Olatunbosun,"],
      typeSpeed: 55,
      showCursor: true,
      cursorChar: '|',
      onComplete: () => {
        setTimeout(startSubtyped, 400);
      }
    });
  }

function startSubtyped(){
  new Typed('#subtyped', {
    strings: [
      "Student — Cyber Security and Web Development. Motivated, reliable, always eager to learn and solve problems."
    ],
    typeSpeed: 30,
    showCursor: true,
    cursorChar: '|',
    onComplete: (self) => {
      if(self && self.cursor) self.cursor.style.display = 'none';
    }
  });
}


  // Run greeting after preloader timeline (≈1.5s)
  window.addEventListener('load', function(){
    setTimeout(startTypedSequence, 1600); // wait for preloader to finish
  });
})();










/* ============================
  Skills animation
  ============================ */
function initSkillsAnimation(){
  const inners = document.querySelectorAll('.progress-inner');
  if(!('IntersectionObserver' in window)) {
    inners.forEach(i => i.style.width = (i.dataset.percent || '70') + '%');
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.width = (entry.target.dataset.percent || '70') + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  inners.forEach(i => obs.observe(i));
}


/* ============================
  Floating CTA buttons
  ============================ */
function initCTAs(){
  const waBtn = document.getElementById('whatsapp-btn');
  const callBtn = document.getElementById('call-btn');
  const mailBtn = document.getElementById('mail-btn');

  const waNumber = SITE_CONFIG.phoneIntl || SITE_CONFIG.phoneLocal;
  const waMessage = encodeURIComponent('Hello Olamide, I saw your portfolio and would like to get in touch.');

  if(waBtn) waBtn.href = `https://wa.me/${waNumber.replace(/\D/g,'')}?text=${waMessage}`;
  if(callBtn) callBtn.href = `tel:${SITE_CONFIG.phoneIntl || SITE_CONFIG.phoneLocal}`;
  if(mailBtn) mailBtn.href = `mailto:${SITE_CONFIG.email}`;
}


/* ============================
  Portfolio lightbox
  ============================ */
function initPortfolioLightbox(){
  const grid = document.getElementById('portfolio-grid');
  if(!grid) return;

  const modalHtml = `
    <div class="modal fade" id="portfolioModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-dark text-light">
          <div class="modal-body p-0">
            <img id="portfolioModalImg" src="" alt="" style="width:100%; height:auto; display:block; object-fit:contain;">
            <div class="p-3">
              <p id="portfolioModalDesc" class="mb-0"></p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const portfolioModal = new bootstrap.Modal(document.getElementById('portfolioModal'));

  grid.addEventListener('click', function(e){
    let item = e.target.closest('.portfolio-item');
    if(!item) return;
    document.getElementById('portfolioModalImg').src = item.dataset.img;
    document.getElementById('portfolioModalDesc').textContent = item.dataset.desc || '';
    portfolioModal.show();
  });
}


/* ============================
  Accessibility
  ============================ */
function makePortfolioAccessible(){
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('keypress', (e) => {
      if(e.key === 'Enter' || e.key === ' ') item.click();
    });
  });
}


/* ============================
  Contact form
  ============================ */
function initContactForm(){
  const form = document.getElementById('contact-form');
  const waSend = document.getElementById('wa-send');
  const alertBox = document.getElementById('form-alert');

  function validate() {
    let valid = true;
    ['name','email','message'].forEach(id => {
      const el = document.getElementById(id);
      if(!el.value.trim()) {
        el.classList.add('is-invalid'); valid = false;
      } else {
        el.classList.remove('is-invalid');
      }
    });
    return valid;
  }

  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      alertBox.innerHTML = '';
      if(!validate()) {
        alertBox.innerHTML = '<div class="alert alert-danger">Please fill in required fields.</div>';
        return;
      }

      const {userId, serviceId, templateId} = SITE_CONFIG.emailjs;
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if(userId && serviceId && templateId && window.emailjs){
        emailjs.init(userId);
        emailjs.send(serviceId, templateId, { from_name: name, from_email: email, message })
          .then(() => {
            alertBox.innerHTML = '<div class="alert alert-success">Message sent — thank you!</div>';
            form.reset();
          }, () => {
            alertBox.innerHTML = '<div class="alert alert-danger">Failed to send message — try WhatsApp.</div>';
          });
        return;
      }

      const waNumber = SITE_CONFIG.phoneIntl || SITE_CONFIG.phoneLocal;
      const waText = encodeURIComponent(`Contact from portfolio\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
      window.open(`https://wa.me/${waNumber.replace(/\D/g,'')}?text=${waText}`, '_blank');
      alertBox.innerHTML = '<div class="alert alert-info">Opened WhatsApp — please confirm and send.</div>';
      form.reset();
    });
  }

  if(waSend){
    waSend.addEventListener('click', function(){
      if(!validate()) {
        alertBox.innerHTML = '<div class="alert alert-danger">Please fill required fields before sending via WhatsApp.</div>';
        return;
      }
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const waNumber = SITE_CONFIG.phoneIntl || SITE_CONFIG.phoneLocal;
      const waText = encodeURIComponent(`Contact from portfolio\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
      window.open(`https://wa.me/${waNumber.replace(/\D/g,'')}?text=${waText}`, '_blank');
    });
  }
}


/* ============================
  DOM Ready actions
  ============================ */
document.addEventListener('DOMContentLoaded', function() {
  const yearEl = document.getElementById('current-year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  initSkillsAnimation();
  initCTAs();
  initPortfolioLightbox();
  initContactForm();
  makePortfolioAccessible();
});
