import blue from './images/blue/bluesheet.png';

export default class Game{
  constructor(backCtx, x, y){
    this.backCtx = backCtx;
    this.x = x;
    this.y = y;
    this.frameNumber = -1;
    this.sheet = new Image();
    this.sheet.src = blue;
  }
  update(){
    this.frameNumber++;
  }

  render(){
    this.backCtx.save();
    if(this.frameNumber < 16){
      this.backCtx.drawImage(this.sheet, this.frameNumber * 50, 0, 50, 50, this.x, this.y, 50, 50);
    }
    this.backCtx.restore();
  }

}
