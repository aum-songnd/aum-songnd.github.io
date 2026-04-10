const slider = document.getElementById("slider");
const images = document.querySelectorAll(".slider img");
const dotsContainer = document.getElementById("dots");

let index = 0;

/* tạo dots */
images.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.onclick = () => goTo(i);
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function update() {
  slider.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach((d) => d.classList.remove("active"));
  dots[index].classList.add("active");
}

function goTo(i) {
  index = i;
  update();
}

/* SWIPE */
let startX = 0;

slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) index = (index + 1) % images.length;
  if (endX - startX > 50) index = (index - 1 + images.length) % images.length;

  update();
});

/* AUTO */
setInterval(() => {
  index = (index + 1) % images.length;
  update();
}, 4000);
