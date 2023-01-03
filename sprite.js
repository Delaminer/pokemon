const scale = 1;
class Sprite {
  constructor({ src }) {
    this.image = new Image();
    this.image.src = src;
  }

  draw({ source: { left, right, top, bottom }, destination: { x, y } }) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    // console.log({ source: { left, right, top, bottom }, destination: {x, y}})
    ctx.drawImage(
      this.image,
      left,
      top,
      right - left,
      bottom - top,
      x * scale,
      y * scale,
      (right - left) * scale,
      (bottom - top) * scale
    );
    //     ctx.drawImage(
    //     this.image,
    //     this.frames.val * this.width,
    //     0,
    //     this.image.width / this.frames.max,
    //     this.image.height,
    //     this.position.x,
    //     this.position.y,
    //     this.image.width / this.frames.max,
    //     this.image.height
    //   );
  }
}
class AnimatedSprite {}
class BasicSprite extends Sprite {
  constructor({ src, position, cells }) {
    super({ src });
    this.position = position;
    this.cells = cells;
  }
  draw(offset = {x: 0, y: 0}) {
    super.draw({
      source: {
        left: this.cells.x * 16,
        right: (this.cells.x + this.cells.width) * 16,
        top: this.cells.y * 16,
        bottom: (this.cells.y + this.cells.height) * 16,
      },
      destination: {
        x: (this.position.x + offset.x) * 16,
        y: (this.position.y + offset.y - this.cells.height + 1) * 16,
      },
    });
  }
}
class FullSprite extends Sprite {
  constructor({ src, position }) {
    super({ src });
    this.position = position;
  }
  draw(offset = {x: 0, y: 0}) {
    // console.log(this.image)
    // ctx.drawImage(this.image, -80 * 16, 0 * 16);
    ctx.drawImage(this.image, (this.position.x + offset.x) * 16, (this.position.y + offset.y) * 16);
  }
}
