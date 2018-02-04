// Checks if one rect completely fits in another one
function fitsIn(source, dest) {
  return (
    source.left >= dest.left &&
    source.left + source.width <= dest.left + dest.width &&
    source.top >= dest.top &&
    source.top + source.height <= dest.top + dest.height
  )
}

export default fitsIn
