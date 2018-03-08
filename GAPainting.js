var canvasOri = document.getElementById('originalImg');
var canvasRes = document.getElementById('resultImg');
var contextOri = canvasOri.getContext('2d');
var contextRes = canvasRes.getContext('2d');


make_base();

function make_base()
{
  base_image = new Image();
  base_image.src = 'img/marilyn-monroe.jpg';
  base_image.onload = function(){
    contextOri.drawImage(base_image, 0, 0);
    contextRes.drawImage(base_image, 0, 0);

  }

}