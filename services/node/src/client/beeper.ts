const FREQUENCY = 440;
const INTERVAL = 250;
const RAMP_VALUE = 0.00001;
const RAMP_DURATION = 1.5;
const BEEP_VOLUME = 1;

interface Options {
  frequency?: number;
  interval?: number;
}

class Beeper {
  frequency: number;
  interval: number;
  audioContext: AudioContext;

  constructor(options: Options = {}) {
    this.frequency = options.frequency || FREQUENCY;
    this.interval = options.interval || INTERVAL;
    this.audioContext = new window.AudioContext();
  }

  resume() {
    this.audioContext.resume();
  }

  play() {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    const currentTime = this.audioContext.currentTime;
    gain.gain.setValueAtTime(BEEP_VOLUME, currentTime);
    gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION);

    osc.onended = () => {
      gain.disconnect(this.audioContext.destination);
      osc.disconnect(gain);
    }

    osc.type = 'sine';
    osc.frequency.value = this.frequency;
    osc.start(currentTime);
    osc.stop(currentTime + RAMP_DURATION);
  }

  beep(times = 1) {
    const self = this;
    (function loop(i) {
      self.play();
      if (++i < times) setTimeout(loop, self.interval, i)
    })(0)
  }
}

export default Beeper;
