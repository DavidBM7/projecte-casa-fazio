const btn = document.getElementById("menu");
const links = document.getElementById("menu-links");

btn.addEventListener("click", () => {
    links.classList.toggle("show");
});