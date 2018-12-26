import Paguin from '../../src/Paguin'

document.addEventListener(
  'DOMContentLoaded',
  function() {
    const root = document.querySelector('.preview-box')
    const cutButton = document.querySelector('.button__cut')
    const nextButton = document.querySelector('.button__next')
    const previousButton = document.querySelector('.button__previous')
    const pageCounter = document.querySelector('.page-counter')

    let paginator

    // --
    // Handlers
    // --
    cutButton.onclick = function() {
      paginator = new Paguin(root, root, { ignoreElements: ['dont-hide-me'] })

      pageCounter.innerHTML = paginator.getTotalPagesCount()
    }

    nextButton.onclick = function() {
      paginator.nextPage()
    }

    previousButton.onclick = function() {
      paginator.previousPage()
    }
  },
  false
)
