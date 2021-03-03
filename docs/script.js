const contentsElements = document.querySelectorAll("#content > div");
const observeOption = {
  rootMargin: "0px",
  threshold: 1.0,
};
const observeCallback = (entries) => {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.isIntersecting) {
      const img = entry.target.querySelector("img");
      img.src = img.getAttribute("data-src");
    }
  }
};
const observer = new IntersectionObserver(observeCallback, observeOption);
contentsElements.forEach((elem) => {
  observer.observe(elem);
});
