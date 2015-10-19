'use strict';

import Synth from './Synth';
import BufferLoader from './BufferLoader';

export default class SynthController {
  constructor() {
    this.name = 'Synth';
    let contextClass = (window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext),
      buffer, thisSynth = this;
    if (contextClass) {
      // Web Audio API is available.
      this.context = new contextClass();
      this.bufferLoader = new BufferLoader(
        this.context, [
          'sounds/kick.wav'
        ],
        function (bufferList){
          thisSynth.masterBuffer = bufferList;
        }
      ).load();

      // this.masterBuffer = buffer;
      // this.bufferLoader.load();
    } else {
      console.error('Browser does not support AudioContext, uh oh!');
    }
  }

  playSong(type) {
    let synth = new Synth(this.context),
      duration = 0.5,
      startTime = this.context.currentTime;

    let song = ['G3', 'A#3/Bb3', 'D#4/Eb4', 'G3', 'A#3/Bb3', 'G#3/Ab3', 'G3'];

    for (var i = 0; i < song.length; i++) {
      synth.play(song[i], startTime + duration * i, duration, type);
    }
  }

  playKick() {
    let source = this.context.createBufferSource();
    source.buffer = this.masterBuffer[0];

    // Create the gain node.
    let gainNode = this.context.createGain();
    gainNode.gain.value = 0.3;
    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    source.start(0);
  }
}
