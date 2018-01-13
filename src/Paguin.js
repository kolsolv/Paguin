class Paguin {
  constructor(rootElement, containerElement, options) {
    this.hiddenNodes = []
    this.innerNodes = []
    this.root = rootElement //.cloneNode(true)
    this.container = containerElement
    this.states = []
    this.currentPage = 0

    this.paginate()
  }

  paginate() {
    const containerRect = this.container.getBoundingClientRect()
    this.checkVisible(this.root, containerRect)
    this.hideNodes()
    this.states.push({
      visible: this.innerNodes.slice(),
      hidden: this.hiddenNodes.slice()
    })
  }

  // --
  // Main parser
  // --
  checkVisible(node, containerRect) {
    let sum = 0
    const children = node.childNodes

    if (node.style) {
      if (node.style.breakInside === 'avoid') {
        const nodeRect = node.getBoundingClientRect()
        if (!this.fitsIn(nodeRect, containerRect)) {
          this.hiddenNodes.push(node)
          return 0
        } else {
          this.innerNodes.push(node)
          return 1
        }
      }
    }

    if (node.nodeType === 3) {
      if (node.wholeText.trim() !== '') {
        const parentNodeRect = node.parentNode.getBoundingClientRect()
        if (!this.fitsIn(parentNodeRect, containerRect)) {
          this.hiddenNodes.push(node.parentNode)
          return 0
        } else {
          this.innerNodes.push(node.parentNode)
          return 1
        }
      } else {
        return 1
      }
    }

    if (node.nodeType === 1 && children.length === 0) {
      if (node.tagName === 'BR') {
        this.innerNodes.push(node)
        return 1
      }

      if (!this.fitsIn(node.getBoundingClientRect(), containerRect)) {
        this.hiddenNodes.push(node)
        return 0
      } else {
        this.innerNodes.push(node)
        return 1
      }
    }

    for (var i = 0; i < children.length; ++i) {
      const res = this.checkVisible(children[i], containerRect)
      sum += res
    }

    if (sum === children.length && children.length !== 0) {
      this.innerNodes.push(node)

      return 1
    }
    return 0
  }

  fitsIn(source, dest) {
    return (
      source.left >= dest.left &&
      source.left + source.width <= dest.left + dest.width &&
      source.top >= dest.top &&
      source.top + source.height <= dest.top + dest.height
    )
  }

  checkFinalElementVisible(node, containerRect) {
    const nodeRect = node.getBoundingClientRect()
    return this.fitsIn(nodeRect, containerRect)
  }

  hideNodes() {
    this.hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = 'none'
    })
  }

  showNodes() {
    this.hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = ''
    })

    this.hiddenNodes = []
  }

  nextPage() {
    const containerRect = this.container.getBoundingClientRect()

    // innerNodes of previous page
    this.innerNodes.forEach(function(item, i, arr) {
      item.style.display = 'none'
    })
    this.innerNodes = []

    // hide hiddenNodes of previous page if they !fits,
    // otherwice add to new innerNodes
    let hiddenNodesTemp = []
    this.hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = ''
      if (!this.checkFinalElementVisible(item, containerRect)) {
        hiddenNodesTemp.push(item)
        item.style.display = 'none'
      } else {
        this.innerNodes.push(item)
      }
    }, this)

    this.hiddenNodes = hiddenNodesTemp.slice()
    this.states.push({
      visible: this.innerNodes.slice(),
      hidden: this.hiddenNodes.slice()
    })
    ++this.currentPage
  }

  previousPage() {
    if (!this.currentPage) return

    --this.currentPage
    // load hiddenNodes and innerNodes of the current page
    this.hiddenNodes = this.states[this.currentPage].hidden
    this.innerNodes = this.states[this.currentPage].visible

    this.hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = 'none'
    })

    this.innerNodes.forEach(function(item, i, arr) {
      item.style.display = ''
    })
  }

  getCurrentPage() {
    return this.root
  }
}

export default Paguin
