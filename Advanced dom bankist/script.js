'use strict';

const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector(`.nav`);

// Building Tabbed component
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Buttton Scrolling
btnScrollTo.addEventListener(`click`, function (e) {
  const s1soords = section1.getBoundingClientRect();
  console.log(s1soords);

  console.log(e.target.getBoundingClientRect());

  console.log(`Current scroll (X/Y) `, window.pageXOffset, window.pageYOffset);

  console.log(
    `height/width viewport`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1soords.left + window.pageXOffset,
  //   s1soords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1soords.left + window.pageXOffset,
  //   top: s1soords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////
// page Navigation

// document.querySelectorAll(`.nav__link`).forEach(function (el) {
//   el.addEventListener(`click`, function (e) {
//     e.preventDefault();

//     const id = this.getAttribute(`href`);
//     document.querySelector(id).scrollIntoView({ behavior: `smooth` });
//   });
// });

// 1. add eventlistener to common parent elem
// 2. determine what elem originated the event

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();

  // MAtching
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

//////////////////////////////////////
/////////////////////////////////////
////////////////////////////////////

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  // Guard Clause
  if (!clicked) return;

  // remove Active classes
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach(c => c.classList.remove(`operations__content--active`));

  // Activate tab
  clicked.classList.add(`operations__tab--active`);

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

//////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing an `argument into handler function
nav.addEventListener(`mouseover`, handleHover.bind(0.5));

nav.addEventListener(`mouseout`, handleHover.bind(1));

/////////////////////
// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener(`scroll`, function (e) {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add(`sticky`)
//   else nav.classList.remove(`sticky`)
// });

////////////////////////
// sticy navigation: interection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//     if (!entry.isIntersecting)  nav.classList.add(`sticky`)
//       else nav.classList.remove(`sticky`)
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(header);

const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////
// revealing elemets on scroll/
const allSections = document.querySelectorAll(`.section`);

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

///////////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);

const loading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with Data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: `-200px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////
// Slider component
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector(`.dots`);
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `
    <button class="dots__dot" data-slide = ${i} ></button>
    `
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const goToSLide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSLide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSLide(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    goToSLide(0);
    createDots();
    activateDots(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);

  // keyboard eveb=nt
  document.addEventListener(`keydown`, function (e) {
    if (e.key === `ArrowLeft`) prevSlide();
    e.key === `ArrowRight` && nextSlide();
  });

  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      const { slide } = e.target.dataset;
      goToSLide(slide);
      activateDots(slide);
    }
  });
};
slider({});

// -100%,  0%,100%, 200%, 300%

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// // selecting ele,ments
// const header = document.querySelector(`.header`);
// const allSections = document.querySelectorAll(`.section`);
// console.log(allSections);

// document.getElementById(`section--1`);
// const allButton = document.getElementsByTagName(`button`);

// console.log(allButton);

// console.log(document.getElementsByClassName(`btn`));

// //creating and inserting elements
// // .insertAdjacentHTML
// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);
// // message.textContent = ` We use cookies for improved functionalities and analytics`;
// message.innerHTML = `We use cookies for improved functionsalities and analytics.
//  <button class="btn btn--close-cookie">Got it!</button>`;

// // header.prepend(message)
// header.append(message);
// // header.append(message.cloneNode(true))

// // header.before(message);
// // header.after(message);

// // Delete elements
// document
//   .querySelector(`.btn--close-cookie`)
//   .addEventListener(`click`, function () {
//     message.remove();
//   });

// // Styles
// // message.style.backgroundColor = `#37383d`;
// // message.style.width = `120%`;

// // console.log(message.style.color);
// // console.log(message.style.backgroundColor);

// // console.log(getComputedStyle(message).color);
// // console.log(getComputedStyle(message).height);

// // message.style.height =
// //   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;

// // document.documentElement.style.setProperty(`--color-primary`, `orangered`);

// // // Attributes
// // const logo = document.querySelector(`.nav__logo`);
// // console.log(logo.alt);
// // console.log(logo.src);
// // console.log(logo.className);

// // logo.alt = `Beautiful minimalist logo`;

// // // non standard
// // console.log(logo.designer);
// // console.log(logo.getAttribute(`designer`));
// // logo.setAttribute(`company`, `Bankist`);

// // console.log(logo.src);
// // console.log(logo.getAttribute(`src`));

// // const link = document.querySelector(`.twitter-link`);
// // console.log(link.href);
// // console.log(link.getAttribute(`href`));

// // // Data attributes
// // console.log(logo.dataset.versionNumber);

// // // classes
// // logo.classList.add(`c`, `j`);
// // logo.classList.remove(`c`, `j`);
// // logo.classList.toggle(`c`);
// // logo.classList.contains(`c`);

// // // Dont Use
// // logo.classList = `jonas`;

// const btnScrollTo = document.querySelector(`.btn--scroll-to`);
// const section1 = document.querySelector(`#section--1`);

// btnScrollTo.addEventListener(`click`, function (e) {
//   const s1soords = section1.getBoundingClientRect();
//   console.log(s1soords);

//   console.log(e.target.getBoundingClientRect());

//   console.log(`Current scroll (X/Y) `, window.pageXOffset, window.pageYOffset);

//   console.log(
//     `height/width viewport`,
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   // Scrolling
//   // window.scrollTo(
//   //   s1soords.left + window.pageXOffset,
//   //   s1soords.top + window.pageYOffset
//   // );

//   // window.scrollTo({
//   //   left: s1soords.left + window.pageXOffset,
//   //   top: s1soords.top + window.pageYOffset,
//   //   behavior: `smooth`,
//   // });

//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// // Events & eventhandlers

// // const h1 = document.querySelector(`h1`);

// // const alertH1 = function (e) {
// //   alert(`addEventListener: Great! you are reading the event :D`);
// // };

// // h1.addEventListener(`mouseenter`, alertH1);

// // setTimeout(() => h1.removeEventListener(`mouseenter`, alertH1), 3000);

// // rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`Link`, e.target, e.currentTarget);

//   // // Stop propagation
//   // e.stopPropagation()
// });

// document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`con`, e.target, e.currentTarget);
// });

// document.querySelector(`.nav`).addEventListener(
//   `click`,
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log(`nav`, e.target, e.currentTarget);
//   },
// );

// const h1 = document.querySelector(`h1`);

// // Going downward: child
// console.log(h1.querySelectorAll(`.highlight`));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = `white`;
// h1.lastElementChild.style.color = `black`;

// // Going upwards: parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest(`.header`).style.background = `var(--gradient-secondary)`;

// h1.closest(`h1`).style.background = `var(--gradient-primary)`;

// // Going sideaway: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.children);

// [...h1.parentElement.children].forEach(function (el) {
//   // Scaling 50%
//   if (el !== h1) el.style.transform = `scale(0.5)`;
// });

// DOM lifecycle
document.addEventListener(`DOMContentLoaded`, function (e) {
  console.log(`HTML parsed and DOM tree built!`, e);
});

window.addEventListener(`load`, function (e) {
  console.log(`Page fully Loaded`, e);
});

// window.addEventListener(`beforeunload`, function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ``;
// });
