import bloop from './sfx/bloop.mp3';
import blip from './sfx/blip.mp3';

export default class Ball{
  constructor(backCtx){
    this.backCtx = backCtx;
    this.x = 500;
    this.y = 600;
    this.vX = 1;

    this.size = 10;
    this.speed = 10;
    this.vY = this.speed;

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.checkOutOfBounds = this.checkOutOfBounds.bind(this);
    this.checkCollision = this.checkCollision.bind(this);
    this.checkWall = this.checkWall.bind(this);
    this.resetStart = this.resetStart.bind(this);
    this.clamp = this.clamp.bind(this);
  }

  update(item, hitBrick){
    if(hitBrick.hit){
      switch(hitBrick.side){
        case "top":
        case "bottom":
          this.vY = -this.vY;
          break;
        case "left":
        case "right":
          this.vX = -this.vX;
          break;
      }
    }
    else{
      this.checkCollision(item);
      this.checkWall();
    }
    this.x += this.vX;
    this.y += this.vY;
    if(this.checkOutOfBounds()){
      return false;
    }
    else{
      return true;
    }
  }

//TODO use custom graphics instead of placeholder canvas rendering
  render(){
    this.backCtx.save();
    this.backCtx.fillStyle = "white";
    this.backCtx.beginPath();
    this.backCtx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    this.backCtx.fill();
    this.backCtx.restore();
  }

  checkCollision(item){
    var rx = this.clamp(this.x, (item.x - 50), (item.x - 50) + item.width);
    var ry = this.clamp(this.y, item.y, item.y + item.height);
    var distSquared = Math.pow(rx - this.x, 2) + Math.pow(ry - this.y, 2);
    if(distSquared < Math.pow(this.size / 2, 2)) {
      // Collision between circle and rect
      this.vY = -this.speed;
      this.vX += (item.speed / 2);
      var soundFile = document.createElement("audio");
      soundFile.preload = "auto";

      //Load the sound file (using a source element for expandability)

      soundFile.src = bloop;
      soundFile.play();
    }


    /*var upX = this.x - this.size;
    var upY = this.y - this.size;
    var downX = this.x + this.size;
    var downY = this.y + this.size;

    if(upY < (item.y + item.height) && downY > item.y && upX < (item.x + item.width) && downX > item.x){
      this.vY = -3;
      this.vX = -this.vX;
      this.vX -= (item.speed / 2);
    }
    */
  }

  checkWall(){
    if((this.x <= 0 ||  this.x >= 1000) && this.y <= 1000){
      this.vX = -this.vX;
      var soundFile = document.createElement("audio");
      soundFile.preload = "auto";

      //Load the sound file (using a source element for expandability)

      soundFile.src = blip;
      soundFile.play();
    }
    if(this.y <= 0){
      this.vY = -this.vY;
      var soundFile = document.createElement("audio");
      soundFile.preload = "auto";

      //Load the sound file (using a source element for expandability)

      soundFile.src = blip;
      soundFile.play();
    }
  }

  //returns true if ball is out of bounds
  checkOutOfBounds(){
    if(this.y > 1000){
      return true;
    }
    else{
      return false;
    }
  }

  resetStart(){
    this.x = 500;
    this.y = 600;
    this.vx = 1;
    this.vy = this.speed;
  }

  clamp = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
}
