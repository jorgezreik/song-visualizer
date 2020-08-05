/*must run on localhost server with node http-server
click to start to avoid audiocontext limits
run in incognito window to prevent caching*/

//globals
var song;
var art;
var blur;
var ampl = new p5.Amplitude(.8);
var fft = new p5.FFT(.64,256);

//config
var startFrac = 1/8;
var endFrac = 3/5;
var radius = 180;
var heights = [1,2/3,1/3]
var colorList = [];
var maxHeight = 300;
var cutoff = 60;
var verticalOffset = 30;

function preload() {
  song = loadSound('sound.mp3');
  art = loadImage('artwork.png');
  blur = loadImage('blur.png');
}

function setup() {
  createCanvas(1440,862);
  fft.setInput(song);
  colorList = [color('#9fb4cf'),color('#b77d72'),color('#322020')];
  imageMode(CENTER);
}

function draw() {
  if (getAudioContext().state !== 'running') {
      text('click to start audio', width/2, height/2);
    } else {
      text('audio is enabled', width/2, height/2);
    }

  var spectrum = fft.analyze();
  background(51);

  var mapped = [];
  var specStart = floor(spectrum.length*startFrac);
  var specEnd = floor(spectrum.length*endFrac);

  noStroke();
  translate(width/2,height/2 + verticalOffset);
  image(blur,0,0,width,width);
  scale(map(ampl.getLevel(),0,1,1,1.4));

  for(var i = 0; i < spectrum.length; i++) {
    if(spectrum[i]<=cutoff)
      spectrum[i]=0;
    else
      spectrum[i]-=cutoff;
  }

  for(var i = specStart; i < specEnd; i++) {
    mapped[i] = map(spectrum[i],0,255,0,maxHeight);
  }

  for(var k = 0; k < 3; k++) {
    var xShape = [];
    var yShape = [];

    for(var i = specStart; i < specEnd; i++) {
      var theta = map(i,specStart,specEnd,-PI/2,PI/2);
      var x = cos(theta)*(k+radius+mapped[i]*heights[k]);
      var y = sin(theta)*(k+radius+mapped[i]*heights[k]);
      xShape.push(x);
      yShape.push(y);
    }

    for(var i = specEnd; i > specStart; i--) {
      var theta = map(i,specStart,specEnd,-PI/2,PI/2);
      var x = cos(theta)*(k+radius+mapped[i]*heights[k]);
      var y = sin(theta)*(k+radius+mapped[i]*heights[k]);
      xShape.push(-x);
      yShape.push(y);
    }

    beginShape();
    fill(colorList[k]);
    for(var i = 0; i < xShape.length; i++) {
      vertex(xShape[i],yShape[i]);
    }
    endShape();
  }
  image(art,0,0,radius*2,radius*2);
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  song.play();
}
