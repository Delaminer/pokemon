const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle;
let emby;
let renderedSprites;
let queue;

const initBattle = () => {
  document.querySelector("#battleUI").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();
  console.log(monsters)
  draggle = new Monster({...monsters.Draggle});
  emby = new Monster({...monsters.Emby});
  renderedSprites = [draggle, emby];
  queue = [];

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });

  // Event listeners for attack buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", ({ currentTarget }) => {
      const selectedAttack = attacks[currentTarget.innerHTML];
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          // fade back to black
          gsap.to("#overlapping-div", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#battleUI").style.display = "none";
              gsap.to("#overlapping-div", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.Battle.stop();
              audio.Map.play();
            },
          });
        });

        return;
      }

      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });

        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint();
          });

          queue.push(() => {
            // fade back to black
            gsap.to("#overlapping-div", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector("#battleUI").style.display = "none";
                gsap.to("#overlapping-div", {
                  opacity: 0,
                });
                battle.initiated = false;
                audio.Battle.stop();
                audio.Map.play();
              },
            });
          });

          return;
        }
      });
    });
    button.addEventListener("mouseenter", ({ currentTarget }) => {
      const selectedAttack = attacks[currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectedAttack.type;
      document.querySelector("#attackType").style.color = selectedAttack.color;
    });
  });
};

let battleAnimationId;
const animateBattle = () => {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  renderedSprites.forEach((sprite) => sprite.draw());
};

document
  .querySelector("#dialogueBox")
  .addEventListener("click", ({ currentTarget }) => {
    if (queue.length > 0) {
      queue[0]();
      queue.shift();
    } else {
      currentTarget.style.display = "none";
    }
  });
