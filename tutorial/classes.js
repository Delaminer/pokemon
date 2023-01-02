class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    rotation = 0,
  }) {
    this.position = {...position};
    this.image = new Image();
    this.sprites = sprites;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;
    this.animate = animate;
    this.opacity = 1;
    this.rotation = rotation;
  }

  draw() {
    ctx.save();
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    ctx.rotate(this.rotation);
    ctx.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    ctx.restore();

    if (this.animate && this.frames.max > 1) {
      this.frames.elapsed++;
      if (this.frames.elapsed % this.frames.hold == 0) {
        this.frames.val = (this.frames.val + 1) % this.frames.max;
      }
    }
  }
}

class Monster extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    rotation = 0,

    isEnemy = false,
    name,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
    });
    console.log(`position for ${name} starts at `,this.position)
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector(
      "#dialogueBox"
    ).innerHTML = `${this.name} used ${attack.name}`;

    recipient.health -= attack.damage;
    switch (attack.name) {
      case "Fireball":
        {
          audio.InitFireball.play();
          const fireballImage = new Image();
          fireballImage.src = "./img/fireball.png";
          const fireball = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y,
            },
            image: fireballImage,
            frames: {
              max: 4,
              hold: 10,
            },
            animate: true,
            rotation: this.isEnemy ? 1.2 * Math.PI : Math.PI / 2,
          });
          renderedSprites.splice(1, 0, fireball);

          gsap.to(fireball.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            onComplete: () => {
              renderedSprites.splice(1, 1);
              // Enemy gets hit
              audio.FireballHit.play();

              gsap.to(this.isEnemy ? "#playerHealthBar" : "#enemyHealthBar", {
                width: recipient.health + "%",
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });

              gsap.to(recipient, {
                opacity: 0,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
            },
          });
        }
        break;
      case "Tackle":
        {
          const tl = gsap.timeline();

          let movementDistance = 20 * (this.isEnemy ? -1 : 1);

          tl.to(this.position, {
            x: this.position.x - movementDistance,
          })
            .to(this.position, {
              x: this.position.x + movementDistance * 2,
              duration: 0.1,
              onComplete: () => {
                // Enemy gets hit
                audio.TackleHit.play();

                gsap.to(this.isEnemy ? "#playerHealthBar" : "#enemyHealthBar", {
                  width: recipient.health + "%",
                });

                gsap.to(recipient.position, {
                  x: recipient.position.x + 10,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.08,
                });

                gsap.to(recipient, {
                  opacity: 0,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.08,
                });
              },
            })
            .to(this.position, {
              x: this.position.x,
            });
        }
        break;
    }
  }

  faint() {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector(
      "#dialogueBox"
    ).innerHTML = `${this.name} has fainted!`;
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });

    audio.Victory.play();
  }
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    ctx.fillStyle = "rgb(255,0,0,0.2)";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
