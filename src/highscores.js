import bgm from './music/endbgm.mp3';

export default class Paddle{
  constructor(backCtx, scorestack){
    this.backCtx = backCtx;
    this.scrollpos = 1000;
    this.wedone = false;

    this.soundFile = document.createElement("audio");
    this.soundFile.preload = "auto";

    this.soundFile.src = bgm;
    this.soundFile.loop = true;
    this.soundFile.play();

    this.scorestack = scorestack;
    this.scorestack.sort(function (a,b){
      return b.score - a.score;
    });

    this.handleKeyPress = this.handleKeyPress.bind(this);
    window.addEventListener('keypress', this.handleKeyPress);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    window.addEventListener('mousedown', this.handleMouseDown);

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  update(){
    if(this.scrollpos <= -1000){
      this.scrollpos = 1000;
    }
    else{
      this.scrollpos--;
    }

    if(this.wedone){
      this.soundFile.pause();
      this.soundFile.currentTime = 0;
      return false;
    }
    return true;
  }

  render(){
    this.backCtx.fillStyle = "black";
    this.backCtx.fillRect(0, 0, 1000, 1000);
    this.backCtx.fillStyle = "white";
    this.backCtx.font = "50px Monospace";
    for(var i = 0; i < this.scorestack.length; i++){
      this.backCtx.fillText(this.scorestack[i].initials, 350, this.scrollpos + (i * 40));
      this.backCtx.fillText(this.scorestack[i].score, 550, this.scrollpos + (i * 40));
    }
  }

  handleKeyPress(event){
    event.preventDefault();
    this.wedone = true;
  }

  handleMouseDown(event){
    event.preventDefault();
    if(event.which == 1) this.wedone = true;
  }

}
