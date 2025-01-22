const numHarmonics = 16;
let harmonics = [];
let mouseOverHarmonic = -1;

function setup() {
  const head = document.getElementsByClassName("masthead")[0];
  const headHeight = head.offsetHeight;
  console.log(headHeight);

  const bodyWidth = document.body.offsetWidth;
  const bodyHeight = windowHeight / 1.5;
  createCanvas(bodyWidth, bodyHeight);
  outputVolume(0.5);

  const f0 = 100;
  for (let i = 0; i < numHarmonics; i++) {
    let osc = new p5.Oscillator("sine");
    osc.freq((i + 1) * f0);
    osc.start();

    let env = new p5.Envelope();
    env.setInput(osc);
    env.setADSR(0.05, 0, 1, 3);
    env.setExp(true);
    env.mult(1 / (i / 4 + 1));

    let harmonic = {
      osc: osc,
      env: env,
    };
    harmonics.push(harmonic);
  }
}

function draw() {
  background(255);

  const xPadding = width * 0.33;
  const yPadding = 0;

  const xOffset = max(xPadding / 2, width / 3 / numHarmonics);
  const yOffset = yPadding / 2;
  const maxAmp = (width - xOffset) / 3 / numHarmonics;
  const minAmp = (width - xOffset) / 4 / numHarmonics;

  const numPoints = 150;

  for (let i = 0; i < numHarmonics; i++) {
    push();
    let tx = map(i, 0, numHarmonics - 1, xOffset, width - xOffset);
    translate(tx, 0);

    const f_harmonic = (i + 1) / 2;
    let h_amplitude;

    if (harmonics[i].env.wasTriggered) {
      h_amplitude = maxAmp;
      strokeWeight(2);
    } else {
      h_amplitude = minAmp;
      stroke(0);
      strokeWeight(1);
    }

    for (let k = 0; k < 2; k++) {
      beginShape();
      noFill();
      stroke(0);
      for (let j = 0; j < numPoints; j++) {
        let phi = (j / (numPoints - 1)) * TWO_PI;

        if (harmonics[i].env.wasTriggered) {
          phi += frameCount * 0.05;
        }
        if (k == 1) phi *= -1;

        let hx = sin(f_harmonic * phi) * h_amplitude;
        let hy = map(j, 0, numPoints - 1, yOffset, height - yOffset);
        vertex(hx, hy);
      }
      endShape();
    }
    pop();
  }

  if (getAudioContext().state !== "running") {
    userStartAudioMessage();
  } else {
    mouseOverHarmonic = round(
      map(mouseX, xOffset, width - xOffset, 0, numHarmonics - 1)
    );
  }
}

function userStartAudioMessage() {
  fill(0);
  textSize(30);
  textAlign(CENTER, BASELINE);
  rectMode(CENTER);

  let textMsg = "Click to enable audio";
  fill(0);
  rect(
    width / 2,
    (height - textAscent()) / 2,
    textWidth(textMsg),
    textAscent() * 1.25
  );
  fill(255);
  noStroke();
  text(textMsg, width / 2, height / 2);
}

function mousePressed() {
  if (withinCanvas()) {
    if (getAudioContext().state !== "running") {
      userStartAudio();
    }
    if (mouseOverHarmonic >= 0 && mouseOverHarmonic < numHarmonics) {
      if (!harmonics[mouseOverHarmonic].env.wasTriggered) {
        harmonics[mouseOverHarmonic].env.triggerAttack();
      }
    }
  }
}

function keyPressed() {
  if (getAudioContext().state == "running") {
    for (let i = 0; i < harmonic_keys.length; i++) {
      if (harmonic_keys[i] == key) {
        if (!harmonics[i].env.wasTriggered) {
          harmonics[i].env.triggerAttack();
        }
      }
    }
  }
}

function keyReleased() {
  for (let i = 0; i < harmonic_keys.length; i++) {
    if (harmonic_keys[i] == key) {
      if (harmonics[i].env.wasTriggered) {
        harmonics[i].env.triggerRelease();
      }
    }
  }
}

function mouseDragged() {
  if (withinCanvas()) {
    for (let i = 0; i < numHarmonics; i++) {
      if (i == mouseOverHarmonic) {
        if (!harmonics[i].env.wasTriggered) {
          harmonics[i].env.triggerAttack();
        }
      } else {
        if (harmonics[i].env.wasTriggered) {
          harmonics[i].env.triggerRelease();
        }
      }
    }
  }
}

function mouseReleased() {
  for (let i = 0; i < numHarmonics; i++) {
    if (harmonics[i].env.wasTriggered) {
      harmonics[i].env.triggerRelease();
    }
  }
}

function withinCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

const harmonic_keys = [
  "q",
  "a",
  "w",
  "s",
  "e",
  "d",
  "r",
  "f",
  "t",
  "g",
  "y",
  "h",
  "u",
  "j",
  "i",
  "k",
];
