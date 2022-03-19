

// var WebAudioRecorder = require('WebAudioRecorder.min');
// var ResonanceAudio = require('resonance-audio.min');
// var io = require('socket.io.js')

let voice = new p5.Speech('Samantha', listen) //'Google UK English Male'

// set up basic variables for app
//var buttons = document.querySelector('#buttons')
var recordButton = document.querySelector('.recordButton');
var stopButton = document.querySelector('.stopButton');
var listenButton = document.querySelector('.listenButton');
var recordClips = document.querySelector('.recordClips');
var listenClips = document.querySelector('.listenClips');
var mainControls = document.querySelector('.mainControls');
var loading = document.querySelector('#loading');
//var canvas = document.querySelector('.visualizer');
// var playContribute = document.querySelector('#playContribute');
var dbAudio = {}
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

// visualiser setup - create web audio api context and canvas //var audioCtx = new (window.AudioContext || webkitAudioContext)();
//var source = audioCtx.createBufferSource();
//var canvasCtx = canvas.getContext("2d");
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx //new audio context to help us record
var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode
var audioE //audio object for listening

// listenButton.addEventListener("click", listen);

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

// playContribute.preload = "auto";
// playContribute.autoplay = true;

function startRecording() {
	audioCtx = new AudioContext();

	console.log("startRecording() called");
  var constraints = { audio: true, video:false }

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/

		//commented out for ASMR add// audioCtx = new AudioContext();

		//update the format
		//document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"

		//assign to gumStream for later use
		gumStream = stream;

		/* use the stream */
		input = audioCtx.createMediaStreamSource(stream);

		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding
		//encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;

		//disable the encoding selector
		//encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "js/", // must end with slash
		  encoding: "wav",
		  numChannels:1, //2 is the default, mp3 encoding supports only 2
			sampleRate:16000,
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    console.log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    console.log(encoding+" encoder loaded");
		  }
		});
    

    stopButton.style.background = "red";
    stopButton.disabled = false;
    stopButton.hidden = false;
    recordButton.disabled = true;
    recordButton.hidden = true;
/*
    await sleep(1000);
    stopButton.textContent = 'recording for 4 seconds'
    await sleep(1000);
    stopButton.textContent = 'recording for 3 seconds'
    await sleep(1000);
    stopButton.textContent = 'recording for 2 seconds'
    await sleep(1000);
    stopButton.textContent = 'recording for 1 seconds'
    await sleep(1000);
    stopButton.click();*/

		recorder.onComplete = function(recorder, blob) {
			console.log("Encoding complete");
			createDownloadLink(blob,recorder.encoding);
			//encodingTypeSelect.disabled = false;
    //   socket.binary(true).emit('stream-data', blob); //makes this into socket conveyed stream???? recorder? other? blob?

		}

		recorder.setOptions({
		  timeLimit:15,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });
    
		//start the recording process
        // recorder.startRecording = function(recorder, blob){
    //   console.log("encoding started");
    //   socket.emit('stream-data', blob); //makes this into socket conveyed stream???? recorder? other? blob?
    // };
		recorder.startRecording();
		// console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;

	});

	//disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
	// console.log("stopRecording() called");
//   socket.emit('stream-end');

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	stopButton.disabled = true;
	recordButton.disabled = false;
  recordButton.style.background = "";
  recordButton.style.color = "";
  // mediaRecorder.requestData();
  stopButton.hidden = true;
  stopButton.textContent = 'recording for 5 seconds'
  recordButton.hidden = false;

	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();
	// console.log('Recording stopped');
//   socket.emit('stream-reset');
//   socket.emit('message', 'recording stopped');
}

function createDownloadLink(blob,encoding) {
	var url = URL.createObjectURL(blob);
  console.log(url)
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	au.controls = true;
	au.autoplay = true;
	au.src = url;
	link.href = url;
	var fileName = url.slice(38);
  var createdAt = new Date().toISOString() //+ '.'+encoding;
	link.download = fileName
	link.innerHTML = link.download;
//	link.hidden = true;
	console.log(blob)
	//console.log(url)

	//add the new audio and a elements to the li element
	//li.appendChild(au);
	//li.appendChild(link);
	//recordingsList.appendChild(li);
	var clipText = 'feature is forthcoming'
	var clipContainer = document.createElement('article');
	var clipLabel = document.createElement('p');
	var addButton = document.createElement('button');
	clipContainer.classList.add('clip');
	addButton.textContent = 'add to the database';
	addButton.className = 'add';
	clipContainer.appendChild(au);
	clipContainer.appendChild(link)
	clipContainer.appendChild(clipLabel);
	clipContainer.appendChild(addButton);
	//recordClips.appendChild(clipContainer);
	//inserts the new recording at the beginning of the list instead of after
	recordClips.insertBefore(clipContainer, recordClips.childNodes[0])


  
	addButton.onclick = function(e) {
		addButton.textContent = 'your contribution will be added soon, thank you!'
    
    // socket.emit('message', 'new audio to process');
    // socket.binary(true).emit('blob', {data: blob}) //sending original audio to be deepspeeched

    
    //for files with form method
		function uploadFile(b, n, c) {
			var data = new FormData()
			data.append('blob', b, ("audio/" + n + ".wav"))
			data.append('name', n)
      data.append('createdAt', c)
      console.log(data.getAll('blob'))
			
      fetch('api/newfile', {
				method: 'POST',
				body: data
			}).then(res => res.json())
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.error(err)
        })

    }
    
	uploadFile(blob, fileName, createdAt)
	}
}

//for files with form method
function getFile(d, f) {
	var data = new FormData()
	data.append('docid', d)
	data.append('fileid', f)
	// console.log(data.getAll('blob'))

	// fetch("/api/getfile").then(function(res){
	// 	return res.json() //converts to body of response only
	//   }).then(function(res){
	//   })
	
	fetch('api/getfile', {
			method: 'POST',
			body: data
		}).then(res => res.json())
	.then(data => {
		console.log(data)
	})
	.catch(err => {
		console.error(err)
	})
}

//attempts to call an update for a post, not sure it's gonna work yet because the url?
// function update(id, updateKey, updateValue){
//   var data = new FormData()
//   data.append('id', id)
//   data.append('name', id)
//   data.append('updateKey', updateKey)
//   data.append('updateValue', updateValue)
//   console.log(data.getAll('name'))
  
//   var path = `/query/${id}/${updateKey}/${updateValue}`
//   console.log(path)
  
//   fetch(path, {
// 				method: 'POST',
// 				body: data
// 			})//.then(res => res.json())
//         .then(data => {
//           console.log(data)
//         })
//         .catch(err => {
//           console.error(err)
//         })
// }

// update("cjuumtdnj0sgs0160jw621fta", "file2url", "'https://innervoiceover.glitch.me/audio/cjuumtbwo0sgo0160qoud8mfhtts.wav'")

//pulls the whole database and selects random items to play
function listen() {
  
  fetch('/api/getall').then(function(res){
    return res.json() //converts to body of response only
  })
  .then(function(dbAudio){
    dbAudio = dbAudio[0].rows
    console.log(dbAudio)
    return dbAudio
  })
  .then(function(dbAudio){
		loading.innerHTML = "ready. click to listen"
//Handle click, set up room, select random doc
        //on each click of the listen button selects random item and creates audio object
      listenButton.onclick = function(e){
			audioCtx = new AudioContext();
				// ASMR room
				// let resonanceAudioScene = new ResonanceAudio(audioCtx);
				// 	resonanceAudioScene.output.connect(audioCtx.destination);
				// 	//variables roomDimensions roomMaterials set at top
				// 	let roomDimensions = { width: 1, height: 1, depth: 1 };
				// 	let roomMaterials = {
				// 		left: 'curtain-heavy', //'glass-thick'
				// 		right: 'curtain-heavy', //'concrete-block-coarse'
				// 		front: 'curtain-heavy',//'sheetrock'
				// 		back: 'curtain-heavy',
				// 		down: 'curtain-heavy',
				// 		up: 'curtain-heavy'
				// 	};    
				// resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);

        //pick random item
          var random = randomItem(dbAudio)
          var randomId = random.id
          var randomDoc = random.doc
          var clipText = randomDoc.text		  
		  if (clipText == '') {
            random = randomItem(dbAudio)
            clipText = random.text
          }
		  console.log(clipText)
		  //speak using p5>
          let clip = voice.speak(clipText)


        // let attachment = Object.values(randomDoc._attachments)
		// let listenFile = attachment[0].data
		// listenFile = atob(decodeURIComponent(listenFile))
		// listenFile = new Blob([listenFile], {type: "audio/x-wav"})
		// let FILE_URL = window.URL.createObjectURL(listenFile)
		// console.log(FILE_URL)

		//download existing audio
		let fileid = randomDoc._attachments
		// fileid = Object.keys(fileid)[0].data
		console.log(fileid)
		
		// WORKING ON HERE TO GET IT TO PULL AUDIO FILE
		// let clip = getFile(randomDoc, fileid)
		// console.log(clip)

				//create clip object to play
				var clipContainer = document.createElement('article');
				var clipLabel = document.createElement('p');
				clipLabel.textContent = clipText;
				var audioE = document.createElement('audio');
				clipContainer.classList.add('clip');
				audioE.setAttribute('controls', '');
				audioE.setAttribute('autoplay', '');
				audioE.setAttribute('type', 'audio/wav') //type="audio/wav" 
				// audioE.src = FILE_URL
				audioE.src = clip
				console.log(audioE.src)
					
					//reinsert for ASMR
		// 							var audioSource = audioCtx.createMediaElementSource(audioE);
		// 							var resonanceSource = resonanceAudioScene.createSource();
		// 							audioSource.connect(resonanceSource.input)//.connect.(audioCtx.destination);
		// 							//adjust ambisonicOutput of source objects to move as they play each time, a random output
		// 							let soundX = eitherOr(), soundY = 0, soundZ = 0;
		// 							resonanceSource.setPosition(soundX, soundY, soundZ);
		// 							resonanceAudioScene.setListenerPosition(0, 0, 0);
		// 							//resonanceSource.setMaxDistance(3.3);
				
					// clipContainer.appendChild(audioE);
					loading.style.visibility = "hidden";
					clipContainer.appendChild(clipLabel);
					listenClips.appendChild(clipContainer);
					window.onresize();
					//listenClips.style.marginTop = aboveHeight;
	  		}				
		}).catch(err => console.error(err))
	}

//to call random item from databasse
function randomItem(array) {
  var num = Math.floor((Math.random() * array.length))
  var random = array[num]
  return random
}

//generates random distance in meters
function randomNum() {
	var num = (Math.random() * 10 - 5)
	console.log(num + " x distance")
	return num
}

function eitherOr() {
	var choose
	let left = -0.1
	let right = 0.1
	const rand = Math.random() < 0.5
	if (rand == 1) {
		choose = right
	} else {
		choose = left
	}
	console.log(choose)
	return choose
}

var middleHeight = String((window.innerHeight/2) - (mainControls.offsetHeight/2)) + 'px'
var aboveHeight = String((window.innerHeight/2) - (mainControls.offsetHeight/2) - listenClips.offsetHeight) + 'px'


window.onresize = function() {
  //canvas.width = mainControls.offsetWidth;
	var middleHeight = String((window.innerHeight/2) - (mainControls.offsetHeight/2)) + 'px'
	var aboveHeight = String((window.innerHeight/2) - (mainControls.offsetHeight/2) - listenClips.offsetHeight) + 'px'
	var belowHeight = String((window.innerHeight/2) + (mainControls.offsetHeight*3)) + 'px'
	console.log(middleHeight, aboveHeight, belowHeight)
	mainControls.style.marginTop = middleHeight;
	listenClips.style.marginTop = aboveHeight;
	recordClips.style.marginTop = belowHeight;
}

window.onresize();
