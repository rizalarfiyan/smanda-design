class DOCS {
  constructor(options) {
    let defaultOption = {
      element: '#TOCDocs',
      content: '#content',
      section: 'section[data-heading][data-name]',
      icon: true,
      defaultIcon: 'fa fa-ban',
      active: 'active',
      offset: 60,
      elementNav: 'body',
      contentNav: '.hamburger',
      esc: true,
      activeNav: 'menu-open',
      elementTabs: '.docs-tabs',
      codeCopy: 'pre[lang]',
      code: 'code',
      codeAction: 'dblclick',
    }

    options ? this.opt = Object.assign(defaultOption, options) : this.opt = defaultOption
    this.elem = document.querySelector(this.opt.element)
    this.content = document.querySelector(this.opt.content)
    this.search = this.content.querySelectorAll(this.opt.section)
    this.elemNav = document.querySelector(this.opt.elementNav)
    this.contentNav = document.querySelectorAll(this.opt.contentNav)
    this.idSection = []
    this.elSection = []
  }

  init() {
    this._nav()
    this._generate()
    this._initCode()
  }
  
  _headingLevel() {
    let headLong = 6
    for (let i = 0; i < this.search.length; i++) {
      let headLevel = this._getHeadingLevel(this.search[i])
      headLong = (headLevel < headLong) ? headLevel : headLong
    }
    return headLong
  }

  _generateId(elem) {
    let el = this._slug(elem.getAttribute('data-name'))
    let re = new RegExp(el, 'g')
    let match = this.idSection.filter(x => x.match(re)).length
    return `docs-${match === 0 ? el : match === 1 ? `${el}-1` : `${el}-${match}`}` 
  }

  _slug(elem) {
    return elem.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  }

  _getHeadingLevel(elem) {
    switch (elem.getAttribute('data-heading').toLowerCase()) {
      case "h1":
        return 1
      case "h2":
        return 2
      case "h3":
        return 3
      case "h4":
        return 4
      case "h5":
        return 5
      case "h6":
        return 6
      default:
        return 1
    }
  }

  _generate() {
    let currentLevel = this._headingLevel() - 1
    let elem = document.createElement("div")
    let currentEl = elem
    let that = this
    
    this.search.forEach(data => {
      let secEl = data
      let headLevel = this._getHeadingLevel(secEl)
      let diff = headLevel - currentLevel
      let a = document.createElement("a")
      let name = secEl.getAttribute('data-name')

      if (!secEl.hasAttribute('no-heading')) {
        let cHead = document.createElement(secEl.getAttribute('data-heading'))
        let myHead = headLevel >= 4 ? 'h4' : ''
        cHead.textContent = `# ${name}`
        cHead.className = `title ${myHead}`
        secEl.prepend(cHead)
      }

      if (!secEl.id) secEl.id = this._generateId(secEl)
      this.idSection.push(secEl.id)
      this.elSection.push(data)

      a.href = `#${secEl.id}`
      a.className = 'ripple'
      a.textContent = name

      a.addEventListener('click', function (e) {
        e.preventDefault()
        that._disableNav()
        window.scrollTo({
          top: secEl.offsetTop - (that.opt.offset / 2),
          behavior: 'smooth'
        })
      })

      if (headLevel === 1) {
        let icon = document.createElement('span')
        let fa = document.createElement('i')
        icon.className = 'spy-icon'
        fa.className = data.getAttribute('data-icon') || this.opt.defaultIcon
        icon.append(fa)
        a.className += ' has-icon'
        a.prepend(icon)
      }

      if (diff > 0) {
        for (let j = 0; j < diff; j++) {
          let listEl = document.createElement("ul")
          let listItemEl = document.createElement("li")
          listEl.appendChild(listItemEl)
          currentEl.appendChild(listEl)
          currentEl = listItemEl
        }
        currentEl.appendChild(a)
      } else {

        for (let j = 0; j < -diff; j++) {
          currentEl = currentEl.parentNode.parentNode
        }

        let listItemEl = document.createElement("li")
        listItemEl.appendChild(a)
        currentEl.parentNode.appendChild(listItemEl)
        currentEl = listItemEl
      }
      currentLevel = headLevel
    })
    this.elem.appendChild(elem.firstChild)
    this._initScrollspy()
  }

  _initScrollspy() {
    this._scrollspy()
    window.addEventListener('scroll', () => {
      this._scrollspy()
      this._disableNav()
    });
  }

  _scrollspy() {
    let section = this._currentSec()
    let menu = this._currentMenu(section)

    if (menu) {
      this._removeActive({ ignore: menu })
      this._active(menu)
    }
  }

  _currentSec() {
    for (let i = 0; i < this.elSection.length; i++) {
      let sec = this.elSection[i]
      let start = sec.offsetTop
      let end = start + sec.offsetHeight
      let current = (document.documentElement.scrollTop || document.body.scrollTop) + this.opt.offset
      let view = current >= start && current < end
      if (view) return sec
    }
  }

  _currentMenu(sec) {
    if (!sec) return
    return this.elem.querySelector(`[href="#${sec.getAttribute('id')}"]`)
  }

  _active(menu) {
    let { active } = this.opt
    let isActive = menu.classList.contains(active)
    if (!isActive) active.trim().split(' ').forEach((x) => menu.classList.add(x))
  }

  _removeActive(opt = { ignore: null }) {
    let menu = this.elem.querySelectorAll(`a:not([href="${opt.ignore.getAttribute('href')}"])`)
    menu.forEach((item) => {
      let aClass = this.opt.active.trim().split(' ')
      aClass.forEach((x) => item.classList.remove(x))
    });
  }

  _nav() {
    this.contentNav.forEach(item => {
      item.addEventListener('click', e => {
        this.elemNav.classList.toggle(this.opt.activeNav);
        e.stopPropagation()
      })
    })
  }

  _disableNav() {
    if (!this.elemNav.classList.contains(this.opt.activeNav)) return
    return this.elemNav.classList.remove(this.opt.activeNav)
  }

  _escape() {
    if (!this.opt.esc) return
    let that = this
    document.onkeydown = function(e) {
      e = e || window.event
      let isEsc = 'key' in e ? (e.key === 'Escape' || e.key === 'Esc') : (e.keyCode === 27)
      if (isEsc && that.elemNav.classList.contains(that.opt.activeNav)) {
        that.elemNav.classList.toggle(that.opt.activeNav);
      }
    }
  }

  _initCode() {
    let element = this.content.querySelectorAll(this.opt.codeCopy)
    Array.from(element).map((el, i) => {
      el.querySelector(this.opt.code).classList.add(`language-${el.getAttribute('lang')}`)
    })
  }
}

class Demo {
  constructor(options) {
    let defaultOption = {
      table: 'thead[data-loop], tr[data-loop]',
      dropdown: '.dropdown:not(.hover)',
    }

    options ? this.options = Object.assign(defaultOption, options) : this.options = defaultOption
  }

  init() {
    this._tableLoop()
    this._dropdown()
  }

  _tableLoop() {
    let tableLoop = document.querySelectorAll(this.options.table)
    tableLoop.forEach((element, index) => {
      let loop = element.getAttribute('data-loop')
      for(let i = 0; i < loop; i++) {
        let th = document.createElement('td')
        th.textContent = `${index + 1}.${i + 1}`
        element.append(th)
      }
    })
  }

  _dropdown() {
    let dropdownElement = document.querySelectorAll(this.options.dropdown)
    dropdownElement.forEach(element => {
      element.addEventListener('click', () => {
        element.classList.toggle('active')
      })
    })
  }
}

new DOCS().init()
new Demo().init()