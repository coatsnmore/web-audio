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
    duration = 0.5,
    startTime = context.currentTime;

  let song = ['G3', 'A#3/Bb3', 'D#4/Eb4', 'G3', 'A#3/Bb3', 'G#3/Ab3', 'G3'];

  for (var i = 0; i < song.length; i++) {
    synth.play(song[i], startTime + duration * i, duration);
  }
}

window.playKick = playKick;
window.playSynth = playSynthSong;
