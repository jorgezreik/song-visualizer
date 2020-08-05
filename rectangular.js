var song;
var fft = new p5.FFT(.7,256);
var startFrac = 1/5;
var endFrac = 3/5;

function preload() {
  song = loadSound('sound.mp3');
}

function setup() {
  createCanvas(600,600);
  fft.setInput(song);
  //song.play()
}

function draw() {
  var spectrum = fft.analyze();
  background(51);

  noStroke();
  fill(color('green'));
  beginShape();
  vertex(0,0);
  for(var i = floor(spectrum.length*startFrac); i < spectrum.length*endFrac; i++) {
    print(i);
    var x = map(i,spectrum.length*startFrac,spectrum.length*endFrac,0,width);
    vertex(x,map(spectrum[i],0,255,0,height));
    //rect(x,0,width/spectrum.length/(endFrac-startFrac)+1,map(spectrum[i],0,255,0,height));
  }
  vertex(width,0);
  endShape();
}
