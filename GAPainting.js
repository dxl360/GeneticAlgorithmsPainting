var canvasOri = document.getElementById('originalImg');
var canvasRes = document.getElementById('resultImg');
var canvasCur = document.getElementById('current');
var contextOri = canvasOri.getContext('2d');
var contextRes = canvasRes.getContext('2d');
var contextCur = canvasCur.getContext('2d');

var populationSize;
var mutationChance;
var mutationAmount;
var selectionCutoff;
var polygonNumber;

var individuals = [];
var numOfGenerations = 0;
// var numOfEvolutions = 0;
// var bestFitness = 0;
// var worstFitness = 100;
var beginTime;
var lapseTime = 0;
//speficy resolution (workingSize)
var resolution = 75;
//specify the number of vertices, which is now initialized to be 
var vertices = 3;
//initialized in the init 
var geneLen;
//hard coded
var geneSize = 4  + vertices * 2;

var curData = [];

var count = 0;

window.onload = function(){
	init();
	  
	document.getElementById("run").onclick = function () {
		alert("Running");
		// Evolve();
		runGA();
	};
	document.getElementById("pause").onclick = function () {
		// Pause Evolve()
		alert("Paused");
		pauseGA();
	};
	document.getElementById("stop").onclick = function () {
		// Pause Evolve()
		alert("Stopped");
		stopGA();
	};

}

function runGA() {
	$('#run').text('Run');
	while (count < 1000) {
		count++;
		generatePopulation();
		numOfGenerations++;
		var fittest = getFittest();
		var totalTime = ((new Date().getTime() - beginTime) / 1000);
		// var timePerGeneration = (totalTime / numOfGenerations) * 1000;
		// var timePerEvolution = (totalTime / numOfEvolutions) * 1000;
		var currentFitness = (fittest.fitness * 100);
		// if (currentFitness > bestFitness) {
		// 	bestFitness = currentFitness;
		// 	/* Improvement was made */
		// 	numberOfImprovements++;
		// 	} else if (currentFitness < worstFitness) {
		// 	worstFitness = currentFitness;
		// }
		/* draw the best fit to output */
		drawPolygon(contextRes, 350, 350, fittest);
		/* update statistics */
		document.getElementById("runTime").innerHTML = timeFormat(Math.round(totalTime));
		document.getElementById("numOfGenerations").innerHTML = numOfGenerations;
		document.getElementById("currentFitness").innerHTML = currentFitness.toFixed(2) + '%';
	}
}

function pauseGA() {
	lapseTime = new Date().getTime() - beginTime;
	$('#run').text('Resume');
}

function stopGA() {
	numOfGenerations = null;
    beginTime = null;
    // bestFitness = 0;
    // worstFitness = 100;
    lapseTime = 0;
    document.getElementById("runTime").innerHTML = "0:00";
    /* Clear the drawing */
    contextRes.clearRect(0, 0, 350, 350);
    contextCur.clearRect(0, 0, resolution, resolution);
}

function generatePopulation() {
	if (individuals.length > 1) {
		var size = individuals.length;
    	var offspring = [];
    	/* The number of individuals from the current generation to select for breeding */
		var selectCount = Math.floor(individuals.length * selectionCutoff);
		/* The number of individuals to randomly generate */
		var randCount = Math.ceil(1 / selectionCutoff);
		individuals = individuals.sort(function(a, b) {
			return b.fitness - a.fitness;
		});
		for (var i = 0; i < selectCount; i++) {
	        for (var j = 0; j < randCount; j++) {
	          var randIndividual = i;
	          while (randIndividual == i)
	            randIndividual = (Math.random() * selectCount) >> 0;
	          	offspring.push(new Individual(Math.random(), individuals[i].gene,
	                                        individuals[randIndividual].gene));
	        }
	    }
	    individuals.length = size;
	} else {
		var parent = individuals[0];
		console.log(individuals.length)
		var child = new Individual(parent.gene, parent.gene);

		if (child.fitness > parent.fitness)
		individuals = [child];
	}
}

function getFittest() {
	return individuals.sort(function(a, b) {
      return b.fitness - a.fitness;
    })[0];
}

function timeFormat(s) {
	var h = Math.floor(s / 3600);
	var m = Math.floor(s % 3600 / 60);

	s = Math.floor(s % 3600 % 60);

	return ((h > 0 ? h + ':' : '') +
	        (m > 0 ? (h > 0 && m < 10 ? '0' : '') +
	         m + ':' : '0:') + (s < 10 ? '0' : '') + s);
}

// function Evolve(){

// 	//Replace the generated result image from every 100 evolution
// 	resImage = new Image();
// 	resImage.src = 'img/fake.jpg';
// 	resImage.onload = function(){
//     	contextRes.drawImage(resImage, 0, 0);
//   }
// };

/* Each individual represents a single gene in the gene pool.
Randomly decide in the Population if it's inherited from both parents or randomly generated */
function Individual(randInt, father, mother){
	this.gene = [];

	if(randInt == 0){
		//randomly generate a new gene
		for(var i = 0; i < geneLen; i += geneSize ){
			//RGBA
			this.gene.push(Math.random(),  Math.random(), Math.random(), Math.max(Math.random() * Math.random(), 0.4));

			var xOffset = Math.random();
			var yOffset = Math.random();

			//randomly generate positions for each vertex of the polygon
			for(var j = 0; j < verices; j++){
				//randomly generate x, y pos for each of the vertex
				this.gene.push(xOffset + Math.random() - 0.6, yOffset + Math.random() - 0.6);
			}
		}

	}else{
		//inherit from both parents
		var inheritSplit = (Math.random() * geneLen) >> 0;

		for (var i = 0; i < geneLen; i += geneSize) {

			/* The parent's gene which will be inherited */
			var inheritedGene;
	
			if (randomInheritance) {
			  /* Randomly inherit genes from parents in an uneven manner */
			  inheritedGene = (i < inheritSplit) ? father : mother;
			} else {
			  /* Inherit genes evenly from both parents */
			  inheritedGene = (Math.random() < 0.5) ? father : mother;
			}
	
			
			for (var j = 0; j < geneSize; j++) {
	
			  var singleGene = inheritedGene[i + j];
	
			  if (Math.random() < mutationChance) {
	
				/* Apply the random mutation */
				singleGene += Math.random() * mutatationAmount * 2 - mutatationAmount;
	
				/* Keep the value in range */
				if (singleGene < 0)
					singleGene = 0;
	
				if (singleGene > 1)
				  	singleGene = 1;
			  }
			  this.gene.push(singleGene);
			}
		  }
	}

	drawPolygon(contextCur,resolution, resolution, this);


	var imgData = contextCur.getImageData(0, 0, resolution, resolution).data;
	var diff = 0;




	//get the fitness value for the gene
	//sum differences
	for(var i = 0; i < 4 *  resolution * resolution; i++){
		diff += Math.abs(imgData[i] - curData[i]);
	}

	this.fitness = 1 - diff / (resolution * resolution * 256 * 4);
}


function drawPolygon(context, width, height, individual){
	context.fillStyle = '#000';
	context.fillRect(0, 0, width, height);
	//draw gene sequentially
	for(var i = 0; i < geneLen; i += geneSize){

		//starting vertex
		context.beginPath();

		//Could tune some parameters here
		context.moveTo(individual.gene[i + 4] * width, individual.gene[i + 5] * height);

		//draw each vertices
		for(var j = 0; j < vertices - 1; j++){
			context.lineTo(width * individual.gene[i + j * 2 + 6], height * individual.gene[i + j * 2 + 7]);
		}

		context.closePath();

		var styleString = 'rgba(' +
		((individual.gene[i] * 255) >> 0) + ',' + 
		((individual.gene[i + 1] * 255) >> 0) + ',' + 
		((individual.gene[i + 2] * 255) >> 0) + ',' + 
		individual.gene[i + 3] + ')'; 

		//create a polygon
		context.fillStyle = styleString;
		context.fill();
		
  }

}


function drawOriginalImage()
{
  base_image = new Image();
  base_image.src = 'img/marilyn-monroe.jpg';
  base_image.onload = function(){
    contextOri.drawImage(base_image, 0, 0);
    // contextRes.drawImage(base_image, 0, 0);
  }

}

function initPopulation() {
	for (var i = 0; i < 50; i++)
      individuals.push(new Individual());
  	//   console.log(populationSize)
  	// console.log(individuals.length)
}


function initCurData(){
    var imgData = contextOri.getImageData(0,0, resolution, resolution).data;
    for(var i = 0; i < 4 * resolution * resolution; i++){
        curData[i] = imgData[i];
    }
}

function init(){
	var val1 = document.getElementById("populationres");
	var val2 = document.getElementById("mutcres");
	var val3 = document.getElementById("mutares");	
	var val4 = document.getElementById("selectionres");
	var val5 = document.getElementById("polyres");
	var val6 = document.getElementById("runTime");
	var val7 = document.getElementById("numOfGenerations");
	var val8 = document.getElementById("currentFitness");
	val1.innerHTML = 50;
	val2.innerHTML = 2.5+'%';
	val3.innerHTML = 50+'%';
	val4.innerHTML = 50+'%';
	val5.innerHTML = 250;
	val6.innerHTML = 10;
	val7.innerHTML = 50;
	val8.innerHTML = 0+'%';
	document.getElementById("population").oninput = function(){
		val1.innerHTML = populationSize = event.srcElement.value;	
	}
	document.getElementById("mutationChance").oninput = function(){
		mutationChance = event.srcElement.value;	
		val2.innerHTML = mutationChance+'%';
	}
	document.getElementById("mutationAmount").oninput = function(){
		mutationAmount = event.srcElement.value;	
		val3.innerHTML = mutationAmount+'%';
	}
	document.getElementById("selection").oninput = function(){
		selectionCutoff = event.srcElement.value;	
		val4.innerHTML = selectionCutoff+'%';
	}
	document.getElementById("polygon").oninput = function(){
		polygonNumber = event.srcElement.value;	
		val5.innerHTML = polygonNumber;
	}
	drawOriginalImage();
	initPopulation();
	initCurData();
}










