import bluebrick from './bluebrick.png';
import greenbrick from './greenbrick.png';
import redbrick from './redbrick.png';
import orangebrick from './orangebrick.png';



export default class Bricks{
  constructor(backCtx){
    this.images = [];
    this.blue = new Image();
    this.blue.src = bluebrick;
    this.green = new Image();
    this.green.src = greenbrick;
    this.red = new Image();
    this.red.src = redbrick;
    this.orange = new Image();
    this.orange.src = orangebrick;

    this.images[0] = this.red;
    this.images[1] = this.red;

    this.images[2] = this.orange;
    this.images[3] = this.orange;

    this.images[4] = this.green;
    this.images[5] = this.green;

    this.images[6] = this.blue;
    this.images[7] = this.blue;

    this.backCtx = backCtx;
    this.bricks = [];
    this.redBricks1 = [];
    this.initializeBricks(this.redBricks1, 0);
    this.bricks[0] = this.redBricks1;
    this.redBricks2 = [];
    this.initializeBricks(this.redBricks2, 1);
    this.bricks[1] = this.redBricks2;
    this.orangeBricks1 = [];
    this.initializeBricks(this.orangeBricks1, 2);
    this.bricks[2] = this.orangeBricks1;
    this.orangeBricks2 = [];
    this.initializeBricks(this.orangeBricks2, 3);
    this.bricks[3] = this.orangeBricks2;
    this.greenBricks1 = [];
    this.initializeBricks(this.greenBricks1, 4);
    this.bricks[4] = this.greenBricks1;
    this.greenBricks2 = [];
    this.initializeBricks(this.greenBricks2, 5);
    this.bricks[5] = this.greenBricks2;
    this.blueBricks1 = [];
    this.initializeBricks(this.blueBricks1, 6);
    this.bricks[6] = this.blueBricks1;
    this.blueBricks2 = [];
    this.initializeBricks(this.blueBricks2, 7);
    this.bricks[7] = this.blueBricks2;


    this.initializeBricks = this.initializeBricks.bind(this);
    this.checkCollision = this.checkCollision.bind(this);
    this.clamp = this.clamp.bind(this);
  }

  update(item){
    return this.checkCollision(item);
  }

//TODO use custom graphics instead of placeholder canvas rendering
  render(){
    this.backCtx.save();
    for(var j = 0; j < 8; j++){
      for(var i = 0; i < 20; i++){
        if(this.bricks[j][i].broken == false){
          this.backCtx.drawImage(this.images[j], this.bricks[j][i].x, this.bricks[j][i].y);
        }
      }
    }
    this.backCtx.restore();
  }

  initializeBricks(brickArray, rowNumber){
    var xpos = 0;
    var brickWidth = 50;
    for(var i = 1; i < 21; i++){
      brickArray.push({x: xpos, y: rowNumber * 50, broken: false});
      xpos = i * brickWidth;
    }
  }

  checkCollision(item){
    // var itemIndexX = Math.floor(item.x / 50);
    // var itemIndexY = Math.floor(item.y / 50);
    //
    // var brickToCheck;
    // if(itemIndexX < 20 && itemIndexY < 8 && itemIndexX >= 0 && itemIndexY >= 0){
    //    brickToCheck = this.bricks[itemIndexY][itemIndexX];
    //    var brickTop = Math.abs(brickToCheck.y - item.y);
    //    var brickBottom = Math.abs(brickToCheck.y + 50 - item.y);
    //    var brickLeft = Math.abs(brickToCheck.x - item.x);
    //    var brickRight = Math.abs(brickToCheck.x  + 50 - item.x);
    //    var side;
    //    if(brickTop < brickBottom){
    //      side = "top";
    //    }
    // // }

    // var rx = this.clamp((item.x + 5), brickToCheck.x, brickToCheck.x + 50);
    // var ry = this.clamp((item.y + 5), brickToCheck.y, brickToCheck.y + 50);
    // var distSquared = Math.pow(rx - (item.x -5), 2) + Math.pow(ry - (item.y - 5), 2);
    // if(distSquared < Math.pow((item.size / 2), 2)) {
    //   this.bricks[itemIndexY][itemIndexX].broken = true;
    //   console.log(item.x, item.y);
    //   console.log(brickToCheck.x, brickToCheck.y);
    //   return {hit: true, x: brickToCheck.x, y: brickToCheck.y, row: itemIndexY};
    // }



    // if(brickToCheck != null && !brickToCheck.broken){
    for(var j = 0; j < 8; j++){
      for(var i = 0; i < 20; i++){
        if(this.bricks[j][i].broken == false){
          var rx = this.clamp(item.x, this.bricks[j][i].x, this.bricks[j][i].x + 50);
          var ry = this.clamp(item.y, this.bricks[j][i].y, this.bricks[j][i].y + 50);
          var distSquared = Math.pow(rx - item.x, 2) + Math.pow(ry - item.y, 2);
          if(distSquared < Math.pow((item.size / 2), 2)) {
            this.bricks[j][i].broken = true;

            var brickToCheck = this.bricks[j][i];
            var brickTop = Math.abs(brickToCheck.y - item.y);
            var brickBottom = Math.abs(brickToCheck.y + 50 - item.y);
            var brickLeft = Math.abs(brickToCheck.x - item.x);
            var brickRight = Math.abs(brickToCheck.x  + 50 - item.x);
            var side;
            if(brickTop < brickBottom && brickTop < brickLeft && brickTop < brickRight){
              side = "top";
            }
            else if(brickBottom < brickTop && brickBottom < brickLeft && brickBottom < brickRight){
              side = "bottom";
            }
            else if(brickRight < brickTop && brickRight < brickBottom && brickRight < brickLeft){
              side = "right";
            }
            else if(brickLeft < brickTop && brickLeft < brickBottom && brickLeft < brickRight){
              side = "left";
            }

            console.log(item.x, item.y);
            console.log(this.bricks[j][i].x, this.bricks[j][i].y);
            console.log(side);
            return {hit: true, x: this.bricks[j][i].x, y: this.bricks[j][i].y, row: j, side: side};
          }
        }
      }
    }

    // }
    return {hit: false};
  }


  clamp = function(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }
}
