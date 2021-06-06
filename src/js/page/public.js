class Public {
  constructor(options) {
    let defaultOption = {
      dropdown: '.dropdown:not(.hover)',
      mainNav: '.main-nav',
      contentNav: '.content-nav',
    }
    options ? this.options = Object.assign(defaultOption, options) : this.options = defaultOption
    this.mainNav = document.querySelector(this.options.mainNav)
    this.contentNav = document.querySelector(this.options.contentNav)
    this.lastScroll = 0
  }

  init() {
    this._dropdown()
    this._initNavScroll()
  }

  _dropdown() {
    let dropdownElement = document.querySelectorAll(this.options.dropdown)
    dropdownElement.forEach(element => {
      element.addEventListener('click', () => {
        element.classList.toggle('active')
      })
    })
  }

  _initNavScroll() {
    window.addEventListener('scroll', () => this._navScroll())
  }

  _navScroll() {
    let offset = 60
    let mainNav = this.mainNav.classList
    let contentNav = this.contentNav.classList
    const y = window.pageYOffset

    if (y !== 0) {
      mainNav.add('active')
      contentNav.add('active')
    } else {
      mainNav.remove('active')
      contentNav.remove('active')
    }
    
    if (y < 0) return
    if (Math.abs(y - this.lastScroll) < offset) return
    if (y > this.lastScroll) {
      contentNav.add('hide')
    } else {
      contentNav.remove('hide')
    }
    this.lastScroll = y
  }
}

new Public().init()