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
      menuTabs: '.tabs-menu',
      tabsSearch: 'pre',
      codeCopy: 'code',
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
    this._initTabs()
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

      if (secEl.getAttribute('no-heading')) {
        let cHead = document.createElement(secEl.getAttribute('data-heading'))
        cHead.textContent = name
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
          top: secEl.offsetTop - 10,
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

  _initTabs() {
    let elementTabs = this.content.querySelectorAll(this.opt.elementTabs)
    elementTabs.forEach(element => this._tabs(element))
  }

  _removeTabs(element) {
    let button = element.querySelectorAll('button[data-tab]')
    let tabsSearch = element.querySelectorAll(this.opt.tabsSearch)
    Array.from([...button, ...tabsSearch]).map(element => {
      if (element.classList.contains('active')) {
        element.classList.remove('active')
      }
    })
  }

  _tabsClick(allElement, element, button) {
    this._removeTabs(allElement)
    element.classList.add('active')
    button.classList.add('active')
  }

  _tabsGenerateButton(allElement, element) {
    return Array.from(element).map((elem, i) => {
      let button = document.createElement('button')
      button.textContent = elem.getAttribute('lang')
      button.setAttribute(['data-tab'], i)
      button.addEventListener('click', () => this._tabsClick(allElement, elem, button))
      if (i === 0) {
        elem.classList.add('active')
        button.className = 'active'
      }
      return button
    })
  }

  _tabsContent(element) {
    return Array.from(element).map(elem => {
      elem.classList.add('highlighter')
      return elem
    })
  }

  _tabsElement() {
    let tabButton = document.createElement('div')
    tabButton.className = this.opt.classButtonTab
    return tabButton.outerHTML
  }

  _tabs(element) {
    let pre = element.querySelectorAll(this.opt.tabsSearch)
    let menuTabs = element.querySelector(this.opt.menuTabs)
    menuTabs.append(...this._tabsGenerateButton(element, pre))
  }

  _initCode() {
    let element = this.content.querySelectorAll(this.opt.codeCopy)
    Array.from(element).map(el => {
      hljs.highlightBlock(el);
      this._copyAction(el)
    })
  }

  _copyAction(element) {
    element.addEventListener(this.opt.codeAction, (e) => {
      let target = e.target || e.srcElement;
      let range, selection
      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(target);
        range.select();
        document.execCommand('copy')
      } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy')
      }
      e.stopPropagation()
    })
  }
}

new DOCS().init()
