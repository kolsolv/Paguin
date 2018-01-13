import Paguin from '../../src/Paguin'

document.addEventListener('DOMContentLoaded', function() {
  const root = document.querySelector('.preview-box')
  const cutButton = document.querySelector('.button__cut')
  const nextButton = document.querySelector('.button__next')
  const previousButton = document.querySelector('.button__previous')

  const paginator = new Paguin(root, root, {})

  // --
  // Handlers
  // --
  cutButton.onclick = function() {
    const currentPage = paginator.getCurrentPage()
    // root.innerHTML = currentPage.innerHTML
  }

  nextButton.onclick = function() {
    paginator.nextPage()
  }

  previousButton.onclick = function() {
    paginator.previousPage()
  }
}, false)
