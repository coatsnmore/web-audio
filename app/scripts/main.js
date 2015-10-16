'use strict';

import BufferLoader from './BufferLoader';

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
  // play(bufferList);
  play();
}

function play(){
  let source = context.createBufferSource();
  source.buffer = masterBuffer[0];

  // Create the gain node.
  let gainNode = context.createGain();
  gainNode.gain.value = 0.3;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  // source1.loop = true;
  source.start(0);
};

window.playWebAudio = play;
