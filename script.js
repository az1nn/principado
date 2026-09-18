const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const header = document.querySelector('[data-header]');

menu?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(Boolean(open)));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Abrir menu');
  });
});

const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 16);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const phoneInput = document.querySelector('input[name="phone"]');
phoneInput?.addEventListener('input', (event) => {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, '').slice(0, 11);
  let formatted = digits;
  if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  input.value = formatted;
});

const form = document.getElementById('budgetForm');
const error = document.getElementById('formError');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const phoneDigits = phone.replace(/\D/g, '');
  const eventType = String(data.get('event') || '').trim();

  const errors = [];
  if (name.length < 2) errors.push('Informe seu nome.');
  if (phoneDigits.length < 10) errors.push('Informe um WhatsApp válido.');
  if (!eventType) errors.push('Selecione o tipo de evento.');

  if (errors.length) {
    if (error) error.textContent = errors.join(' ');
    return;
  }

  if (error) error.textContent = '';

  const text = `Olá, Principado Produções! 👋\n\nMeu nome é ${name}.\nWhatsApp: ${phone}\n\nTipo de evento: ${eventType}\nData prevista: ${data.get('date') || 'A definir'}\nCidade/local: ${data.get('location') || 'A definir'}\nFaixa de investimento: ${data.get('budget') || 'A conversar'}\n\nSobre o evento:\n${data.get('message') || 'Gostaria de conversar sobre o projeto.'}\n\nQuero entender como a Principado pode estruturar essa produção.`;

  window.open(`https://wa.me/5521975542783?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});
