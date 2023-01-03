class MapManager {
  constructor() {
    // const backgroundImage = new Image();
    // backgroundImage.src = "./img/map.png";

    // const foregroundImage = new Image();
    // foregroundImage.src = "./img/map-foreground.png";
    this.background = new FullSprite({
      src: "./img/map.png",
      position: { x: 0, y: 0 },
    });
    this.foreground = new FullSprite({
      src: "./img/map_foreground.png",
      position: { x: 0, y: 0 },
    });
    this.player = new BasicSprite({
      src: "./img/player.png",
      position: { x: 7, y: 4 },
      cells: {
        x: 0,
        y: 0,
        width: 1,
        height: 2,
      },
    });
    this.playerPosition = { x: 40, y: 60 };
    this.moving = false;
  }

  startBattle() {}

  getPosition({ position }) {
    return {
      x: this.player.position.x + position.x,
      y: this.player.position.y + position.y,
    };
  }

  handleInput() {
    if (!this.moving) {
      // Move
      const moves = [
        ["w", 0, -1],
        ["s", 0, 1],
        ["a", -1, 0],
        ["d", 1, 0],
      ];
      for (const move of moves) {
        const [key, dx, dy] = move;
        if (lastKey === key && keys[key].pressed) {
          gsap.to(this.playerPosition, {
            x: this.playerPosition.x + dx,
            y: this.playerPosition.y + dy,
            onComplete: () => {
              this.moving = false;
            },
          });
          this.moving = true;
        }
      }
    }
  }

  draw() {
    this.handleInput();
    const offset = {
      x: -this.playerPosition.x,
      y: -this.playerPosition.y,
    };
    this.background.draw(offset);
    this.player.draw();
    this.foreground.draw(offset);
  }
}
const mapManager = new MapManager();
