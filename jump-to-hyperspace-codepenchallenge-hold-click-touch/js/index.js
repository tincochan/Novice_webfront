function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const randomInRange = (min, max) =>
Math.floor(Math.random() * (max - min)) + min;

const VELOCITY_BASE = 1;
const VELOCITY_LIMIT = 2;
const BASE_SIZE = 10;
const BASE_SCALE = 0.1;
const ALPHA_STEP = 0.02;
const ALPHA_LIMIT = 1;
const SCALE_STEP = 0.001;

class Star {



















































































  constructor() {_defineProperty(this, "canvas", document.createElement('canvas'));_defineProperty(this, "context", this.canvas.getContext('2d'));_defineProperty(this, "STATE", { active: false, characteristics: { alpha: Math.random(), angle: randomInRange(0, 360) * (Math.PI / 180), size: BASE_SIZE, scale: BASE_SCALE } });_defineProperty(this, "activate", () => {this.STATE = { ...this.STATE, active: true };});_defineProperty(this, "reset", start => {const angle = randomInRange(0, 360) * (Math.PI / 180);const alpha = Math.random();const velocity = VELOCITY_BASE;const travelled = randomInRange(velocity === 0 ? window.innerWidth * 0.25 : window.innerWidth * 0.1, start ? start : innerWidth);const x = Math.floor(Math.sin(angle) * travelled) + innerWidth / 2;const y = Math.floor(Math.cos(angle) * travelled) + innerHeight / 2;const active = travelled > window.innerWidth * 0.1 || velocity === 0 ? true : false;this.STATE = { active, characteristics: { ...this.STATE.characteristics, alpha, angle, scale: BASE_SCALE, velocity }, position: { x, y }, distance: { travelled } };});_defineProperty(this, "render", () => {const { alpha, size } = this.STATE.characteristics;this.canvas.height = this.canvas.width = size;this.context.globalAlpha = alpha;this.context.fillStyle = '#eeeeee';this.context.beginPath();this.context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);this.context.fill();});_defineProperty(this, "update", jumping => {const x = Math.floor(Math.sin(this.STATE.characteristics.angle) * this.STATE.distance.travelled) + innerWidth / 2;const y = Math.floor(Math.cos(this.STATE.characteristics.angle) * this.STATE.distance.travelled) + innerHeight / 2;const velocity = jumping ? VELOCITY_LIMIT : this.STATE.characteristics.velocity;this.STATE = { ...this.STATE, characteristics: { ...this.STATE.characteristics, scale: velocity ? this.STATE.characteristics.scale + SCALE_STEP : this.STATE.characteristics.scale, velocity }, position: { x, y }, distance: { ...this.STATE.distance, travelled: this.STATE.distance.travelled + velocity } };});
    this.reset();
    this.canvas.height = this.canvas.width = this.STATE.characteristics.size;
    this.render();
  }}


class HyperSpace {
  constructor(options) {_defineProperty(this, "STATE",






    {
      jumping: false,
      starPool: [] });_defineProperty(this, "canvas",


    document.createElement('canvas'));_defineProperty(this, "context",
    this.canvas.getContext('2d'));_defineProperty(this, "render",
    () => {
      const { context } = this;
      context.save();
      if (!this.STATE.jumping && !this.STATE.toBeCleared)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Should we activate some items?
      if (!this.STATE.jumping && this.STATE.toBeCleared) {
        // Do something else instead of updating items
        if (this.STATE.blanketOpacity >= ALPHA_LIMIT) {
          this.STATE = {
            ...this.STATE,
            flashed: true,
            toBeCleared: false,
            jumping: false,
            starPool: this.generateStars(this.options.limit) };

        } else if (!this.STATE.flashed) {
          context.fillStyle = `rgba(255, 255, 255, ${this.STATE.blanketOpacity += ALPHA_STEP * 5})`;
          context.fillRect(0, 0, innerWidth, innerHeight);
        }

      } else {
        if (
        Math.random() > 0.75 &&
        this.STATE.starPool.filter(s => s.STATE.active === false).length > 0 &&
        !this.STATE.jumping)
        {
          this.STATE.starPool.filter(s => s.STATE.active === false)[0].activate();
        }

        for (const star of this.STATE.starPool) {
          // Check if it's within the bounds. If it isn't then it needs to be reset and deactivated
          if (
          star.STATE.position.x < 0 ||
          star.STATE.position.x > innerWidth ||
          star.STATE.position.y < 0 ||
          star.STATE.position.y > innerHeight && star.STATE.active)
          {
            star.reset(this.STATE.jumping ? undefined : 50);
          } else if (star.STATE.active) {
            star.update(this.STATE.jumping);
            context.drawImage(
            star.canvas,
            star.STATE.position.x - star.STATE.characteristics.size / 2,
            star.STATE.position.y - star.STATE.characteristics.size / 2,
            star.STATE.characteristics.size * star.STATE.characteristics.scale,
            star.STATE.characteristics.size * star.STATE.characteristics.scale);

          }
        }
        if (this.STATE.blanketOpacity >= 0) {
          context.fillStyle = `rgba(0, 0, 0, ${this.STATE.blanketOpacity -= ALPHA_STEP})`;
          context.fillRect(0, 0, innerWidth, innerHeight);
        }
      }
      requestAnimationFrame(this.render);
    });_defineProperty(this, "jump",
    () => {
      this.STATE = {
        ...this.STATE,
        jumping: true,
        toBeCleared: true,
        flashed: false,
        blanketOpacity: 0,
        initiated: new Date().getTime() };

    });_defineProperty(this, "slow",
    () => {
      // At this stage we need to clear the jets and then reset all the stars to new position
      const stop = new Date().getTime();
      if (stop - this.STATE.initiated >= 2000) {
        this.STATE.jumping = false;
      } else {
        this.STATE = {
          ...this.STATE,
          jumping: false,
          toBeCleared: false };

      }
    });_defineProperty(this, "bindAction",
    () => {
      this.canvas.addEventListener('mousedown', this.jump);
      this.canvas.addEventListener('touchstart', this.jump);
      this.canvas.addEventListener('mouseup', this.slow);
      this.canvas.addEventListener('touchend', this.slow);
    });_defineProperty(this, "generateStars",
    amount => {
      const result = [];
      for (let s = 0; s < amount; s++) {
        result.push(new Star());
      }
      return result;
    });_defineProperty(this, "reset",
    () => {
      this.STATE = {};
      this.setup();
    });_defineProperty(this, "setup",
    () => {
      this.canvas.height = innerHeight;
      this.canvas.width = innerWidth;
      this.STATE.starPool = this.generateStars(this.options.limit);
    });this.options = options;this.setup();document.body.appendChild(this.canvas);this.render();this.bindAction();}}

const myHyperspace = new HyperSpace({
  limit: 1000 });

window.addEventListener(
'resize',
_.debounce(() => {
  myHyperspace.reset();
}, 250));