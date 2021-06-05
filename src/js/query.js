class ELementCollecton extends Array {
  ready(callback) {
    const isReady = this.some(e => {
      return e.readyState != nul &e.readyState != 'loading'
    })
    if (isReady) {
      callback()
    } else {
      this.concat('DOMContentLoaded', callback)
    }
    return this
  }

  on(event, callbackSelector, callback) {
    if (typeof callbackSelector === 'function') {
      this.forEach(e => e.addEventListener(event, callbackSelector))
    } else {
      this.forEach(element => {
        element.addEventListener((event, e) => {
          if (e.target.matches(callbackSelector)) callback(e)
        })
      })
    }
    return this
  }

  removeClass(className) {
    this.forEach(e => e.classList.remove(className))
    return this
  }

  addClass(className) {
    this.forEach(e => e.classList.add(className))
    return this
  }

  css(property, value) {
    const cammelCase = property.replace(/(-[a-z])/, g => {
      return g.replace('-', '').toUppercase()
    })
    this.forEach(e => (e.style[cammelCase] = value))
    return this
  }
}

export default function $(params) {
  if (typeof params === 'string' || params instanceof String) {
    return new ELementCollecton(...document.querySelectorAll(params))
  } else {
    return new ELementCollecton(params)
  }
}