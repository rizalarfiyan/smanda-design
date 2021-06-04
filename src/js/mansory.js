export default class Mansory {
  constructor(options) {
    let defaultOptions = {
      element: '.mansory',
    }

    options ? this.options = Object.assign(defaultOptions, options) : this.options = defaultOptions
    this.element = document.querySelector(this.options.element)
  }

  init() {
    document.addEventListener('onload', this._resizeAllGridItems())
    document.addEventListener("resize", this._resizeAllGridItems())
  }

  _resizeAllGridItems() {
    let getElement = this.element.querySelectorAll(':scope > *');
    getElement.forEach(elem => {
      elem.style.gridRowEnd = `span ${this._rowSpan(elem)}`;
    })
  }

  _getRowHeight(grid) {
    return parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'))
  }

  _getRowGap(grid) {
    return parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'))
  }

  _getAllHeight(elem) {
    let getStyle = elem.currentStyle || window.getComputedStyle(elem)
    let marginY = parseInt(getStyle.marginTop, 10) + parseInt(getStyle.marginBottom, 10)
    let height = elem.getBoundingClientRect().height
    return Math.floor(marginY + height)
  }

  _getHeightAll(elem) {
    let getAllChild = elem.querySelectorAll(':scope > *')
    let getHeight = Array.from(getAllChild).map(elem => this._getAllHeight(elem))
    return Math.round(getHeight.reduce((a, b) => a + b))
  }
  
  _rowSpan(elem) {
    let rowHeight = this._getRowHeight(this.element)
    let rowGap = this._getRowGap(this.element)
    let totalHeight = this._getHeightAll(elem)
    return Math.ceil(Math.floor((totalHeight + rowGap + 20)) / (rowHeight + rowGap))
  }
}