export default class Paddle{
  constructor(backCtx, screenCanvas){
    this.backCtx = backCtx;
    this.canvas = screenCanvas;
    this.width = 150;
    this.height = 20;
    this.x = 500;
    this.y = 900;
    this.oldX = 500;
    this.speed = 0;

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove(event){
    event.preventDefault();
    var rect = this.canvas.getBoundingClientRect();
    var x = Math.round((event.clientX-rect.left)/(rect.right-rect.left)*this.canvas.width);
    if(x > 0 && x < 1000){
      this.x = x;
    }
  }

  update(gotime){
    var dx = this.oldX - this.x;
    if(dx > 5){
      dx = 5;
    }
    else if(dx < -5){
      dx = -5;
    }
    this.speed = dx;
    this.oldX = this.x;
    if(gotime){
      this.width = 100;
    }
    else{
      this.width = 150;
    }
  }

//TODO use custom graphics instead of placeholder canvas rendering
  render(){
    this.backCtx.save();
    this.backCtx.fillStyle = "yellow";
    this.backCtx.fillRect(this.x - 50, this.y, this.width, this.height);
    this.backCtx.restore();
  }

  getCoordinates(){
    return{x: this.x, y: this.y, speed: this.speed};
  }
}
