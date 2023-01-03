const canvas = document.querySelector("canvas");
canvas.width = 1024 / 4;
canvas.height = 576 / 4;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "lightblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

sceneManager.registerMapManager(mapManager);
sceneManager.registerBattleManager(battleManager);

const main = () => {
  window.requestAnimationFrame(main);
  sceneManager.draw();
};
main();

document.getElementById("fullscreen-enter").addEventListener("click", () => {
  if (canvas.webkitRequestFullScreen) {
    canvas.webkitRequestFullScreen();
  } else {
    canvas.mozRequestFullScreen();
  }
});
document.getElementById("fullscreen-ignore").addEventListener("click", () => {
  document.getElementById("fullscreen-settings").style.display = "none";
});
