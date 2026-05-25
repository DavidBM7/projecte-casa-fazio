let home = document.getElementById("home");
let carta = document.getElementById("carta");
let reserves = document.getElementById("reserves");

home.addEventListener("click", ()=>{
    window.location.href="/home.html";
});
carta.addEventListener("click", ()=>{
    window.location.href="/html/menu.html";
});
reserves.addEventListener("click", ()=>{
    window.location.href="/html/reserves.html"
});