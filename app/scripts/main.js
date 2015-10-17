'use strict';

import BufferLoader from './BufferLoader';
import Synth from './Synth';

window.onload = init;
var context;
var bufferLoader;
var masterBuffer;

function init() {
  let contextClass = (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext);
  if (contextClass) {
    // Web Audio API is available.
    context = new contextClass();
  } else {
    console.error('Browser does not support AudioContext, uh oh!');
  }

  bufferLoader = new BufferLoader(
    context, [
      'sounds/kick.wav'
    ],
    finishedLoading
  );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  masterBuffer = bufferList;
}

function playKick() {
  let source = context.createBufferSource();
  source.buffer = masterBuffer[0];

  // Create the gain node.
  let gainNode = context.createGain();
  gainNode.gain.value = 0.3;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0);
}

function playSynthSong() {

  let synth = new Synth(context),
    B = 493.883,
    E = 659.255,
    A = 880.00,
    duration = 0.5,
    startTime = context.currentTime;

  synth.play(B, startTime, duration);
  synth.play(E, startTime + duration, duration);
  synth.play(A, startTime + duration * 2, duration);
}

window.playKick = playKick;
window.playSynth = playSynthSong;
