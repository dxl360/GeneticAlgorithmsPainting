var geneSeq = [];
var curData = [];

  /* The analytics pane elements */
  var statistics;
  
  var originalImage;


  //The original image canvas, context and the result image and context
  var originalCvs;
  var originalCtx;
  var resultCvs;
  var resultCtx;
  //the current canvas and context
  var curCvs;
  var curCtx;

  var genePoolSize;

 
  //parameters for statistics
  var resolution;
  var polygonNum;
  var vertices;
  var selectionCutoff;
  var mutationRate;
  var mutationAmount;
  var lowestFitness;
  var highestFitness;
  var numberOfGenerations;
  var numberOfImprovements;

  
  var cycle;
  var geneSize;
  var geneLen;
  var genePool;
  var beginTime;
  var resumedTime = 0;
  
function Gene(father, mother) {
    /* The Gene's genetic composition */
    this.gene = [];

    if (!(father && mother)) {
      for (var g = 0; g < geneLen; g += geneSize) {
        this.gene.push(Math.random(), Math.random(),  Math.random(), Math.max(Math.random() * Math.random(), 0.3)); 

        var x = Math.random();
        var y = Math.random();

        for (var j = 0; j < vertices; j++) {
          this.gene.push(x + Math.random() - 0.5, // X
                        y + Math.random() - 0.5); // Y
        }
      }
    }else{
      var inheritSplit = (Math.random() * geneLen) >> 0;

      for (var i = 0; i < geneLen; i += geneSize) {

        var inheritedGene = (i < inheritSplit) ? father : mother;
        for (var j = 0; j < geneSize; j++) {
          var dna = inheritedGene[i + j];

          /* Mutate the gene */
          if (Math.random() < mutationRate) {
            dna += Math.random() * mutationAmount * 2 - mutationAmount;
            if (dna < 0)
              dna = 0;
            if (dna > 1)
              dna = 1;
          }
          this.gene.push(dna);
        }
      }
      
    }
    drawPolygon(curCtx, resolution, resolution, this);
    var imageData = curCtx.getImageData(0, 0,resolution,resolution).data;
    var diff = 0;
      for (var p = 0; p < 4* resolution * resolution; p++) {
        var dp = imageData[p] - curData[p];
        diff += dp * dp;
      }
      this.fitness = 1 - diff / (resolution * resolution * 4 * 256 * 256);
  }

//Get the gene sequence with the best fitness value
function getFittest() {
  return geneSeq.sort(function(a, b) {
      return b.fitness - a.fitness;
    })[0];
}

function drawPolygon(context, width, height, individual){
   context.fillStyle = '#000';
   context.fillRect(0, 0, width, height);
   for(var i = 0; i < geneLen; i += geneSize){

     context.beginPath();
     //Could tune some parameters here
     context.moveTo(individual.gene[i + 4] * width, individual.gene[i + 5] * height);

     //draw each vertices
     for(var j = 0; j < vertices - 1; j++){
       context.lineTo(width * individual.gene[i + j * 2 + 6], height * individual.gene[i + j * 2 + 7]);
     }

     context.closePath();

     var styleString = 'rgba(' +((individual.gene[i] * 255) >> 0) + ',' + ((individual.gene[i + 1] * 255) >> 0) + ',' + ((individual.gene[i + 2] * 255) >> 0) + ',' + 
     individual.gene[i + 3] + ')'; 

  
     context.fillStyle = styleString;
     context.fill();
      
  }
}

function initGenePool(size) {
  geneSeq = [];
  for(var i = 0; i < size; i++){
    geneSeq.push(new Gene());
  } 
}

function generateGenePool() {
  if (geneSeq.length > 1) {
    var size = geneSeq.length;
    var offspring = [];
    
    var selectCount = Math.floor(geneSeq.length * selectionCutoff);
  
    var randCount = Math.ceil(1 / selectionCutoff);
    geneSeq = geneSeq.sort(function(a, b) {
      return b.fitness - a.fitness;
    });

    for (var i = 0; i < selectCount; i++) {
          for (var j = 0; j < randCount; j++) {
            var randIndividual = i;
            while (randIndividual == i)
              randIndividual = (Math.random() * selectCount) >> 0;
              offspring.push(new Gene(geneSeq[i].gene,
              geneSeq[randIndividual].gene));
          }
    }
    geneSeq = offspring;
    geneSeq.length = size;
  } else {
    var parent = geneSeq[0];
    var child = new Gene(parent.gene, parent.gene);
    if (child.fitness > parent.fitness)
      geneSeq = [child];
  }
}


function isRunning() {
  return cycle;
}

function isPaused() {
  return numberOfGenerations && !cycle;
}


function isStopped() {
  return !isRunning() && !isPaused();
}

function setImage(src) {
  originalImage.onload = initOriginalImage;
  originalImage.src = src;
}


function initOriginalImage() {
  initCurData();
  drawOriginalImage();
}

function drawOriginalImage() {
  originalCvs.width = 350;
  originalCvs.height = 350;

  base_image = new Image();
  base_image.src = 'The_Girl_With_The_Pearl_Earring.png';

  base_image.onload = function(){
    originalCtx.drawImage(base_image, 0, 0);
  }
  // equivalent to setImage(base_image.src)
  originalImage.src = base_image.src;

  highestFitness = 0;
  lowestFitness = 100;
}

function initCurData(){
  originalCvs.width = resolution;
  originalCvs.height = resolution;
  originalCtx.drawImage(originalImage,
                          0, 0, 350, 350, 0, 0,
                          resolution, resolution);
  var imgData = originalCtx.getImageData(0,0, resolution, resolution).data;
  curData = [];
  for(var i = 0; i < 4 * resolution * resolution; i++){
      curData[i] = imgData[i];
  }
}

function initialize() {
  var gps = document.getElementById("genePoolSizeRes");
  var mr = document.getElementById("mutationRateRes");
  var ma = document.getElementById("mutationAmountRes");
  var sc = document.getElementById("selectionCutoffRes");
  var pn = document.getElementById("polygonNumberRes");
  var vn = document.getElementById("vertexNumberRes");
  gps.innerHTML = 50;
  mr.innerHTML = 2+'%';
  ma.innerHTML = 15+'%';
  sc.innerHTML = 15+'%';
  pn.innerHTML = 150;
  vn.innerHTML = 3;
  document.getElementById("genePoolSize").onchange = function(){
    gps.innerHTML = event.srcElement.value;
  }
  document.getElementById("mutationRate").onchange = function(){
    mr.innerHTML = event.srcElement.value +'%';
  }
  document.getElementById("mutationAmount").onchange = function(){
    ma.innerHTML = event.srcElement.value+'%';
  }
  document.getElementById("selectionCutoff").onchange = function(){
    sc.innerHTML = event.srcElement.value+'%';
  }
  document.getElementById("polygonNumber").onchange = function(){
    pn.innerHTML = event.srcElement.value;
  }
  document.getElementById("vertexNumber").onchange = function(){
    vn.innerHTML = event.srcElement.value;
  }
}

function getParameters() {
    genePoolSize = document.getElementById("genePoolSize").value;
    console.log(genePoolSize);

    mutationRate = document.getElementById("mutationRate").value / 100;
    console.log(mutationRate);

    mutationAmount = document.getElementById("mutationAmount").value / 100;
    console.log(mutationAmount);

    selectionCutoff = document.getElementById("selectionCutoff").value / 100;
    console.log(selectionCutoff);

    polygonNum = document.getElementById("polygonNumber").value;
    console.log(polygonNum);

    vertices = document.getElementById("vertexNumber").value; 
    console.log(vertices);

    resolution = 75;

    geneSize = (vertices * 2 + 4);
    geneLen = geneSize * polygonNum;

    curCvs.width = resolution;
    curCvs.height = resolution;
    curCvs.style.width = resolution;
    curCvs.style.height = resolution;
  }

 
function runSimulation() {
  document.body.classList.remove('genetics-inactive');
  document.body.classList.add('genetics-active');
  if (isPaused())
    beginTime = new Date().getTime() - resumedTime;

  if (isStopped()) {
    numberOfGenerations = 0;
    numberOfImprovements = 0;
    beginTime = new Date().getTime();
    genePool = initGenePool(genePoolSize);
}

    //Each run of newGene produces a new generations of the gene pool
    function newGene() {
      generateGenePool();
      numberOfGenerations++;

      var fittest = getFittest();
      var totalTime = ((new Date().getTime() - beginTime) / 1000);
      var timePerGeneration = (totalTime / numberOfGenerations) * 1000;
      var timePerImprovment = (totalTime / numberOfImprovements) * 1000;
      var currentFitness = (fittest.fitness * 100);
      if (currentFitness > highestFitness) {
        highestFitness = currentFitness;
        /* Improvement was made */
        numberOfImprovements++;
      } else if (currentFitness < lowestFitness) {
        lowestFitness = currentFitness;
      }

      drawPolygon(resultCtx, 350, 350, fittest);

      statistics.timePassed.text(timeFormat(Math.round(totalTime)));
      statistics.numberOfGenerations.text(numberOfGenerations);
      statistics.timePerGeneration.text(timePerGeneration.toFixed(2) + ' ms');
      statistics.timePerImprovment.text(timePerImprovment.toFixed(2) + ' ms');
      statistics.currentFitness.text(currentFitness.toFixed(2) + '%');
    }
    //run new Gene every second
    cycle = setInterval(newGene, 0);
  }

  //Start the program to produce gener
  function runGenerations() {
    if (isStopped()) {
      getParameters();
      initOriginalImage();
    }

    // $('.conf-slider').slider('option', 'disabled', true);
    document.getElementById('run').innerHTML = "Pause";
    runSimulation();
  }

  function pauseGenerations() {
    clearInterval(cycle);
    cycle = null;
    resumedTime = new Date().getTime() - beginTime;
    document.getElementById("run").innerHTML = "Resume";
    $('.results-btn').removeAttr('disabled');
  }

  
  //Stop producing gene generations
  function stopGenerations() {
    clearInterval(cycle);
    cycle = null;
    numberOfGenerations = null;
    beginTime = null;
    genePool = null;
    highestFitness = 0;
    lowestFitness = 100;
    resumedTime = 0;
    document.getElementById('time-passed').innerHTML = '0:00';
    // $('.conf-slider').slider('option', 'disabled', false);

    document.body.classList.remove('genetics-active');
    document.body.classList.add('genetics-inactive');

    /* Clear the drawing */
    resultCtx.clearRect(0, 0, 350, 350);
    curCtx.clearRect(0, 0, resolution, resolution);
    document.getElementById("run").innerHTML = "Run";
  }

  function timeFormat(s) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s % 3600 / 60);
    s = Math.floor(s % 3600 % 60);
    return ((hour > 0 ? hour + ':' : '') + (min > 0 ? (hour > 0 && min< 10 ? '0' : '') + min + ':' : '0:') + (s < 10 ? '0' : '') + s);
  }

  document.getElementById("run").onclick = function(){
    if (isRunning()) {
      pauseGenerations();
    } else {
      runGenerations();
    }
  }

  document.getElementById("stop").onclick = function(){
    if (isRunning() || isPaused()) {
      stopGenerations();
    }
  }

  function init() {
    resultCvs = document.getElementById('resultCvs');
    curCvs = document.getElementById('curCvs');
    originalCvs = document.getElementById('originalCvs');
    originalImage = document.getElementById('originalImage');
    resultCtx = resultCvs.getContext('2d');
    curCtx = curCvs.getContext('2d');
    originalCtx = originalCvs.getContext('2d');

    statistics = {
      timePassed: $('#time-passed'),
      numberOfGenerations: $('#number-of-generations'),
      timePerGeneration: $('#time-per-generation'),
      timePerImprovment: $('#time-per-improvement'),
      currentFitness: $('#current-fitness')
    };
    initialize();
    getParameters();

    initOriginalImage();
    
    $('#run').attr('disabled', false);
    $('#stop').attr('disabled', false);
  }
window.onload = function() {
  init();
}