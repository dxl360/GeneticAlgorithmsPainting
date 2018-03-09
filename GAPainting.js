var canvasOri = document.getElementById('originalImg');
var canvasRes = document.getElementById('resultImg');
var contextOri = canvasOri.getContext('2d');
var contextRes = canvasRes.getContext('2d');

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

window.onload = function(){
	init();
	  
	document.getElementById("run").onclick = function () {
		alert("Starting");
		// Evolve();
		runGA();
	};
	document.getElementById("pause").onclick = function () {
		// Pause Evolve()
		alert("Stopped");
		stopGA();
	};

}

function runGA() {
	while (true) {
		generatePopulation();
		numOfGenerations++;
		var fittest = population.getFittest();
		var totalTime = ((new Date().getTime() - startTime) / 1000);
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
		draw(fittest, contextRes, 350, 350);
		/* update statistics */
		document.getElementById("runTime").innerHTML = timeFormat(Math.round(totalTime));
		document.getElementById("numOfGenerations").innerHTML = numOfGenerations;
		document.getElementById("currentFitness").innerHTML = currentFitness.toFixed(2) + '%';
	}
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
	          	offspring.push(new Individual(Math.random(), this.individuals[i].dna,
	                                        this.individuals[randIndividual].dna));
	        }
	    }
	    individuals.length = size;
	} else {
		var parent = this.individuals[0];
		var child = new Individual(parent.gene, parent.gene);

		if (child.fitness > parent.fitness)
		individuals = [child];
	}
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


function drawOriginalImage()
{
  base_image = new Image();
  base_image.src = 'img/marilyn-monroe.jpg';
  base_image.onload = function(){
    contextOri.drawImage(base_image, 0, 0);
    // contextRes.drawImage(base_image, 0, 0);
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
}










