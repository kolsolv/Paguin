document.addEventListener('DOMContentLoaded', function() {

  // --
  // Paginator
  // --

  // Global arrays
  let hiddenNodes = []
  let innerNodes = []
  const root = document.querySelector('.preview-box')
  const cutButton = document.querySelector('.button__cut')
  const nextButton = document.querySelector('.button__next')
  const previousButton = document.querySelector('.button__previous')
  let states = []
  let currentPage = 0

  function fitsIn(source, dest) {
    return (
      (source.left >= dest.left) &&
      (source.left + source.width <= dest.left + dest.width) &&
      (source.top >= dest.top) &&
      (source.top + source.height <= dest.top + dest.height)
    )
  }

  function checkVisible(node, rootRect) {
    let sum = 0
    const children = node.childNodes
    const ELEMENT_NODE = 1

    if (node.style) {
      if (node.style.breakInside === 'avoid') {
        const nodeRect = node.getBoundingClientRect()
        if (!fitsIn(nodeRect, rootRect)) {
          hiddenNodes.push(node)
          return 0
        } else {
          innerNodes.push(node)
          return 1
        }
      }
    }

    if (node.nodeType === 3) {
      if (node.wholeText.trim() !== '') {
        const parentNodeRect = node.parentNode.getBoundingClientRect()
        if (!fitsIn(parentNodeRect, rootRect)) {
          hiddenNodes.push(node.parentNode)
          return 0
        } else {
          innerNodes.push(node.parentNode)
          return 1
        }
      } else {
        return 1
      }
    }

    if (node.nodeType === 1 && children.length === 0) {
      if(node.tagName === 'BR') {
        innerNodes.push(node)
        return 1
      }

      if (!fitsIn(node.getBoundingClientRect(), rootRect)) {
        hiddenNodes.push(node)
        return 0
      } else {
        innerNodes.push(node)
        return 1
      }
    }


    for (var i = 0; i < children.length; ++i) {
      const res = checkVisible(children[i], rootRect)
      sum += res
    }

    if (sum === children.length && children.length !== 0) {
      innerNodes.push(node)

      return 1
    }
    return 0
  }

  function checkFinalElementVisible(node, rootRect) {
    const nodeRect = node.getBoundingClientRect()
    if (node.className === 'icon--location') {
      console.log(nodeRect)
    }
    return fitsIn(nodeRect, rootRect)
  }

  function hideNodes() {
    hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = 'none'
    })
  }

  function showNodes() {
    hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = ''
    })

    hiddenNodes = []
  }

  function nextPage() {
    const rootRect = root.getBoundingClientRect()

    // innerNodes of previous page
    innerNodes.forEach(function(item, i, arr) {
      item.style.display = 'none'
    })
    innerNodes = []

    // hide hiddenNodes of previous page if they !fits, otherwice add to new innerNodes
    let hiddenNodesTemp = []
    hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = ''
      if (!checkFinalElementVisible(item, rootRect)) {
        hiddenNodesTemp.push(item)
        item.style.display = 'none'
      } else {
        innerNodes.push(item)
      }
    })

    hiddenNodes = hiddenNodesTemp.slice()
    states.push({visible: innerNodes.slice(), hidden: hiddenNodes.slice()})
    ++currentPage
  }

  function previousPage() {
    if (!currentPage) return

    --currentPage
    // load hiddenNodes and innerNodes of the current page
    hiddenNodes = states[currentPage].hidden
    innerNodes = states[currentPage].visible

    hiddenNodes.forEach(function(item, i, arr) {
      item.style.display = 'none'
    })

    innerNodes.forEach(function(item, i, arr) {
      item.style.display = ''
    })
  }

  // --
  // Handlers
  // --
  cutButton.onclick = function() {
    const rootRect = root.getBoundingClientRect()
    checkVisible(root, rootRect)
    hideNodes()
    states.push({visible: innerNodes.slice(), hidden: hiddenNodes.slice()})
  }

  nextButton.onclick = function() {
    nextPage()
  }

  previousButton.onclick = function() {
    previousPage()
  }
}, false)
//
