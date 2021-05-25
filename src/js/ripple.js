const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
  button.onmousedown = function(e) {
    const $this = this
    let duration = 0.7
    const easing = 'linear'
    const opacity = 0.4

    $this.classList.add('has-ripple')
    
    const ripple = document.createElement('span');
    $this.appendChild(ripple);
    ripple.className = 'ripple';
    
    const size = Math.max($this.offsetWidth, $this.offsetHeight)
    ripple.style.height = `${size}px`
    ripple.style.width = `${size}px`

    const rate = Math.round(ripple.clientWidth / duration)
    var newDuration = ( ripple.clientWidth / rate);

    if(duration.toFixed(2) !== newDuration.toFixed(2)) {
      duration = newDuration;
    }

    ripple.style.animationDuration = `${duration}s`
    ripple.style.animationTimingFunction = easing
    ripple.style.background = window.getComputedStyle($this).color
    ripple.style.opacity = opacity

    ripple.classList.remove("ripple-animate");

    const x = e.pageX - this.offsetLeft - ripple.clientWidth / 2;
    const y = e.pageY - this.offsetTop - ripple.clientWidth / 2;

    ripple.addEventListener('animationend', () => {
      ripple.remove()
    })
    
    ripple.style.top = `${y}px`
    ripple.style.left = `${x}px`
    ripple.classList.add('ripple-animate')
  }
})