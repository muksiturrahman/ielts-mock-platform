import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

// public/sw.js isn't bundled or type-checked: a syntax slip would silently disable offline mode.
it('service worker parses', () => {
  expect(() => new Function(readFileSync('public/sw.js', 'utf8'))).not.toThrow()
})
