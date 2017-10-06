import Paddle from './paddle';
import Ball from './ball';
import Bricks from './bricks';
import Explosion from './explosion';
import beep from './sfx/beep.mp3';
import blam from './sfx/blam.mp3';
import blip from './sfx/blip.mp3';
import death from './sfx/death.mp3';
import gameover from './sfx/gameover.mp3';
import AnimateBrick from './animatebrick';
import scoreball1 from './images/ball1.png';
import livestext from './images/livestext.png';

import ready1 from './images/ready1.png';
import ready2 from './images/ready2.png';
import ready3 from './images/ready3.png';
import ready4 from './images/ready4.png';
import ready5 from './images/ready5.png';
import ready6 from './images/ready6.png';



export default class Game{
  constructor(backCtx, screenCanvas){
    this.readyframes = [];
    this.ready1 = new Image();
    this.ready1.src = ready1;
    this.readyframes[0] = this.ready1;
    this.ready2 = new Image();
    this.ready2.src = ready2;
    this.readyframes[1] = this.ready2;
    this.ready3= new Image();
    this.ready3.src = ready3;
    this.readyframes[2] = this.ready3;
    this.ready4 = new Image();
    this.ready4.src = ready4;
    this.readyframes[3] = this.ready4;
    this.ready5 = new Image();
    this.ready5.src = ready5;
    this.readyframes[4] = this.ready5;
    this.ready6 = new Image();
    this.ready6.src = ready6;
    this.readyframes[5] = this.ready6;

    this.readytimer = 0;
    this.gotime = false;

    //create stack for storing animations to execute then get rid of
    this.animationStack = [];
    this.score = 0;
    this.brickskilled = 0;

    this.scoreBall = new Image();
    this.scoreBall.src = scoreball1;

    //border animation management
    this.bordertimer = 0;
    this.borderspeed = 80;
    this.borderstepping = 2.5;

    this.livestext = new Image();
    this.livestext.src = livestext;

    //create the score canvas and context
    this.scoreCanvas = document.createElement('canvas');
    this.scoreCanvas.className = "score";
    this.scoreCanvas.width = 1000;
    this.scoreCanvas.height = 260;
    this.sctx = this.scoreCanvas.getContext('2d');
    document.body.appendChild(this.scoreCanvas);

    this.raCanvas = document.createElement('canvas');
    this.raCanvas.className = "rightambient";
    this.raCanvas.width = 200;
    this.raCanvas.height = 1000;
    this.ractx = this.raCanvas.getContext('2d');
    document.body.appendChild(this.raCanvas);

    this.laCanvas = document.createElement('canvas');
    this.laCanvas.className = "leftambient";
    this.laCanvas.width = 200;
    this.laCanvas.height = 1000;
    this.lactx = this.laCanvas.getContext('2d');
    document.body.appendChild(this.laCanvas);

    this.canvas = screenCanvas;
    this.canvas.style.border = '10px solid #FFF';
    this.over = false;
    this.lives = 3;
    // Set the back buffer canvas
    this.backCtx = backCtx;

    //test paddle
    this.paddle = new Paddle(this.backCtx, this.canvas);

    //test bricks
    this.brickys = new Bricks(this.backCtx);

    //test ball
    this.ball = new Ball(this.backCtx);
    this.deathTimeout = 0;

    //current bricks blowing up
    this.explosions = [];

    // Bind class functions
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.renderLives = this.renderLives.bind(this);
    this.soundPlay = this.soundPlay.bind(this);
    this.leftBorderAnimate = this.leftBorderAnimate.bind(this);
    this.blackScreens = this.blackScreens.bind(this);
    this.renderScore = this.renderScore.bind(this);
    this.ready = this.ready.bind(this);
  }

  renderLives(){
    for(var i = 0; i < this.lives; i++){
      //this is dumb just use an image or a gif or something
      this.sctx.save();
      this.sctx.drawImage(this.scoreBall, i * 120 + 10, 100);

      this.sctx.restore();
    }
  }

  renderScore(){
    this.sctx.save();
    this.sctx.fillStyle = "white";
    this.sctx.font = "100px Monospace";
    this.sctx.fillText(this.score, 700, 100);
    this.sctx.restore();
  }

  update(){
      this.paddle.update(this.gotime);
      var hitBrick = this.brickys.update(this.ball);
      if(hitBrick.hit){
        this.brickskilled++;
        //play blam
        switch(hitBrick.row){
          case 0:
          case 1:
            this.score += 70;
            break;
          case 2:
          case 3:
            if(!this.gotime){
              this.gotime = true;
            }
            this.score += 50;
            break;
          case 4:
          case 5:
            this.score += 30;
            break;
          case 6:
          case 7:
            this.score += 10;
            break;
        }
        this.soundPlay(blam);
        this.animationStack.push(new AnimateBrick(this.backCtx, hitBrick.x, hitBrick.y));
        this.explosions.push(new Explosion(this.backCtx, hitBrick.x, hitBrick.y));
      }

      //ball returns false if it has dropped out of bounds
      var alive = this.ball.update(this.paddle, hitBrick, this.brickskilled);
      if(!alive)
      {
        if(this.deathTimeout == 0){
          this.soundPlay(death);
          this.lives--;
          this.gotime = false;
          this.borderspeed = this.borderspeed / 2;
          this.borderstepping = this.borderstepping * 2;
        }

        //start lifeover timeout
        this.deathTimeout++;
        if(this.deathTimeout % 20 == 0 && this.readytimer < 6){
          this.readytimer++;
          console.log(this.readytimer);
        }
        //set state to lifeover
        //update number of lives

        //when lifeover timeout met, reset ball position, state to alive (if all lives not lost), reset lifeover timer
        if(this.deathTimeout === 120){
          this.ball = new Ball(this.backCtx);
          this.deathTimeout = 0;
          this.readytimer = 0;
        }
      }
      if(this.explosions[0] != null){

        for(var i = 0; i < this.explosions.length; i++){
          this.explosions[i].update();
        }

        if(this.explosions[0].aliveCounter >= 100){
          this.explosions.shift();
        }
      }

      if(this.animationStack[0] != null){

        for(var i = 0; i < this.animationStack.length; i++){
          this.animationStack[i].update();
        }
        if(this.animationStack[0].frameNumber >= 16){
          this.animationStack.shift();
        }
      }

      if(this.lives < 1 && this.deathTimeout >= 119){
        this.blackScreens();
        this.soundPlay(gameover);
        return {dead: true, score: this.score};
      }
      else if(this.brickskilled >= 160){
        this.blackScreens();
        return {dead: true, score: this.score, win: true};
      }
      return {dead: false};

  }

  render() {
    //if in lifeover, display message
    //if in gameplay, do normal
    //if in game over, display message and prepare to exit
    this.backCtx.save();
    this.backCtx.strokeStyle = "white";
    this.paddle.render();
    this.ball.render();
    this.brickys.render();
    if(this.explosions[0] != null){
      for(var i = 0; i < this.explosions.length; i++){
        this.explosions[i].render();
      }
    }

    if(this.animationStack[0] != null){
      for(var i = 0; i < this.animationStack.length; i++){
        this.animationStack[i].render();
      }
    }

    this.backCtx.restore();

    this.sctx.fillStyle = "black";
    this.sctx.fillRect(0, 0, this.scoreCanvas.width, this.scoreCanvas.height);
    this.renderLives();
    this.sctx.drawImage(this.livestext, 10, 30);

    this.lactx.fillStyle = "black";
    this.lactx.fillRect(0, 0, this.laCanvas.width, this.laCanvas.height);

    this.ractx.fillStyle = "black";
    this.ractx.fillRect(0, 0, this.raCanvas.width, this.raCanvas.height);

    this.renderScore();

    if(this.deathTimeout != 0 && this.lives > 0){
      this.ready();
    }

    if(this.lives > 0)this.leftBorderAnimate();
  }

    soundPlay(file){
      var soundFile = document.createElement("audio");
      soundFile.preload = "auto";

      //Load the sound file (using a source element for expandability)

      soundFile.src = file;
      soundFile.play();
    }

    leftBorderAnimate(){
      var gradient = this.lactx.createLinearGradient(200, 0, 200 - (this.bordertimer * this.borderstepping), 0, 0);
      gradient.addColorStop(0,"green");
      gradient.addColorStop(1,"black");
      this.lactx.fillStyle = gradient;
      this.lactx.fillRect(0, 200, 200, 1000);

      var gradient2 = this.ractx.createLinearGradient(0, 0, this.bordertimer * this.borderstepping, 0);
      gradient2.addColorStop(0,"green");
      gradient2.addColorStop(1,"black");
      this.ractx.fillStyle = gradient2;
      this.ractx.fillRect(0, 200, 200, 1000);

      this.bordertimer++;
      if(this.bordertimer >= this.borderspeed){
        this.bordertimer = 0;
      }
    }

    blackScreens(){
      this.sctx.fillStyle = "black";
      this.sctx.fillRect(0, 0, this.scoreCanvas.width, this.scoreCanvas.height);
      this.lactx.fillStyle = "black";
      this.lactx.fillRect(0, 0, this.scoreCanvas.width, this.scoreCanvas.height);
      this.ractx.fillStyle = "black";
      this.ractx.fillRect(0, 0, this.scoreCanvas.width, this.scoreCanvas.height);
    }

    ready(){
      this.backCtx.drawImage(this.readyframes[this.readytimer], 250, 500);
    }

}
