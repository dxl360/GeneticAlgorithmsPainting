var canvasOri = document.getElementById('originalImg');
var canvasRes = document.getElementById('resultImg');
var contextOri = canvasOri.getContext('2d');
var contextRes = canvasRes.getContext('2d');

var populationSize;
var mutationChance;
var mutationAmount;
var selectionCutoff;
var polygonNumber;

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
		val5.innerHTML = polygonNumber;
	}
}


