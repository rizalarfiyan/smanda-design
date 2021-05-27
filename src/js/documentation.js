{
  function TOC(options) {
    if (typeof options !== 'object') {
      throw new TypeError('Opsi harus dengan object!');
    }

    devOpt = {
      element: '#TOCDocs',
      content: '#content',
      section: 'section',
      icon: true,
      active: "active",
      offset: 0,
    }

    this.opt = Object.assign({}, devOpt, options)

    this.elem = document.querySelector(this.opt.element)
    this.target = document.querySelector(this.opt.content)
    this.search = this.target.querySelectorAll(this.opt.section)
    this.idSection = new Array()
    this.elSection = new Array()
    this._generate()
  }
  
  TOC.prototype = {
    _headingLevel() {
      let headLong = 6
      for (let i = 0; i < this.search.length; i++) {
        let headLevel = this._getHeadingLevel(this.search[i])
        headLong = (headLevel < headLong) ? headLevel : headLong
      }
      return headLong
    },

    _generateId(elem) {
      let el = this._slug(elem.getAttribute('data-name'))
      let re = new RegExp(el, 'g')
      let match = this.idSection.filter(x => x.match(re)).length
      return `docs-${match === 0 ? el : match === 1 ? `${el}-1` : `${el}-${match}`}` 
    },

    _slug(elem) {
      return elem.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    },

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
    },

    _generate() {
      let currentLevel = this._headingLevel() - 1
      let elem = document.createElement("div")
      let currentEl = elem
      
      this.search.forEach(data => {
        let secEl = data
        let headLevel = this._getHeadingLevel(secEl)
        let diff = headLevel - currentLevel
        let a = document.createElement("a")

        if (!secEl.id) secEl.id = this._generateId(secEl)
        this.idSection.push(secEl.id)
        this.elSection.push(data)

        a.href = `#${secEl.id}`
        a.textContent = secEl.getAttribute('data-name')

        a.addEventListener('click', function (e) {
          e.preventDefault()
          window.scrollTo({
            top: secEl.offsetTop - 10,
            behavior: 'smooth'
          })
        })

        if (data.hasAttribute('data-icon') && headLevel === 1) {
          let icon = document.createElement('span')
          let fa = document.createElement('i')
          icon.className = 'icon'
          fa.className = data.getAttribute('data-icon')
          icon.append(fa)
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
    },

    _initScrollspy() {
      this._scrollspy()
      window.addEventListener('scroll', () => {
        this._scrollspy();
      });
    },

    _scrollspy() {
      let sec = this._currentSec();
      let menu = this._currentMenu(sec);

      if (menu) {
        this._removeActive({ ignore: menu });
        this._active(menu);
      }
    },

    _currentSec() {
      for (let i = 0; i < this.elSection.length; i++) {
        let sec = this.elSection[i]
        let start = sec.offsetTop
        let end = start + sec.offsetHeight
        let current = (document.documentElement.scrollTop || document.body.scrollTop) + this.opt.offset
        let view = current >= start && current < end
        if (view) return sec
      }
    },

    _currentMenu(sec) {
      if (!sec) return
      return this.elem.querySelector(`[href="#${sec.getAttribute('id')}"]`)
    },

    _active(menu) {
      let { active } = this.opt
      let isActive = menu.classList.contains(active)
      if (!isActive) active.trim().split(' ').forEach((x) => menu.classList.add(x))
    },

    _removeActive(opt = { ignore: null }) {
      let menu = this.elem.querySelectorAll(`a:not([href="${opt.ignore.getAttribute('href')}"])`)
      menu.forEach((item) => {
        let aClass = this.opt.active.trim().split(' ')
        aClass.forEach((x) => item.classList.remove(x))
      });
    }
  }
}

new TOC({ offset: 60 })
