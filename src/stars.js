export default class Stars{
  constructor(backCtx, backCanvas){
    this.backCtx = backCtx;
    this.canvas = backCanvas;
    this.allStars = [];
    for(var i = 0; i < 150; i++){
      this.allStars.push({x: Math.random()*this.canvas.width, y: Math.random()*this.canvas.height, z: Math.random()*this.canvas.width});
    }
    this.focalLength = this.canvas.width;
    this.cX = this.canvas.width/2;
    this.cY = this.canvas.height/2;
    this.radius = 1;
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);

  }

  handleMouseMove(event){
    event.preventDefault();
    var x = event.offsetX / (this.canvas.width / 4);
    var y = event.offsetY / (this.canvas.height / 4);
    this.cX = this.canvas.width / (x + 2);
    this.cY = this.canvas.height / (y + 2);
  }

  update(){
    var self = this;
    this.allStars.forEach(function(star){
      star.z = star.z - 10;
      if(star.z <= 0){
        star.z = self.canvas.width;
      }
    });
  }

  render(){
    var xScale;
    var yScale;
    var newSize;
    this.backCtx.save();
    this.backCtx.fillStyle = "black";
    this.backCtx.fillRect(0,0, this.canvas.width, this.canvas.height);
    var self = this;
    this.allStars.forEach(function(star){
      xScale = (star.x - self.cX) * (self.focalLength / star.z);
      xScale = xScale + self.cX;

      yScale = (star.y - self.cY) * (self.focalLength / star.z);
      yScale = yScale + self.cY;

      newSize = self.radius * (self.focalLength / star.z);

      self.backCtx.fillStyle = "white";
      self.backCtx.beginPath();
      self.backCtx.arc(xScale, yScale, newSize, 0, Math.PI*2);
      self.backCtx.fill();
    });
    this.backCtx.restore();
  }
}
