import Game from './game';
import Paddle from './paddle';
import Ball from './ball';
import Stars from './stars';
import title from './title.png';
import Bricks from './bricks';
import theme from './music/trialofthecrap.wav';
import start1 from './images/start1.png';
import start2 from './images/start2.png';
import highscores1 from './images/highscores1.png';
import highscores2 from './images/highscores2.png';
import Highscores from './highscores.js';

/** @class App
  * controlls the overall breakout game including all state transitions
  */

  export default class App{
    constructor(){
      //set up state machine
      // 1. Title Screen with starfield and flashing heading >> 2. Main menu if any key pressed or mouse click
      // 2. Select Screen with starfield and nonflashing heading, two options >> 3. New Game if space bar pressed >> 5. High Scores if H pressed (might rework to up down highlighted)
      // 3. New Game instantiates a Game object with lives, score recording, active.  When lives decremented to 0 >> 4. Initials entering screen
      // 4. Initials entering screen gets user input for 3 char initials and proceeds on a return keypress, saving the value as well as the score in the highScores array >> 5. High scrores
      // 5. High Scores displaying all entries or TJV with 1 point if empty >> 1. Title Screen if space bar pressed

      this.state = 1;
      this.timeout = 0;
      this.won = false;

      this.soundFile = document.createElement("audio");
      this.soundFile.preload = "auto";

      this.hs;

      //Load the sound file (using a source element for expandability)

      this.soundFile.src = theme;
      this.soundFile.loop = true;
      this.soundFile.play();

      //set up title image
      this.title1 = new Image();
      this.title1.src = title;

      this.start1 = new Image();
      this.start1.src = start1;
      this.start2 = new Image();
      this.start2.src = start2;
      this.highscores1 = new Image();
      this.highscores1.src = highscores1;
      this.highscores2 = new Image();
      this.highscores2.src = highscores2;

      this.mousex = 0;
      this.mousey = 0;


      //set up the high scrores stack
      this.highScores = [];
      this.currentscore = 0;
      this.initialtemp = "";
      this.initialtopush = [];
      this.initialnumber = 0;
      this.scorestack = [];
      this.scorestack[0] = {score: 3000, initials: "TJV"};

      //game holder
      this.game;

      //set up back buffer
      this.backBufferCanvas = document.createElement('canvas');
      this.backBufferCanvas.className = 'main';
      this.backBufferCanvas.width = 1000;
      this.backBufferCanvas.height = 1000;
      this.backBufferContext = this.backBufferCanvas.getContext('2d');
      //document.body.appendChild(this.backBufferCanvas);
      //set up screen buffer
      this.screenBufferCanvas =  document.createElement('canvas');
      this.screenBufferCanvas.className = 'main';
      this.screenBufferCanvas.width = 1000;
      this.screenBufferCanvas.height = 1000;
      document.body.appendChild(this.screenBufferCanvas);
      this.screenBufferContext = this.screenBufferCanvas.getContext('2d');

      //set up starfield object
      this.stars = new Stars(this.backBufferContext, this.backBufferCanvas);

      this.handleKeyPress = this.handleKeyPress.bind(this);
      window.addEventListener('keypress', this.handleKeyPress);

      this.handleMouseMove = this.handleMouseMove.bind(this);
      window.addEventListener('mousemove', this.handleMouseMove);

      this.handleMouseDown = this.handleMouseDown.bind(this);
      window.addEventListener('mousedown', this.handleMouseDown);


      this.titleDisplay = this.titleDisplay.bind(this);
      this.titleUpdate = this.titleUpdate.bind(this);
      this.update = this.update.bind(this);
      this.render = this.render.bind(this);
      this.loop = this.loop.bind(this);
      this.interval = setInterval(this.loop, 16.7);
      this.alpha = 1.0;
      this.cursoralpha = 1.0;

      this.titleChoiceDisplay = this.titleChoiceDisplay.bind(this);
      this.displayUserInitials = this.displayUserInitials.bind(this);
      this.cursorUpdate =  this.cursorUpdate.bind(this);
    }

    update(){
      switch(this.state){
        case 1:
          this.stars.update();
          this.titleUpdate();
          break;
        case 2:
          this.stars.update();
          this.alpha = 1;
          if(this.timeout < 10)this.timeout++;
          break;
        case 3:
          var gameover = this.game.update();
          if(gameover.dead){
            this.state = 4;
            this.currentscore = gameover.score;
            if(gameover.win){
              this.won = true;
            }
            this.screenBufferCanvas.style.border = '1px solid #000';
          }
          break;
        case 4:
          this.titleUpdate();
          this.cursorUpdate();
          break;
        case 5:
          var wedone = this.hs.update();
          if(!wedone){
            this.state = 1;
            this.screenBufferCanvas.style.cursor = 'default';
            this.soundFile.currentTime = 0;
            this.soundFile.play();
          }
          break;
      }
    }

    render(){
      this.backBufferContext.fillStyle = 'black';
      this.backBufferContext.fillRect(0, 0, 1000, 1000);
      switch(this.state){
        case 1:
          this.stars.render();
          this.titleDisplay();
          break;
        case 2:
          this.stars.render();
          this.titleDisplay();
          this.titleChoiceDisplay();
          break;
        case 3:
          this.game.render();
          break;
        case 4:
          this.displayUserInitials();
          break;
        case 5:
          this.hs.render();
          break;
      }
      this.screenBufferContext.drawImage(this.backBufferCanvas,0,0);
    }

    loop(){
      this.update();
      this.render();
    }

    titleDisplay(){
      this.backBufferContext.globalAlpha = this.alpha;
      this.backBufferContext.drawImage(this.title1, (this.screenBufferCanvas.width / 2) - 400, 200);
      this.backBufferContext.globalAlpha = 1;
    }
    titleUpdate(){
      if(this.alpha <= 0.1){
        this.alpha = 1.0;
      }
      else{
        this.alpha = this.alpha - 0.01;
      }
    }
    cursorUpdate(){
      if(this.cursoralpha <= 0.1){
        this.cursoralpha = 1.0;
      }
      else{
        this.cursoralpha = this.cursoralpha - 0.1;
      }
    }
    titleChoiceDisplay(){
      if(this.mousex >= 200 && this.mousex <= 300 && this.mousey >= 225 && this.mousey <= 245  ){
        this.backBufferContext.drawImage(this.start2, (this.screenBufferCanvas.width / 2) - 100, 450);
      }
      else{
        this.backBufferContext.drawImage(this.start1, (this.screenBufferCanvas.width / 2) - 100, 450);
      }
      if(this.mousex >= 200 && this.mousex <= 300 && this.mousey >= 250 && this.mousey <= 270  ){
        this.backBufferContext.drawImage(this.highscores2, (this.screenBufferCanvas.width / 2) - 100, 500);
      }
      else{
        this.backBufferContext.drawImage(this.highscores1, (this.screenBufferCanvas.width / 2) - 100, 500);
      }
    }

    handleMouseMove(event){
      event.preventDefault();
      this.mousex = event.offsetX;
      this.mousey = event.offsetY;
    }

    handleMouseDown(event){
      event.preventDefault();
      if(event.which == 1 && this.state == 1){
        this.state = 2;
      }
      var mouseclickx = event.offsetX;
      var mouseclicky = event.offsetY;
      if(mouseclickx >= 200 && mouseclickx <= 300 && mouseclicky >= 225 && mouseclicky <= 245){
        if(this.state == 2 && this.timeout >= 10){
          this.state = 3;
          this.timeout = 0;
          this.screenBufferCanvas.style.cursor = 'none';
          this.game = new Game(this.backBufferContext, this.screenBufferCanvas);
          this.soundFile.pause();
        }
      }
      if(mouseclickx >= 200 && mouseclickx <= 300 && mouseclicky >= 250 && mouseclicky <= 270  ){
        if(this.state == 2 && this.timeout >= 10){
          this.state = 5;
          this.hs = new Highscores(this.backBufferContext, this.scorestack);
          this.soundFile.pause();
        }
      }
    }

    handleKeyPress(event){
      event.preventDefault();
      if(this.state == 1){
        this.state = 2;
      }
      else if (this.state == 4){
        switch(event.keyCode){
          case 13:
            if(this.initialnumber < 2){
              //store that initial
              this.initialtopush[this.initialnumber] = this.initialtemp;
              this.initialnumber++;
            }
            else{
              //we got all 3, bounce
              this.initialtopush[this.initialnumber] = this.initialtemp;
              var word = this.initialtopush[0] +  this.initialtopush[1] +  this.initialtopush[2];
              this.scorestack.push({score: this.currentscore, initials: word});
              this.hs = new Highscores(this.backBufferContext, this.scorestack);
              this.initialnumber = 0;
              this.initialtopush = [];
              this.initialtemp = "";
              this.state = 5;
            }
            break;
          default:
            //handle the key they entered
            this.initialtemp = "" + String.fromCharCode(event.which);
            break;
        }
      }
    }

    displayUserInitials(){
      this.backBufferContext.fillStyle = "white";
      this.backBufferContext.font = "200px Monospace";
      this.backBufferContext.fillText(this.currentscore, 375, 300);

      if(this.won){
        this.backBufferContext.fillStyle = "white";
        this.backBufferContext.font = "100px Monospace";
        this.backBufferContext.fillText("WINNER WINNER", 120, 700);
        this.backBufferContext.fillText("POULTRY SUPPER", 120, 800);
      }


      var color = "rgba(255, 255, 255, ";
      color = color + this.cursoralpha + ")";
      this.backBufferContext.fillStyle = color;
      this.backBufferContext.fillRect((this.screenBufferCanvas.width / 2 - 100) + (this.initialnumber* 50), this.screenBufferCanvas.height / 2, 50, 10);
      var color2 = "rgba(255, 255, 255, ";
      color2 = color2 + this.alpha + ")";
      this.backBufferContext.fillStyle = color2;
      this.backBufferContext.font = '100px monospace';
      this.backBufferContext.fillText(this.initialtemp, this.screenBufferCanvas.width / 2 - 105 + (this.initialnumber * 50), this.screenBufferCanvas.height / 2 - 10);

      if(this.initialtopush[0] != null){
        this.backBufferContext.fillStyle = "white";
        for(var i = 0; i < this.initialtopush.length; i++){
          this.backBufferContext.fillText(this.initialtopush[i], this.screenBufferCanvas.width / 2 - 105 + (i * 50), this.screenBufferCanvas.height / 2 - 10);
        }
      }
    }
  }
