
const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;


const ctx = canvas.getContext("2d");
ctx.fillStyle = "lightblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const backgroundImage = new Image();
backgroundImage.src = "./img/map.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/map-foreground.png";
