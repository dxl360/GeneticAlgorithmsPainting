var canvasOri = document.getElementById('originalImg');
var canvasRes = document.getElementById('resultImg');
var contextOri = canvasOri.getContext('2d');
var contextRes = canvasRes.getContext('2d');

contextCur --- workingContext
canvasCur --- workingCanvas

var populationSize;
var mutationChance;
var mutationAmount;
var selectionCutoff;
var polygonNumber;

//speficy resolution (workingSize)
var resolution = 75;

//specify the number of vertices, which is now initialized to be 
var vertices = 3;

//initialized in the init 
var geneLen;
//hard coded
var geneSize = 4  + vertices * 2;





window.onload = function(){
	make_base();
	init();
	  
	document.getElementById("run").onclick = function () {
		alert("Starting");
		Evolve();
	};
	document.getElementById("pause").onclick = function () {
		// Pause Evolve()
		alert("Stopped");
	};

}

function Evolve(){

	//Replace the generated result image from every 100 evolution
	resImage = new Image();
	resImage.src = 'img/fake.jpg';
	resImage.onload = function(){
    	contextRes.drawImage(resImage, 0, 0);
  }


};


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


	var imgData = getImageData(0, 0, resolution, resolution).data;
	var diff = 0;




	//get the fitness value for the gene
	//sum differences
	for(var i = 0; i < 4 *  resolution * resolution; i++){
		diff += Math.abs(imageData[i] - workingData[i]);
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
		ctx.fillStyle = styleString;
		ctx.fill();
		
  }

}





function make_base()
{
  base_image = new Image();
  base_image.src = 'img/marilyn-monroe.jpg';
  base_image.onload = function(){
    contextOri.drawImage(base_image, 0, 0);
    contextRes.drawImage(base_image, 0, 0);
  }

}

function init(){
	var val1 = document.getElementById("populationres");
	var val2 = document.getElementById("mutcres");
	var val3 = document.getElementById("mutares");	
	var val4 = document.getElementById("selectionres");
	var val5 = document.getElementById("polyres");
	val1.innerHTML = 50;
	val2.innerHTML = 2.5+'%';
	val3.innerHTML = 50+'%';
	val4.innerHTML = 50+'%';
	val5.innerHTML = 250;
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
		geneLen = polygonNumber * (4 + vertices * 2);
		val5.innerHTML = polygonNumber;
	}

	
}


