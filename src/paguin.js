import fitsIn from './fits-in'

const RECURSION_CALLS_LIMIT = 100000

class Paguin {
  constructor(rootElement, containerElement, options) {
    this.recursiveCalls = 0
    this.initPaginationState()
    this.root = rootElement
    this.shadowRoot = rootElement.cloneNode(true)
    this.container = containerElement
    this.ignoreElements = options.ignoreElements.length > 0
    this.ignoredList = options.ignoreElements

    this.paginate()
  }

  initPaginationState() {
    this.hiddenNodes = []
    this.innerNodes = []
    this.previousHiddenNodes = []
    this.states = []
    this.completed = false
    this.currentPage = 0
    this.totalPages = 1
  }

  paginate() {
    const containerRect = this.container.getBoundingClientRect()
    this.checkVisible(this.root, containerRect)
    this.hideNodes()
    this.states.push({
      visible: this.innerNodes.slice(),
      hidden: this.hiddenNodes.slice(),
      previousHidden: []
    })

    if (!this.hiddenNodes.length) {
      this.completed = true
      this.totalPages = 1
    }

    while (!(this.completed && this.currentPage === this.totalPages - 1)) {
      this.nextPage()
    }
    this.showPage(0)
  }

  // --
  // Main parser
  // --
  checkVisible(node, containerRect) {
    this.recursiveCalls++
    if (this.recursiveCalls > RECURSION_CALLS_LIMIT) return
    let sum = 0
    const children = node.childNodes

    if (this.states.length) {
      const previousState = this.states[this.currentPage - 1]

      if (previousState.visible.indexOf(node) !== -1) {
        return 1
      }
    }

    if (node.nodeType === 3) {
      if (
        this.ignoreElements &&
        this.checkClassNameContains(this.ignoredList, node.parentNode.className)
      ) {
        return 1
      }

      if (node.wholeText.trim() !== '') {
        const parentNodeRect = node.parentNode.getBoundingClientRect()
        if (!fitsIn(parentNodeRect, containerRect)) {
          if (this.hiddenNodes.indexOf(node.parentNode) === -1) {
            this.hiddenNodes.push(node.parentNode)
          }
          return 0
        } else {
          if (this.innerNodes.indexOf(node.parentNode) === -1) {
            this.innerNodes.push(node.parentNode)
          }
          return 1
        }
      } else {
        return 1
      }
    }

    if (node.nodeType === 1) {
      if (this.getStyleValue(node, 'breakInside') === 'avoid') {
        if (
          this.ignoreElements &&
          this.checkClassNameContains(this.ignoredList, node.className)
        ) {
          return 0
        }

        const nodeRect = node.getBoundingClientRect()

        if (!fitsIn(nodeRect, containerRect)) {
          node.style.pageBreakInside = 'auto'
          this.checkVisible(node, containerRect)
        } else {
          this.innerNodes.push(node)
          return 1
        }
      }

      if (this.getStyleValue(node, 'display') === 'inline') {
        const parentNodeRect = node.parentNode.getBoundingClientRect()
        if (!fitsIn(parentNodeRect, containerRect)) return 0
        this.innerNodes.push(node)
        return 1
      }

      if (children.length === 0) {
        if (
          this.ignoreElements &&
          this.checkClassNameContains(this.ignoredList, node.className)
        ) {
          return 0
        }

        if (!fitsIn(node.getBoundingClientRect(), containerRect)) {
          this.hiddenNodes.push(node)
          return 0
        } else {
          this.innerNodes.push(node)
          return 1
        }
      }
    }

    for (var i = 0; i < children.length; ++i) {
      const res = this.checkVisible(children[i], containerRect)
      sum += res
    }

    if (sum === children.length && children.length !== 0) {
      if (
        this.ignoreElements &&
        this.checkClassNameContains(this.ignoredList, node.className)
      ) {
        return 0
      }

      if (this.innerNodes.indexOf(node) === -1) {
        this.innerNodes.push(node)
      }
      return 1
    }
    return 0
  }

  getStyleValue(node, field) {
    return window.getComputedStyle(node)[field]
  }

  checkClassNameContains(classes, className) {
    const splitedClasses = className.split(' ')
    return splitedClasses.some(elt => {
      return classes.indexOf(elt) !== -1
    })
  }

  checkFinalElementVisible(node, containerRect) {
    const nodeRect = node.getBoundingClientRect()
    return fitsIn(nodeRect, containerRect)
  }

  hideNodes() {
    this.hiddenNodes.forEach(function(item) {
      item.style.display = 'none'
    })
  }

  nextPage() {
    if (this.completed && this.currentPage === this.totalPages - 1) return null

    // if next page is already ready
    if (this.currentPage < this.states.length - 1) {
      ++this.currentPage
      this.showPage(this.currentPage)
      return
    }

    ++this.currentPage

    const containerRect = this.container.getBoundingClientRect()

    this.hiddenNodes.forEach(function(item) {
      item.style.display = ''
    })

    // all nodes before this page
    this.previousHiddenNodes.forEach(function(item) {
      item.style.display = 'none'
    }, this)

    // innerNodes of previous page
    this.innerNodes.forEach(function(item) {
      item.style.display = 'none'
      if (this.previousHiddenNodes.indexOf(item) === -1) {
        this.previousHiddenNodes.push(item)
      }
    }, this)

    this.hiddenNodes = []
    this.innerNodes = []

    this.checkVisible(this.root, containerRect)
    this.hideNodes()

    this.states.push({
      visible: this.innerNodes.slice(),
      hidden: this.hiddenNodes.slice(),
      previousHidden: this.previousHiddenNodes.slice()
    })

    if (!this.completed) this.totalPages++

    const isLastPageNow = this.hiddenNodes.every(
      item => this.previousHiddenNodes.indexOf(item) !== -1
    )

    if (isLastPageNow) {
      this.completed = true
    }
  }

  previousPage() {
    if (!this.currentPage) return

    --this.currentPage
    this.showPage(this.currentPage)
  }

  showPage(pageNumber) {
    this.hiddenNodes = this.states[pageNumber].hidden.slice()
    this.innerNodes = this.states[pageNumber].visible.slice()
    this.previousHiddenNodes = this.states[pageNumber].previousHidden.slice()

    this.innerNodes.forEach(function(item) {
      item.style.display = ''
    })

    this.hiddenNodes.forEach(function(item) {
      item.style.display = 'none'
    })

    this.previousHiddenNodes.forEach(function(item) {
      item.style.display = 'none'
    })
    this.currentPage = pageNumber
  }

  getCurrentPage() {
    return this.root
  }

  getCurrentPageNumber() {
    return this.currentPage
  }

  isComplete() {
    return this.completed
  }

  getTotalPagesCount() {
    if (this.completed) return this.totalPages
    else return null
  }
}

export default Paguin
