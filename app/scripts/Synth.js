'use strict';

export default class Synth {

  constructor(context) {
    this.context = context;
  }

  play(frequency, startTime, duration) {
    let context = this.context,
      osc1 = context.createOscillator(),
      osc2 = context.createOscillator(),
      volume = context.createGain();

    volume.gain.value = 0.1;

    // Set oscillator wave type
    osc1.type = 'triangle';
    osc2.type = 'triangle';

    // tune
    osc1.frequency.value = frequency;
    osc2.frequency.value = frequency - 3;

    // wire em up
    osc1.connect(volume);
    osc2.connect(volume);
    volume.connect(context.destination);

    // Fade out
    volume.gain.setValueAtTime(0.1, startTime + duration - 0.25);
    volume.gain.linearRampToValueAtTime(0, startTime + duration);

    // Start oscillators
    osc1.start(startTime);
    osc2.start(startTime);

    // Stop oscillators
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }
}
