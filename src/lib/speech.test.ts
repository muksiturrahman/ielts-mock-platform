import { describe, expect, it } from 'vitest'
import { computeMetrics } from './speech'
import type { SpeakingAnswer } from './types'

const ans = (transcript: string): SpeakingAnswer => ({ part: 1, question: 'q', transcript, durationSec: 10, pauses: [], startedAt: 0 })

describe('computeMetrics fillers', () => {
  it('does not count "like" as a filler', () => {
    expect(computeMetrics([ans('I like reading and I would like to travel')]).fillerCount).toBe(0)
  })
  it('counts real fillers', () => {
    expect(computeMetrics([ans('um I think uh you know it is fine')]).fillers).toEqual({ um: 1, uh: 1, 'you know': 1 })
  })
})
