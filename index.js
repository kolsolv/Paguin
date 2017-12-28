document.addEventListener('DOMContentLoaded', function() {

  // --
  // Paginator
  // --

  // Global arrays
  let nodesForHiding = []
  let innerNodes = []
  const root = document.querySelector('.body--preview')

  function fitsIn(source, dest) {
    return (
      (source.left >= dest.left) &&
      (source.left + source.width <= dest.left + dest.width) &&
      (source.top >= dest.top) &&
      (source.top + source.height <= dest.top + dest.height)
    )
  }

  function guidGenerator() {
    const S4 = function() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())
  }

  function checkVisible(node, rootRect) {
    const children = node.childNodes
    const ELEMENT_NODE = 1

    if (node.nodeType === 3 && node.wholeText.trim() != '') {
      node.parentNode.id = guidGenerator()
      const parentNodeRect = node.parentNode.getBoundingClientRect()
      if (!fitsIn(parentNodeRect, rootRect)) {
        nodesForHiding.push(node.parentNode)
      } else {
        innerNodes.push(node.parentNode)
      }
    }

    if (node.nodeType === 1 && children.length === 0) {
      node.id = guidGenerator()
      if (!fitsIn(node.getBoundingClientRect(), rootRect)) {
        nodesForHiding.push(node)
      } else {
        innerNodes.push(node)
      }
    }

    for (var i = 0; i < children.length; ++i) {
      checkVisible(children[i], rootRect)
    }
  }

  function hideNodes() {
    nodesForHiding.forEach(function(item, i, arr) {
      item.style.display = 'none'
    })
  }

  function showNodes() {
    nodesForHiding.forEach(function(item, i, arr) {
      item.style.display = 'initial'
    })

    nodesForHiding = []
  }

  function showAllPage(node) {
    const children = node.childNodes

    const hiddenNode = nodesForHiding.findIndex(function(item, i, arr) {
        return item.id === node.id
      }
    )

    if (hiddenNode !== -1) {
      node.style.display = 'initial'
    }

    const innderNode = innerNodes.findIndex(function(item, i, arr) {
        return item.id === node.id
      }
    )

    if (innderNode !== -1) {
      node.style.display = 'none'
    }

    for (var i = 0; i < children.length; ++i) {
      showAllPage(children[i])
    }
  }

  function createPages() {
    let pagesList = document.querySelectorAll('.body--preview')
    if (pagesList.length > 1) {
      pagesList[1].parentNode.removeChild(pagesList[1]);
    }

    const newPage = root.cloneNode(true)
    showAllPage(newPage)
    root.appendChild(newPage)
  }

  // checkVisible(root)

  // --
  // Make container resizable
  // --
  const container = document.querySelector('.body--preview')

  const resizer = document.createElement('div')
  resizer.className = 'resizer'
  container.appendChild(resizer)
  resizer.addEventListener('mousedown', initDrag, false)


  let startX, startY, startWidth, startHeight

  function initDrag(e) {
     startX = e.clientX
     startY = e.clientY
     startWidth = parseInt(document.defaultView.getComputedStyle(container).width, 10)
     startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10)
     document.documentElement.addEventListener('mousemove', doDrag, false)
     document.documentElement.addEventListener('mouseup', stopDrag, false)
  }

  function doDrag(e) {
     container.style.height = (startHeight + e.clientY - startY) + 'px'
  }

  function stopDrag(e) {
      document.documentElement.removeEventListener('mousemove', doDrag, false)
      document.documentElement.removeEventListener('mouseup', stopDrag, false)

      const rootRect = root.getBoundingClientRect()
      showNodes()
      checkVisible(root, rootRect)
      hideNodes()
      createPages()
  }
}, false)
