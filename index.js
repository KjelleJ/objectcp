import 'regenerator-runtime'; // only for parcel
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as cpu from '@tensorflow/tfjs-backend-cpu'
import * as webgl from '@tensorflow/tfjs-backend-webgl'

  var model;
  
  document.getElementById('predict').onclick = predict; // (1)
  document.getElementById('pasteArea').onpaste = pastedImage; // (2)
  
  const img = document.getElementById('img'); // dogs
  const c = document.getElementById('canvas_v');
  const context = c.getContext('2d');

  // Anropa funktionen loadModel
  loadModel();
  
  // Ladda modellen och när det är klart kan vi klassificera bilderna
async function loadModel() {
	console.log("loading...");
	// mobilenet_v2
	// mobilenet_v1 -- best?
	// lite_mobilenet_v2
	model = await cocoSsd.load({base: 'mobilenet_v1'});
	console.log("model loaded");
	document.getElementById("predict").disabled = false; // (3) enable predict button
	document.getElementById('results').innerHTML='';
}  

async function predict() {
	context.font = '14px Arial'; 
	const result = await model.detect(img);
	// make canvas as big as the image
    c.width = img.width;
    c.height = img.height;
	// draw image from img on canvas
	context.drawImage(img, 0, 0);
	var text = '';
	for (let i = 0; i < result.length; i++) {
		console.log(result[i]);
		// draw rectangle on canvas for detected object
		context.beginPath();
		context.rect(...result[i].bbox);
		context.lineWidth = 2;
		context.strokeStyle = 'red';
		// draw text for object class on canvas 
		context.fillStyle = 'white';
		context.stroke();
		context.fillText(i + 1 + ' ' + result[i].class, 
			result[i].bbox[0], result[i].bbox[1] + 20);
		text = text + '<b>' + (i+1) + ' ' + (result[i].score*100).toFixed(0) + '%</b> ' +
			result[i].class + ' ' +  '<br>';
	}
	document.getElementById('results').innerHTML=text; // (4)
	document.getElementById('c_canvas').style.display = 'block'; // (5)
	document.getElementById('c_img').style.display = 'none';
}

  //  hantera inklistrad bild - http://jsfiddle.net/bt7BU/225/
  function pastedImage() { // (6)
	// use event.originalEvent.clipboard for newer chrome versions
	var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
	//  console.log(JSON.stringify(items)); // will give you the mime types
	// find pasted image among pasted items
	var blob = null;
	for (var i = 0; i < items.length; i++) {
		if (items[i].type.indexOf("image") === 0) {
		blob = items[i].getAsFile();
		}
	}
	// load image if there is a pasted image
	if (blob !== null) {
		var reader = new FileReader();
		reader.onload = function(event) {
        // console.log(event.target.result); // data url!
		document.getElementById("img").src = event.target.result;
		};
		reader.readAsDataURL(blob);
		document.getElementById('results').innerHTML='';
		document.getElementById('c_canvas').style.display = 'none'; // (7)
		document.getElementById('c_img').style.display = 'block';
		}
	}


