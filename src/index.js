//----------------------------------------------//
const canvas = document.getElementById('game-screen');

window.onload =function(){
    document.getElementById("audio-play").play();
}

canvas.width = 1024;
canvas.height = 576;

//---------------------------------------------//

const g = 0.7;
const c = canvas.getContext("2d");
// const d = dialogBox.getContext('2d');
let attackTime = 0;
let invertKey = false;


c.fillRect(0, 0, canvas.width, canvas.height);

class sprite{

    constructor({position, imageSource, scale, framesMax, offset = {x:0,y:0}}){

        this.position = position;
        // this.width = width;
        // this.height = height;
        this.image = new Image();
        this.image.src = imageSource;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
    

        this.draw = ()=>{

            c.drawImage(
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax, 
                this.image.height,
                this.position.x - this.offset.x, 
                this.position.y - this.offset.y,
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale);
        }

        this.animateFrames = ()=>{

            this.framesElapsed++;

            if(this.framesElapsed % this.framesHold === 0){

                if(this.framesCurrent < this.framesMax - 1){

                    this.framesCurrent++;
                }
    
                else{

                    this.framesCurrent = 0;
                }
            }
        }

        //expects a flipped pngsheet
        this.animateFramesLeft = ()=>{

            this.framesElapsed++;

            if(this.framesElapsed % this.framesHold === 0){

                if(this.framesCurrent > 0){

                    this.framesCurrent--;
                }
    
                else{

                    this.framesCurrent = this.framesMax - 1;
                }
            }
        }

        this.update = ()=>{

                this.draw();
                this.animateFrames();
        }
    }
};

const background = new sprite({

    position:{
        x: 0,
        y: 0
    },
    imageSource: '../bg_demo.png',
    scale: 1,
    framesMax: 1,
});

class fighter extends sprite{

    constructor({ 
        position, 
        velocity, 
        color, 
        offset, 
        imageSource, 
        scale, 
        framesMax,
        sprites,
        attackBox }){

        super({
            position,
            imageSource,
            scale,
            framesMax, 
            offset
        })

        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.color = color;

        // Add something realted to perspective here
        // So that when the perspective is changed
        // the perspective of the attackBox also 
        // changes, so that left and right attacks
        // can be realised.
        this.attackBox = {
            
            width: attackBox.width,
            height: attackBox.height,
            position: this.position,
            offset: {

                x: attackBox.offset.x,
                y: attackBox.offset.y,

                xInvert: attackBox.offset.xInvert,
                yInvert: attackBox.offset.yInvert,
            },
        };

        this.isAttacking = false;
        // this.offset = offset;
        this.health = 45;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 6;
        this.sprites = sprites;
        this.dead = false;

        for(const sprity in sprites){

            sprites[sprity].image = new Image();
            sprites[sprity].image.src = sprites[sprity].imageSource;
        }

        this.update = (key)=>{
            
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.draw();
            
            if(!this.dead){
                switch(key){
                    case 'right':
                        this.animateFrames();
                        break;    
                        
                    case 'left':
                        this.animateFramesLeft();
                        break;            
                };
            };

            //draw attack box here
            // c.fillRect(
            //     this.attackBox.position.x + this.attackBox.offset.x, 
            //     this.attackBox.position.y,
            //     this.attackBox.width,
            //     this.attackBox.height
            // );

            if(this.position.y + this.height + this.velocity.y > canvas.height - 57){
                
                this.velocity.y = 0;
            }
            else{
                this.velocity.y += g;
            }
        }

        this.attack = ()=>{

            this.isAttacking = true;

            //keep attacking as it is not a stamina relastic game
            //or maybe we should only allow single attacks...
            //hmm this is quite a dilemma...
            //okay let's make it single press attack, to make it
            //more dynamic
            // setTimeout(()=>{
                
            //     this.isAttacking = false;
            // }, 100);
        }

        this.switchSprite = (sprity)=>{
        
            
            if(
            this === player
            &&
            this.image === this.sprites.death.image 
            && 
            this.framesCurrent <= this.sprites.death.framesMax - 1
            ){

                if(this.framesCurrent === this.sprites.death.framesMax - 1){

                    player.dead = true;
                }

                return;
            }
            
            else if(
            this === player
            &&
            this.image === this.sprites.deathInvert.image 
            && 
            this.framesCurrent >= 0
            ){

                if(this.framesCurrent === 0){

                    player.dead = true;
                }

                console.log("i did die dammnit");
                return;
            }

            else if(
            this === enemy
            &&
            this.image === this.sprites.death.image 
            && 
            this.framesCurrent >= 0
            ){

                if(this.framesCurrent === 0){

                    enemy.dead = true;
                }

                return;
            }
//jflak;js;s
            else if(
            this === enemy
            &&
            this.image === this.sprites.deathInvert.image 
            && 
            this.framesCurrent <= this.framesMax - 1
            ){

                if(this.framesCurrent === this.framesMax - 1){

                    enemy.dead = true;
                }

                return;
            }
            
            if(
            this === player
            &&
            this.image === this.sprites.attack1.image 
            && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1
            ) return;

            else if(
            this === player
            &&
            this.image === this.sprites.attack1Invert.image 
            && 
            this.framesCurrent > 0
            ) return;

            else if(
            this === enemy
            &&
            this.image === this.sprites.attack1Invert.image 
            && 
            this.framesCurrent < this.framesMax - 1
            ) return;

            if(
            this === player
            &&
            this.image === this.sprites.getHit.image 
            && 
            this.framesCurrent < this.sprites.getHit.framesMax - 1
            ) return;

            else if(
            this === enemy
            &&
            this.image === this.sprites.attack1.image 
            && 
            this.framesCurrent > 0
            ) return;

            switch(sprity){

                case 'idle':

                    if(this.image !== this.sprites.idle.image){

                    this.framesMax = this.sprites.idle.framesMax;
                    this.image = this.sprites.idle.image;
                    // this.framesCurrent = 0;
                    }

                    break;

                case 'idleInvert':

                    if(this.image !== this.sprites.idleInvert.image){

                    this.framesMax = this.sprites.idleInvert.framesMax;
                    this.image = this.sprites.idleInvert.image;
                    // this.framesCurrent = 0;

                    console.log("i have died, why am i still alive");
                    }

                    break;

                case 'runRight':

                    if(this.image !== this.sprites.runRight.image){

                    this.framesMax = this.sprites.runRight.framesMax;
                    this.image = this.sprites.runRight.image ;
                    // this.framesCurrent = 0;
                    }   
                    
                    break;
                
                case 'runLeft': 

                    if(this.image !== this. sprites.runLeft.image){
                        
                        this.framesMax = this.sprites.runLeft.framesMax;
                        this.image = this.sprites.runLeft.image; 
                        // this.framesCurrent = 0;
                    }
                   
                    break;

                case 'jumpRight': 

                    if(this.image !== this. sprites.jumpRight.image){

                        this.framesMax = this.sprites.jumpRight.framesMax;
                        this.image = this.sprites.jumpRight.image;
                        // this.framesCurrent = 0;

                    }

                    break;

                case 'jumpLeft': 

                    if(this.image !== this. sprites.jumpLeft.image){

                        this.framesMax = this.sprites.jumpLeft.framesMax;
                        this.image = this.sprites.jumpLeft.image;
                        this.framesCurrent = 0;
                    }

                    break;

                case 'getHit': 

                    if(this.image !== this. sprites.getHit.image){

                        this.framesMax = this.sprites.getHit.framesMax;
                        this.image = this.sprites.getHit.image;
                        this.framesCurrent = 0;
                    }

                    break;

                case 'getHitInvert': 

                    if(this.image !== this. sprites.getHitInvert.image){

                        this.framesMax = this.sprites.getHitInvert.framesMax;
                        this.image = this.sprites.getHitInvert.image;
                        this.framesCurrent = 0;
                    }

                    break;

                case 'attack1': 

                    if(this.image !== this. sprites.attack1.image){

                        this.framesMax = this.sprites.attack1.framesMax;
                        this.image = this.sprites.attack1.image;
                        
                        if(this === player){

                            this.framesCurrent = 0;
                        }

                        else if(this === enemy){

                            this.framesCurrent = this.framesMax - 1;
                        }
                    }

                    break;

                case 'attack1Invert': 

                    if(this.image !== this. sprites.attack1Invert.image){

                        this.framesMax = this.sprites.attack1Invert.framesMax;
                        this.image = this.sprites.attack1Invert.image;
                        
                        if(this === player){

                            this.framesCurrent = this.framesMax - 1;
                        }

                        else if(this === enemy){

                            this.framesCurrent = 0;
                        }
                    }

                    break;

                case 'death': 

                    if(this.image !== this. sprites.death.image){

                        this.framesMax = this.sprites.death.framesMax;
                        this.image = this.sprites.death.image;
                        
                        if(this === player){

                            this.framesCurrent = 0;
                        }

                        else if(this === enemy){

                            this.framesCurrent = this.framesMax - 1;
                        }
                    }

                    break;

                case 'deathInvert': 

                    if(this.image !== this. sprites.deathInvert.image){

                        this.framesMax = this.sprites.deathInvert.framesMax;
                        this.image = this.sprites.deathInvert.image;
                        
                        if(this === player){

                            this.framesCurrent = this.framesMax - 1;
                        }

                        else if(this === enemy){

                            this.framesCurrent = 0;
                        }
                    }

                    break;
            }
        }
    }
}

const player = new fighter({

    position: {x: 100, y: 100}, 
    velocity: {x: 0, y: 0},
    color: "blue",
    offset: 0,
    imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Idle.png",
    scale: 4,
    offset: {x: 215, y: 190},
    framesMax: 10,
    sprites: {
        idle: {
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Idle.png",
            
            framesMax: 10,
        },

        idleInvert: {
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Idle_invert.png",
            
            framesMax: 10,
        },

        runRight:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Run.png",

            framesMax: 6
        },

        runLeft:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/RunLeft.png",

            framesMax: 6
        },

        jumpRight:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Jump.png",

            framesMax: 2
        },

        jumpLeft:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/JumpLeft.png",

            framesMax: 2
        },

        attack1:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Attack1.png",

            framesMax: 4,
        },

        attack1Invert:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Attack1_invert.png",

            framesMax: 4,
        },

        attack2:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Attack2.png",

            framesMax: 4,
        },

        attack3:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Attack3.png",

            framesMax: 5,
        },

        getHit:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Get Hit.png",

            framesMax: 3,
        },

        death:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Death.png",

            framesMax: 9,
        },

        deathInvert:{
            imageSource: "../mc/Medieval Warrior Pack 3/Sprites/Death_invert.png",

            framesMax: 9,
        }
    },

    attackBox: {
        width: 150,
        height: 50,
        offset: {
            x: 115,
            y: 0,

            xInvert: -170,
            yInvert: 0
        }
    }
}); 

const enemy = new fighter({

    position: {x: 800, y: 100}, 
    velocity: {x: 0, y: 0},
    color: "red",
    // scale: 1, 
    offset: 50,
    imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Idle.png",
    scale: 4,
    offset: {x: 215, y: 170},
    framesMax: 10,
    sprites: {
        idle: {
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Idle.png",
            
            framesMax: 10,
        },
   
        idleInvert: {
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Idle_right.png",
            
            framesMax: 10,
        },

        runRight:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Run_right.png",

            framesMax: 10
        },

        runLeft:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Run.png",

            framesMax: 10
        },

        jumpRight:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Jump.png",

            framesMax: 3
        },

        jumpLeft:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Jump_left.png",

            framesMax: 3
        },

        attack1:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Attack_left.png",

            framesMax: 4,
        },

        attack1Invert:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Attack.png",

            framesMax: 4,
        },
        
        attack2:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Idle.png",

            framesMax: 4,
        },

        attack3:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Idle.png",

            framesMax: 5,
        },

        getHit:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Hit_left.png",

            framesMax: 1,
        },

        death:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Death_left.png",

            framesMax: 10,
        },

        deathInvert:{
            imageSource: "../knight/Colour1/NoOutline/120x80_PNGSheets/_Death.png",

            framesMax: 10,
        }

        
    },

    attackBox: {
        width: 150,
        height: 50,
        offset: {
            x: -170,
            y: 0,

            xInvert: 50,
            yInvert: 0,
        }
    }
}); 

// Gotta make something like last pressed
// 

const keys = {

    last:{
        pressed: 'd',
    },

    a: {
        pressed: false,
    },

    d:{
        pressed: false,
    },

    w:{
        pressed: false,
    },
}

function rectCollisionToEnemy(rect1, rect2){

    switch(keys.last.pressed){

        case 'd': return (
            //actually going to the enemy
            rect1.attackBox.position.x + rect1.attackBox.width + rect1.attackBox.offset.x >= rect2.position.x 
            && 
    
            //not showing in attack for being ahead of the enemy
            rect1.attackBox.position.x + rect1.attackBox.offset.x <= rect2.position.x + rect2.width
            &&
    
            //showing attacking if attack box is hitting the enemy
            rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
            &&
            rect1.position.y <= rect2.position.y + rect2.height
        );

        case 'a': return (
            //actually going to the enemy
            rect1.attackBox.position.x + rect1.attackBox.width + rect1.attackBox.offset.xInvert >= rect2.position.x 
            && 
    
            //not showing in attack for being ahead of the enemy
            rect1.attackBox.position.x + rect1.attackBox.offset.xInvert <= rect2.position.x + rect2.width
            &&
    
            //showing attacking if attack box is hitting the enemy
            rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
            &&
            rect1.position.y <= rect2.position.y + rect2.height
        );
    }
}

function rectCollisionToPlayer(rect1, rect2){

    if(!invertKey){

        return (
            //actually going to the enemy
            rect1.attackBox.position.x + rect1.attackBox.width + rect1.attackBox.offset.x >= rect2.position.x 
            && 
    
            //not showing in attack for being ahead of the enemy
            rect1.attackBox.position.x + rect1.attackBox.offset.x <= rect2.position.x + rect2.width
            &&
    
            //showing attacking if attack box is hitting the enemy
            rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
            &&
            rect1.position.y <= rect2.position.y + rect2.height
        );
    }

    else{

        return (
            //actually going to the enemy
            rect1.attackBox.position.x + rect1.attackBox.width + rect1.attackBox.offset.xInvert >= rect2.position.x 
            && 
    
            //not showing in attack for being ahead of the enemy
            rect1.attackBox.position.x + rect1.attackBox.offset.xInvert <= rect2.position.x + rect2.width
            &&
    
            //showing attacking if attack box is hitting the enemy
            rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
            &&
            rect1.position.y <= rect2.position.y + rect2.height
        );
    }
}


function resolveGame(person1, person2){

    const resolveGameScreen = document.getElementById("resolve-game");
    resolveGameScreen.style.zIndex = 5;

    // console.log("entry-confirmed");

    if(person2.health === 0){

        if(invertKey){

            person2.switchSprite('deathInvert');
        }

        else person2.switchSprite('death');
        setTimeout(()=> window.location.href = '../public/bandit_level.html', 2000);

    }

    else if(person1.health === 0){

        switch(keys.last.pressed){

            case 'd': person1.switchSprite('death'); break;

            
            case 'a': rotateKeyPlayer = 'left';
                      person1.switchSprite('deathInvert'); 
                      break;
        }
        
        setTimeout(()=> window.location.href = '../public/death-screen.html' ,2000);
    }
}


function moveToAttackRange(enemy, player){
    
    // If the player is in left of the enemy then run to the left
    if(
        player.position.x - enemy.position.x < 0 && 
        enemy.position.x - player.position.x > player.attackBox.width
        ){
            
            // Move that is set to run
            enemy.switchSprite('runLeft');
            enemy.velocity.x = -5;
            invertKey = false;
        }
    else if(
        enemy.position.x - player.position.x < 0 && 
        player.position.x - enemy.position.x > enemy.attackBox.width
        ){
            
            // Move that is set to run
            rotateKey = 'right';
            enemy.switchSprite('runRight');
            enemy.velocity.x = 5;
            invertKey = true;
        }
        
        else enemy.velocity.x = 0;
}

// One extra Attack is here
// A bug is here

function inRangeToAttack(enemy, player){
        
    if(!rectCollisionToPlayer(enemy, player)){
     
        moveToAttackRange(enemy, player);
    }

    else if(rectCollisionToPlayer(enemy, player)){

        return true;
    }
}

// A bug here is that if the player is in right 
// Then even if the health decreases to 0, he doesn't
// die.
    
function simpleEnemyFsm(enemy, player){
        
    // console.log(player.dead);
    if(!player.dead && !enemy.dead){
            
        if(inRangeToAttack(enemy, player)){
            
            if(attackTime % 30 == 0){

                enemy.attack();

                if(!invertKey){
                    
                    // console.log("did-not-invert");
                    enemy.switchSprite('attack1')
                }

                else if(invertKey){
                    // console.log("did-ivnert");
                    rotateKey = 'right';
                    enemy.switchSprite('attack1Invert');
                }
            }
        }
    }

}

let startTime; 
let endTime;

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  let timeDiff = endTime - startTime; //in ms
  timeDiff /= 1000;


  let seconds = Math.round(timeDiff);
  
  return seconds;
}

const dialogArea = document.getElementById('dialog-area');
const speakerArea = document.getElementById('speaker');

class dialog{

    constructor(speaker, dialogue){

        this.speaker = speaker;
        this.dialogue = dialogue;

        this.show = ()=>{

            speakerArea.textContent = this.speaker;
            dialogArea.textContent = this.dialogue;
        }
    }
}

let dialogLvl1 = [];
let dialoguesLvl1 = [

    "Wow, I didn't expect anybody would this be this stupid to come here, don't you all know how strong we are, don't you all village suckers know how strong *I* AM!",

    "...",
    
    "You look like a quiet guy and obviously weak as hell, I don't think you will be able to beat me even in your sleep,",

    "Now DIE and make my life easier!!!"
];

let speakersLvl1 = ["ENEMY", "PLAYER", "ENEMY", "ENEMY"];

for(let i = 0; i < 4; i++){

    dialogLvl1.push(new dialog(speakersLvl1[i], dialoguesLvl1[i]));
}

dialogLvl1[0].show();

function Lvl1dialog(){

    if(end() > 5) {

        dialogLvl1[j].show();
        j++;
        start();
    }
}


let rotateKey, rotateKeyPlayer;
let j = 1; start();



function animate(){

    window.requestAnimationFrame(animate);


    // c.fillStyle = 'black';
    // c.fillRect(0, 0, canvas.width, canvas.height);
    background.update('right');

    // rotateKeyPlayer = 'right';

    player.update(rotateKeyPlayer);
    enemy.update(rotateKey);

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    rotateKeyPlayer = 'right';
    rotateKey = 'left';

    attackTime++;

    if(j < 4){

        Lvl1dialog();
    }
    
    setTimeout(()=>{
        //also implement "left idle" later
        if(!(keys.a.pressed) && !(keys.d.pressed)){

            switch(keys.last.pressed){


                case 'a': rotateKeyPlayer = 'left';
                          player.switchSprite('idleInvert');
                          break;

                case 'd': rotateKeyPlayer = 'right';
                          player.switchSprite('idle');
                          break;
            }
        }

        if(keys.d.pressed && !(keys.a.pressed)){

            player.velocity.x = 5;
            player.switchSprite('runRight');
        }

        else if(keys.a.pressed && !(keys.d.pressed)){

            player.velocity.x = -5;
            player.switchSprite('runLeft');
        }

        // A bug is here
        
        if(player.velocity.y < 0){

            switch(keys.last.pressed){

                case 'a': player.switchSprite('jumpLeft');
                          break;
                case 'd': player.switchSprite('jumpRight');
                          break;
            }
        }

        else if(keys.a.pressed && keys.d.pressed){
            player.velocity.x = 0;
            player.switchSprite("idle");

            //do what you have always done
            //stand with pride

            //tip for last boss...
            //he is powerful,
        }

        if(enemy.velocity.y < 0){

            enemy.switchSprite('jumpRight');
        }

        if(enemy.velocity.x === 0){

            enemy.switchSprite('idle');
        }

        if(enemy.isAttacking){

            rotateKey = 'left';
        }

        if(invertKey){

            enemy.switchSprite('idleInvert');  
        }
        

        simpleEnemyFsm(enemy, player);

        //detect for collision
        //should we allow the characters
        //to go through each other or
        //not, ...
        if(rectCollisionToEnemy(player, enemy) && player.isAttacking){

            //hit achieved
            enemy.switchSprite("getHit");
            player.isAttacking = false;

            const enemyHP = document.getElementById("enemy-hp");
            enemy.health -= 5;

            enemyHP.style.width = `${enemy.health}%`;
        }

        if(rectCollisionToPlayer(enemy, player) && enemy.isAttacking){

            //hit achieved
            player.switchSprite("getHit");
            enemy.isAttacking = false;

            const playerHP = document.getElementById("player-hp");
            player.health -= 5;

            playerHP.style.width = `${player.health}%`;

            //how to not push away the sys
            const flexContainer = document.getElementById("up-elements-wrap");

            flexContainer.style.left = `${5 + ((45 - player.health)*8)}px`; 
        }

        // A bug is here
    
        // If you move the enemy and keep on moving just before 
        // The player is dead but it moves
        
        if(player.health === 0 || enemy.health === 0){

            resolveGame(player, enemy);
            
        }

    }, 20000);
}

animate();

window.addEventListener('keydown',(event)=>{

    if(!player.dead && !enemy.dead){

        switch(event.key){

            case 'a': rotateKeyPlayer = 'left';
                      keys.a.pressed = true; break;
            
            case 'd': keys.d.pressed = true; break;
    
            case 'h': player.attack(); 
                      
                      switch(keys.last.pressed){

                          case 'd': player.switchSprite("attack1"); break;

                          case 'a': rotateKeyPlayer = 'left';
                                    player.switchSprite("attack1Invert"); 
                                    break;
                      }
                      break;
    
            //later implement ducking
            case 'w': player.velocity.y = -20; break;
        };
    };
});

window.addEventListener('keyup', (event)=>{

    switch(event.key){

        case 'a': keys.a.pressed = false;
                  keys.last.pressed = 'a';
                  break; 

        case 'd': keys.d.pressed = false; 
                  keys.last.pressed = 'd';
                  break;
    };
});



