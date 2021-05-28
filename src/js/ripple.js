export default class Ripple {
  constructor(options) {
    let defaultOptions = {
      element: '.ripple',
      directive: 'wave',
      color: 'currentColor',
      initialOpacity: 0.3,
      finalOpacity: 0.14,
      duration: 0.4,
      easing: 'ease-out',
      cancellationPeriod: 75,
      event: 'mousedown',
      ripple: '',
    }

    options ? this.options = Object.assign(defaultOptions, options) : this.options = defaultOptions
  }

  init() {
    let element = document.querySelectorAll(this.options.element)
    element.forEach((el) => {
      el.addEventListener(this.options.event, this._ripple.bind(this, el))
    })
  }

  _getRelativePointer({ x, y }, { top, left }){
    return ({ x: x - left, y: y - top })
  }

  _magnitude(x1, y1, x2, y2) {
    let deltaX = x1 - x2
    let deltaY = y1 - y2
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }
  
  _getDistanceToFurthestCorner(x, y, { width, height }) {
    let topLeft = this._magnitude(x, y, 0, 0)
    let topRight = this._magnitude(x, y, width, 0)
    let bottomLeft = this._magnitude(x, y, 0, height)
    let bottomRight = this._magnitude(x, y, width, height)
    return Math.max(topLeft, topRight, bottomLeft, bottomRight)
  }

  _createContainer({ btl, btr, bbl, bbr }) {
    let waveContainer = document.createElement('div')
    waveContainer.style.top = '0'
    waveContainer.style.left = '0'
    waveContainer.style.width = '100%'
    waveContainer.style.height = '100%'
    waveContainer.style.position = 'absolute'
    waveContainer.style.borderRadius = `${btl} ${btr} ${bbr} ${bbl}`
    waveContainer.style.overflow = 'hidden'
    waveContainer.style.pointerEvents = 'none'
    waveContainer.style.webkitMaskImage = '-webkit-radial-gradient(white, black)'
    return waveContainer
  }
  
  _createWaveElement(x, y, size, options) {
    let waveElement = document.createElement('div')
    waveElement.style.position = 'absolute'
    waveElement.style.width = `${size}px`
    waveElement.style.height = `${size}px`
    waveElement.style.top = `${y}px`
    waveElement.style.left = `${x}px`
    waveElement.style.background = options.color
    waveElement.style.borderRadius = '50%'
    waveElement.style.opacity = `${options.initialOpacity}`
    waveElement.style.transform = `translate(-50%,-50%) scale(0)`
    waveElement.style.transition = `transform ${options.duration}s ${options.easing}, opacity ${options.duration}s ${options.easing}`
    return waveElement
  }

  _incrementWaveCount(el) {
    return this._setWaveCount(el, this._getWaveCount(el) + 1)
  }

  _decrementWaveCount(el) {
    return this._setWaveCount(el, this._getWaveCount(el) - 1)
  }

  _setWaveCount(el, count) {
    return el.dataset[this.options.ripple] = count.toString()
  }

  _getWaveCount(el) {
    return parseInt(el.dataset[this.options.ripple] ?? '0', 10)
  }

  _deleteWaveCount(el) {
    return el.dataset[this.options.ripple]
  }

  _ripple(el, event) {
    let rect = el.getBoundingClientRect()
    let computedStyles = window.getComputedStyle(el)
    let { x, y } = this._getRelativePointer(event, rect)
    let size = 2.05 * this._getDistanceToFurthestCorner(x, y, rect)
    let waveContainer = this._createContainer(computedStyles)
    let waveEl = this._createWaveElement(x, y, size, this.options)

    this._incrementWaveCount(el)

    let originalPositionValue = ''
    if (computedStyles.position === 'static') {
      if (el.style.position) {
        originalPositionValue = el.style.position
      }
      el.style.position = 'relative'
    }

    waveContainer.appendChild(waveEl)
    el.appendChild(waveContainer)

    let shouldDissolveWave = false
    let releaseWave = (e) => {
      if (typeof e !== 'undefined') {
        document.removeEventListener('pointerup', releaseWave)
        document.removeEventListener('pointercancel', releaseWave)
      }

      if (shouldDissolveWave) dissolveWave()
      else shouldDissolveWave = true
    }

    let dissolveWave = () => {
      waveEl.style.transition = 'opacity 150ms linear'
      waveEl.style.opacity = '0'

      setTimeout(() => {
        waveContainer.remove()
        this._decrementWaveCount(el)
        if (this._getWaveCount(el) === 0) {
          this._deleteWaveCount(el)
          el.style.position = originalPositionValue
        }
      }, 150)
    }

    document.addEventListener('pointerup', releaseWave)
    document.addEventListener('pointercancel', releaseWave)

    let token = setTimeout(() => {
      document.removeEventListener('pointercancel', cancelWave)
      requestAnimationFrame(() => {
        waveEl.style.transform = `translate(-50%,-50%) scale(1)`
        waveEl.style.opacity = `${this.options.finalOpacity}`
        setTimeout(() => releaseWave(), this.options.duration * 1000)
      })
    }, this.options.cancellationPeriod)

    let cancelWave = () => {
      clearTimeout(token)
      waveContainer.remove()
      document.removeEventListener('pointerup', releaseWave)
      document.removeEventListener('pointercancel', releaseWave)
      document.removeEventListener('pointercancel', cancelWave)
    }

    document.addEventListener('pointercancel', cancelWave)
  }
}