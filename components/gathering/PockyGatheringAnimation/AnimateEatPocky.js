import data from './animationData';

export default class AnimateEatPocky {
  constructor(domRef) {
    this.anim = window.lottie.loadAnimation({
      container: domRef,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: data,
    });
    this.anim.addEventListener('complete', () => {
      this.isAnimating = false;
    });
    this.isAnimating = false;
  }

  play() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.anim.goToAndPlay(0, true);
    }
  }
}
