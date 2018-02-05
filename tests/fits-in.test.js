const fitsIn = require('../src/fits-in').default

describe('fitsIn function', () => {
  it('returns true when second rect contains first one', () => {
    const second = { top: 0, left: 0, width: 100, height: 100 }
    const first = { top: 10, left: 10, width: 50, height: 50 }

    expect(fitsIn(first, second)).toBe(true)
  })

  it('returns false when rects intersect', () => {
    const second = { top: 0, left: 0, width: 100, height: 100 }
    const first = { top: -40, left: -40, width: 50, height: 50 }

    expect(fitsIn(first, second)).toBe(false)
  })

  it('works for edge-to-edge cases', () => {
    const second = { top: 0, left: 0, width: 100, height: 100 }
    const first = { top: 0, left: 0, width: 100, height: 50 }

    expect(fitsIn(first, second)).toBe(true)
  })

  describe('when one of the params is falsey', () => {
    it('returns false', () => {
      expect(fitsIn(null, {})).toBe(false)
      expect(fitsIn(null)).toBe(false)
      expect(fitsIn({}, null)).toBe(false)
      expect(fitsIn({})).toBe(false)
    })
  })
})
