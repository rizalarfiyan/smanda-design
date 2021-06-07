class Public {
  constructor(options) {
    let defaultOption = {
      dropdown: '.dropdown:not(.hover)',
      mainNav: '.main-nav',
      contentNav: '.content-nav',
      mobileAction: '.mobile-action',
      showMobileNav: '.toggle-menu-action',
      buttonMobileAction: '.toggle-show button',
    }
    options ? this.options = Object.assign(defaultOption, options) : this.options = defaultOption
    this.html = document.querySelector('html')
    this.mainNav = document.querySelector(this.options.mainNav)
    this.contentNav = document.querySelector(this.options.contentNav)
    this.lastScroll = 0
  }

  init() {
    this._dropdown()
    this._initNavScroll()
    this._showMobileNav()
    this._mobileAction()
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

  _showMobileNav() {
    let mobileElement = document.querySelectorAll(this.options.showMobileNav)
    mobileElement.forEach(elem => {
      elem.addEventListener('click', () => {
        if (this.contentNav.classList.contains('is-open')) {
          this.contentNav.classList.remove('is-open')
          this.html.style.overflow = "auto"
        } else {
          this.contentNav.classList.add('is-open')
          this.html.style.overflow = "hidden"
        }
      })
    })
  }

  _mobileAction() {
    let mobileAction = document.querySelector(this.options.mobileAction)
    let button = mobileAction.querySelector(this.options.buttonMobileAction)
    button.addEventListener('click', () => {
      if (mobileAction.classList.contains('active')) {
        mobileAction.classList.remove('active')
      } else {
        mobileAction.classList.add('active')
      }
    })
  }
}

new Public().init()