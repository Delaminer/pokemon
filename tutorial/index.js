document.querySelector("#overlapping-div").style.opacity = 0;

drawBoundaries = false;
mapWidth = 70;
mapHeight = 40;
collisionsMap = [];
for (let i = 0; i < collisions.length; i += mapWidth) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += mapWidth) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const backgroundImage = new Image();
backgroundImage.src = "./img/Pellet Town.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/Pellet Town Foreground.png";

const playerUpImg = new Image();
playerUpImg.src = "./img/playerUp.png";

const playerDownImg = new Image();
playerDownImg.src = "./img/playerDown.png";

const playerLeftImg = new Image();
playerLeftImg.src = "./img/playerLeft.png";

const playerRightImg = new Image();
playerRightImg.src = "./img/playerRight.png";

const offset = {
  x: -740,
  y: -630,
};

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: backgroundImage,
});
const foreground = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: foregroundImage,
});

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImg,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImg,
    left: playerLeftImg,
    right: playerRightImg,
    down: playerDownImg,
  },
});

const boundaries = [];

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol == 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol == 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

let lastKey = "s";

window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      {
        keys.w.pressed = true;
        lastKey = "w";
      }
      break;
    case "a":
      {
        keys.a.pressed = true;
        lastKey = "a";
      }
      break;
    case "s":
      {
        keys.s.pressed = true;
        lastKey = "s";
      }
      break;
    case "d":
      {
        keys.d.pressed = true;
        lastKey = "d";
      }
      break;
  }
});

window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      {
        keys.w.pressed = false;
      }
      break;
    case "a":
      {
        keys.a.pressed = false;
      }
      break;
    case "s":
      {
        keys.s.pressed = false;
      }
      break;
    case "d":
      {
        keys.d.pressed = false;
      }
      break;
  }
});

const rectangularCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
};

const movables = [background, foreground, ...boundaries, ...battleZones];

const battle = {
  initiated: false,
};

const update = ({ animationId }) => {
  // Battle zone detection
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.05
      ) {
        // Activate a battle!
        console.log("start a battle");
        battle.initiated = true;
        player.animate = false;

        audio.Map.stop();
        audio.InitBattle.play();
        audio.Battle.play();

        gsap.to("#overlapping-div", {
          opacity: 1,
          repeat: 3,
          duration: 0.3,
          yoyo: true,
          onComplete: () => {
            gsap.to("#overlapping-div", {
              opacity: 1,
              duration: 0.3,
              onComplete: () => {
                // Start the battle animation
                initBattle();
                animateBattle();
                gsap.to("#overlapping-div", {
                  opacity: 0,
                  duration: 0.3,
                });
              },
            });
          },
        });

        window.cancelAnimationFrame(animationId);
        return;
      }
    }
  }

  // Collision detection
  player.animate = false;
  if (keys.w.pressed && !keys.s.pressed) {
    let moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) {
      player.animate = true;
      player.image = player.sprites.up;
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  }
  if (keys.s.pressed && !keys.w.pressed) {
    let moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      player.animate = true;
      player.image = player.sprites.down;
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  }
  if (keys.a.pressed && !keys.d.pressed) {
    let moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      player.animate = true;
      player.image = player.sprites.left;
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  }
  if (keys.d.pressed && !keys.a.pressed) {
    let moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      player.animate = true;
      player.image = player.sprites.right;
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
  }
  if (!player.animate) {
    if (lastKey === "w" && keys.w.pressed && !keys.s.pressed) {
      player.animate = true;
      player.image = player.sprites.up;
    } else if (lastKey === "a" && keys.a.pressed && !keys.d.pressed) {
      player.animate = true;
      player.image = player.sprites.left;
    } else if (lastKey === "s" && keys.s.pressed && !keys.w.pressed) {
      player.animate = true;
      player.image = player.sprites.down;
    } else if (lastKey === "d" && keys.d.pressed && !keys.a.pressed) {
      player.animate = true;
      player.image = player.sprites.right;
    }
  }
};

const draw = ({ animationId }) => {
  background.draw();
  if (drawBoundaries) {
    boundaries.forEach((boundary) => {
      boundary.draw();
    });
    battleZones.forEach((battleZone) => {
      battleZone.draw();
    });
  }
  player.draw();
  foreground.draw();
};

const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  if (!battle.initiated) {
    update({ animationId });
  }
  draw({ animationId });
};

let clicked = false;
document.addEventListener("click", () => {
  if (!clicked) {
    audio.Map.play();
    clicked = true;
  }
});
