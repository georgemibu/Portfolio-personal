import { translations } from '../data/translations';
import emailjs from '@emailjs/browser';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const storedLanguage = localStorage.getItem('portfolio-language');
let language = storedLanguage === 'en' ? 'en' : 'es';

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem('portfolio-language', language);
  document.documentElement.lang = language;
  $$('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) element.textContent = translations[language][key];
  });
  $$('.project-description').forEach((element) => {
    element.textContent = language === 'en' ? element.dataset.en : element.dataset.es;
  });
  $$('[data-i18n-category]').forEach((element) => {
    const category = element.dataset.i18nCategory;
    element.textContent = translations[language][category] || category;
  });
  $$('.language-switch button').forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.title = language === 'en'
    ? 'Jorge Rocha — Fullstack Developer'
    : 'Jorge Rocha — Desarrollador Fullstack';
  const description = $('meta[name="description"]');
  if (description) description.content = language === 'en'
    ? 'Professional portfolio of Jorge Rocha, Fullstack Developer focused on digital experiences and web solutions.'
    : 'Portafolio profesional de Jorge Rocha, desarrollador Fullstack especializado en experiencias digitales y soluciones web.';
  const formStatus = $('#contact-status');
  if (formStatus?.dataset.messageKey) {
    formStatus.textContent = translations[language][formStatus.dataset.messageKey];
  }
}

$$('.language-switch button').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));

const menuToggle = $('.menu-toggle');
const nav = $('.nav');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
$$('.nav a').forEach((link) => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

$$('.filters button').forEach((button) => button.addEventListener('click', () => {
  $$('.filters button').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  $$('.catalog-grid .project-card').forEach((card) => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.hidden = !visible;
  });
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((element) => revealObserver.observe(element));

const form = $('#contact-form');
const formStatus = $('#contact-status');
const submitButton = $('button[type="submit"]', form);
function setFormStatus(messageKey, state = '') {
  if (!formStatus) return;
  formStatus.dataset.messageKey = messageKey;
  formStatus.dataset.state = state;
  formStatus.textContent = translations[language][messageKey];
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = '';
  delete formStatus.dataset.messageKey;
  let valid = true;
  $$('input, textarea', form).forEach((field) => {
    const small = field.parentElement.querySelector('small');
    let message = '';
    if (!field.value.trim()) {
      message = field.name === 'name' ? translations[language].requiredName
        : field.name === 'email' ? translations[language].requiredEmail
          : field.name === 'subject' ? translations[language].requiredSubject
            : translations[language].requiredMessage;
    } else if (field.type === 'email' && !field.validity.valid) {
      message = translations[language].requiredEmail;
    }
    field.classList.toggle('invalid', Boolean(message));
    if (small) small.textContent = message;
    if (message) valid = false;
  });
  if (!valid) return;
  const { serviceId, templateId, publicKey } = form.dataset;
  if (!serviceId || !templateId || !publicKey) {
    setFormStatus('emailConfigError', 'error');
    return;
  }

  submitButton.disabled = true;
  setFormStatus('sending', 'sending');
  try {
    const templateParams = Object.fromEntries(new FormData(form).entries());
    templateParams.title = templateParams.subject;
    await emailjs.send(serviceId, templateId, templateParams, { publicKey });
    form.reset();
    $$('.invalid', form).forEach((field) => field.classList.remove('invalid'));
    $$('label small', form).forEach((message) => { message.textContent = ''; });
    setFormStatus('sent', 'success');
  } catch (error) {
    console.error('EmailJS contact form submission failed:', error);
    const errorText = typeof error?.text === 'string' ? error.text : '';
    const isGmailAuthError = error?.status === 412 || /invalid grant|reconnect your gmail account/i.test(errorText);
    setFormStatus(isGmailAuthError ? 'gmailAuthError' : 'sendError', 'error');
  } finally {
    submitButton.disabled = false;
  }
});

$('#year').textContent = new Date().getFullYear();
applyLanguage(language);
