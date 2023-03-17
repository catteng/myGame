window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1920;
  canvas.height = 960;


  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        if ((e.key === "a" ||
             e.key === "d" ||
             e.key === "Shift" ||
             e.key === "w") &&
             this.keys.indexOf(e.key) === -1) {
             this.keys.push(e.key);
        }});
      window.addEventListener("keyup", (e) => {
        if ( e.key === "a" ||
             e.key === "d" ||
             e.key === "Shift" ||
             e.key === "w"){
             this.keys.splice(this.keys.indexOf(e.key), 1);
        }});
    }
  }
  
  class Player {
    constructor(gameWidth, gameHeight ){
      const playerImg = new Image();
      playerImg.src = "./images/cat.png";
      playerImg.onload = () => { this.image = playerImg; };

      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 600;
      this.height = 495;
      this.image = playerImg;
      this.x = 0;
      this.y = this.gameHeight - this.height; //讓player在canvas底部
      this.frameX = 0;
      this.frameY = 1;
      this.speed = 1; //+往右移, -往左移
      this.volecity = 0; //跳ㄉ
      this.gravity = 1;
      this.maxFrame = 3;
      this.fps = 20;
      this.frameTimer = 0;
      this.framInterval = 1000/this.fps;


    }
    drawPlayer(ctx){ 
      ctx.drawImage(this.image, this.frameX * this.width, (this.frameY * this.height) -50 , this.width, this.height, this.x, this.y, this.width, this.height);
    }
    updatePlayerPosition(input, deltaTime){
      //animate fps
      if (this.frameTimer > this.framInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX ++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    

      //水平移動控制
      this.x += this.speed;
      if (input.keys.indexOf('d') > -1){
        this.speed = 5; 
        this.maxFrame = 3;
        this.frameY = 1;
      } else if (input.keys.indexOf('a') > -1) {
        this.speed = -5; 
        this.maxFrame = 3;
        this.frameY = 2;
      } else if (input.keys.indexOf('w') > -1 && this.OnGround()) { //當ongroun時才可以跳
        this.volecity -= 20; 
      } else {
        this.speed = 0;
        this.maxFrame = 7;
        this.frameY = 0;
      }

      //垂直移動控制
      this.y += this.volecity;
      if (!this.OnGround()){
        this.volecity += this.gravity; //當player在空中時,才使用gravity參數
        this.maxFrame = 0;
        this.frameY = 3;
      } else {
        this.volecity = 0;
        
      }
      if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height; //當player跳出canvas之外,掉下來時不會插到地板裡

      //控制玩家不要跑出canvas
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width -700 ) this.x = this.gameWidth - this.width -700 ;
    }

    OnGround(){
      return this.y >= this.gameHeight - this.height;
    }
  }



  class Background {
    constructor(gameWidth ,gameHeight){
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById('backgroundImg');
      this.x = -1000;
      this.y = 0;
      this.width = 12000;
      this.height = 960;
      this.speed = 5;
    }
    draw(ctx){
      ctx.drawImage(this.image, this.x, this.y ,this.width ,this.height);
      ctx.drawImage(this.image, this.x + this.width, this.y ,this.width ,this.height);
      
    }
    updateBackground(){
      this.x -= player.speed; 
      if (this.x < 0 - this.width) this.x = 0;
    }
  }
  function displayStatusText() {}
  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const bg = new Background(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear軌跡
    bg.draw(ctx);  //先畫bg 再畫player
    bg.updateBackground();
    player.drawPlayer(ctx);
    player.updatePlayerPosition(input , deltaTime);
    requestAnimationFrame(animate); //ani loop 
  }
  animate(0);
});
