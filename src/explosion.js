export default class Explosion{
  constructor(backCtx, x, y){
    this.startX = x + 25;
    this.startY = y + 25;
    this.backCtx = backCtx;
    this.particles = [];
    this.generateParticles = this.generateParticles.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.aliveCounter = 0;
    this.generateParticles();
  }

  update(){
    this.particles.forEach(function (particle){
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha = particle.alpha - 0.01;
    });
    this.aliveCounter++;
  }

  render(){
    var self = this;
    this.backCtx.save();
    this.particles.forEach(function (particle){
      var colorAlpha = 'rgba(169, 169, 169, ' + particle.alpha + ')';
      self.backCtx.fillStyle = colorAlpha;
      self.backCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    this.backCtx.restore();
  }

  generateParticles(){
    this.particles.push({x: this.startX, y: this.startY, vx: 0, vy: 2, size: 8, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: 0, vy: -2, size: 8, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: 2, vy: 0, size: 8, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: -2, vy: 0, size: 8, alpha: 1.0});

    this.particles.push({x: this.startX, y: this.startY, vx: 2, vy: -4, size: 4, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: 2, vy: 4, size: 4, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: -2, vy: 4, size: 4, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: -2, vy: -4, size: 4, alpha: 1.0});

    this.particles.push({x: this.startX, y: this.startY, vx: 3, vy: 1, size: 2, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: 3, vy: -1, size: 2, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: -3, vy: 1, size: 2, alpha: 1.0});
    this.particles.push({x: this.startX, y: this.startY, vx: -3, vy: -1, size: 2, alpha: 1.0});
  }
}
