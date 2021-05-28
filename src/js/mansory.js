export default class Mansory {
  constructor(options) {
    let defaultOptions = {
      element: '.achivement-sec .card',
      classSection: 'achivement-sec',
      isImage: true,
      content: '.content',
      image: '.image',
    }

    options ? this.options = Object.assign(defaultOptions, options) : this.options = defaultOptions
  }

  init() {
    document.addEventListener('DOMContentLoaded', this._resizeAllGridItems())
    document.addEventListener("resize", this._resizeAllGridItems())
  }

  _resizeAllGridItems() {
    let getElement = document.querySelectorAll(this.options.element);
    getElement.forEach(element => this._resizeGridItem(element))
  }

  _getRowHeight(grid) {
    return parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'))
  }

  _getRowGap(grid) {
    return parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'))
  }

  _getImageHeight(element) {
    if (!this.options.isImage) return
    if (element.querySelector(this.options.image) === null) return 10
    return element.querySelector(this.options.image).getBoundingClientRect().height + 10
  }

  _rowSpan(element) {
    let grid = document.getElementsByClassName(this.options.classSection)[0]
    let rowHeight = this._getRowHeight(grid)
    let rowGap = this._getRowGap(grid)
    let image = this._getImageHeight(element)
    return Math.ceil(Math.floor((element.querySelector(this.options.content).getBoundingClientRect().height + rowGap + image)) / (rowHeight + rowGap));
  }

  _resizeGridItem(element) {
    element.style.gridRowEnd = `span ${this._rowSpan(element)}`;
  }
}