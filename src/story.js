window.onload = ()=>{

  document.getElementById("story").play();
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

let speakers = ["VILLAGER", "VILLAGER", "VILLAGER", "VILLAGER", "VILLAGER", "ARTROS"];
let dialogues = [
  'The villages that were burnt once with happiness but because of them everything, everything- has been lost...',
  "Those knights who have teamed up with the bandits to do such devestating things, are not knights of honour, they aren't knights at all, they are monsters.",
  "They come to the village and destroy... *cries* everything, everything, everything, everything, everything, and then take all away all our food, our ... And the some of us that are left alive, they force us to go inside our villages telling us that it will all be fine ... and th- then- then-... they burn us alive, and any who try to escape are killed",
  "I barely escaped the village because I was a merchant staying there, but Artros what will we do now, only you are someone with some fighting experience and that too just as a trainee knight, what will we do...",
  "*cries...*",
  "I must protect my family and my village."
]

let storyText = []

for(let i = 0; i < 6; i++){

  storyText.push(new dialog(speakers[i], dialogues[i]));
}

storyText[0].show();

function Intro(){

  if(end() > 7) {

      storyText[j].show();
      j++;
      start();
  }
}

let j = 1; start();

function animate(){

    window.requestAnimationFrame(animate)

    if(j < 6) Intro();
    setTimeout(()=>{

      if(j === 6){

        window.location.href = "../public/index.html";
      }
    }, 2000);
}

animate();