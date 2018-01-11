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
    const children = node.childNodes
    const ELEMENT_NODE = 1

    if (node.style) {
      if (node.style.breakInside === 'avoid') {
        const nodeRect = node.getBoundingClientRect()
        if (!fitsIn(nodeRect, rootRect)) {
          hiddenNodes.push(node)
        } else {
          innerNodes.push(node)
        }
        return
      }
    }

    if (node.nodeType === 3 && node.wholeText.trim() != '') {
      const parentNodeRect = node.parentNode.getBoundingClientRect()
      if (!fitsIn(parentNodeRect, rootRect)) {
        hiddenNodes.push(node.parentNode)
      } else {
        innerNodes.push(node.parentNode)
      }
    }

    if (node.nodeType === 1 && children.length === 0) {
      if (!fitsIn(node.getBoundingClientRect(), rootRect)) {
        hiddenNodes.push(node)
      } else {
        innerNodes.push(node)
      }
    }

    for (var i = 0; i < children.length; ++i) {
      checkVisible(children[i], rootRect)
    }
  }

  function checkFinalElementVisible(node, rootRect) {
    const nodeRect = node.getBoundingClientRect()
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
    console.log(hiddenNodes)
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
