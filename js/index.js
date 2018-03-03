let startGameButton = document.getElementById("startGameButton")

function getRandomElement(array) {
  return array[Math.floor(Math.random()*array.length)];
}

const humours = ['acerbic', 'slapstick', 'observational', 'anecdotal','none'];
const interests = ['old school jungle', 'bamboo', 'famous pandas', 'geopolitics', 'literature'];
const sexDrives = ['low', 'very low', 'extremely low', 'celibate'];

let pandas = [];
let loseTimer;
  
function Panda(humour, interest, sexDrive) {
  this.humour = humour;
  this.interest = interest;
  this.sexDrive = sexDrive;
}
  
function createRandomPanda() {
  let humour = getRandomElement(humours);
  let interest = getRandomElement(interests);
  let sexDrive = getRandomElement(sexDrives);
  return new Panda(humour, interest, sexDrive);
}

function generateMultiplePandas (num) {
  let array = [];
  for (let i = 0; i < num; i++) {
    array.push(createRandomPanda());
  } 
  return array;
}

function shufflePandas(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  pandas = array;
}

selectedPandas = [];

function renderPandas(pandas) {  
  
  let pandaGallery = document.getElementById('pandaGallery');
  pandaGallery.innerHTML = '';
  
  for (let i = 0; i < pandas.length; i++) {  
    let panda = pandas[i];
    let newPandaBox = document.createElement('div');
    newPandaBox.className = 'pandaBox';
   
    newPandaBox.addEventListener('click', function () {
      let imgDiv = newPandaBox.querySelector('.pandaImgDiv');
      imgDiv.style.zIndex = -1;
      function flipBack() {
        imgDiv.style.zIndex = 1;
      };
      setTimeout(flipBack, 1000);
    })
    
    newPandaBox.addEventListener('dblclick', function() {
      if (selectedPandas.length === 0) {
        selectedPandas.push(panda);
      } else if (selectedPandas.length === 1 && selectedPandas[0] !== panda) {     
        const maybeBabyPanda = generateBabyPandasIfPoss(selectedPandas[0], panda);
        let newPandas = pandas.concat(maybeBabyPanda);
        shufflePandas(newPandas);
        renderPandas(newPandas);
        selectedPandas = [];
        if (newPandas.length >= 15) {
          winGame();
        }
      } 
    })
    
    let newPandaImgDiv = document.createElement('div');
    newPandaImgDiv.className = 'pandaImgDiv';
    let newPandaImage = document.createElement('img');;
    newPandaImage.src = "https://i.imgur.com/xDgUlaS.png?1";
    let pandaHumourText = document.createElement('p');
    pandaHumourText.innerHTML = 'humour: ' + panda.humour;
    let pandaInterestText = document.createElement('p');
    pandaInterestText.innerHTML = 'interest: ' + panda.interest;
    let pandaSexDriveText = document.createElement('p');
    pandaSexDriveText.innerHTML = 'sex drive: ' + panda.sexDrive; 
    newPandaBox.appendChild(newPandaImgDiv);
    newPandaImgDiv.appendChild(newPandaImage)
    newPandaBox.appendChild(pandaHumourText);
    newPandaBox.appendChild(pandaInterestText);
    newPandaBox.appendChild(pandaSexDriveText);
    pandaGallery.appendChild(newPandaBox);
  }
}

function setUpGame() {
  if (pandas.length === 0) {
     let pandaGallery = document.getElementById('pandaGallery');
     let startingTextDiv = document.getElementById('startingTextDiv');
     pandaGallery.removeChild(startingTextDiv);
     pandas = generateMultiplePandas(4);
     renderPandas(pandas);
     swapToRestartButton();
     loseTimer = setTimeout(loseGame,60000)
  }  
}

function calculateHowGoodMatch(pandaA, pandaB) {
  let pandaAArray = Object.values(pandaA);
  let pandaBArray = Object.values(pandaB); 
  let matchCounter = 0;
  for (let i = 0; i < pandaAArray.length; i++) {
    if (pandaAArray[i] === pandaBArray[i]) {
      matchCounter = matchCounter + 1;
    }
  } return matchCounter;
}

function generateBabyPandasIfPoss(pandaA, pandaB) {
  let howGoodMatch = calculateHowGoodMatch(pandaA, pandaB);
  if (howGoodMatch >= 1) {
    return generateMultiplePandas(1);
  } 
  return [];
}

startGameButton.addEventListener('click', setUpGame);

function winGame() {
  pandaGallery.innerHTML = '';
  let youWinDiv = document.createElement('div');
  youWinDiv.className = 'endGameDiv';
  let youWinText = document.createElement('p');
  youWinText.className = 'endGameText';
  youWinText.innerHTML = 'You win! You have saved the panda from extinction.';
  youWinDiv.appendChild(youWinText);
  pandaGallery.appendChild(youWinDiv);
}

function loseGame() {
  pandaGallery.innerHTML = '';
  let youLoseDiv = document.createElement('div');
  youLoseDiv.className = 'endGameDiv';
  let youLoseText = document.createElement('p');
  youLoseText.className = 'endGameText';
  youLoseText.innerHTML = 'You lose! You have single-handedly extincted the panda.';
  youLoseDiv.appendChild(youLoseText);
  pandaGallery.appendChild(youLoseDiv);
  clearTimeout(loseTimer);
}

function swapToRestartButton() {
  let buttonContainer = document.getElementById('buttonContainer');
  buttonContainer.removeChild(startGameButton);
  let restartButton = document.createElement('button');
  restartButton.className = 'button';
  restartButton.innerHTML = 'restart game';
  restartButton.addEventListener('click', restartGame);
  buttonContainer.appendChild(restartButton);
}

function restartGame() {
  let pandaGallery = document.getElementById('pandaGallery');
  pandaGallery.innerHTML = '';
  pandas = [];
  pandas = generateMultiplePandas(4);
  renderPandas(pandas);
  clearTimeout(loseTimer);
  loseTimer = setTimeout(loseGame,60000)
  }