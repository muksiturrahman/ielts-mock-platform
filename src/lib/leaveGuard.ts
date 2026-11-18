/**
 * Browser Back/Forward guard for a page that must not be left by accident (the exam).
 * Registered when this module is imported (before the router mounts), so it runs before the router's own
 * popstate listener and can stop it — a component's listener would be removed mid-event when the route unmounts.
 */
let onBlocked: (() => void) | null = null
let guardHash = ''

window.addEventListener('popstate', e => {
  if (!onBlocked || location.hash === guardHash) return
  e.stopImmediatePropagation() // the router never sees this navigation
  history.pushState(null, '', guardHash) // put the exam's URL back
  onBlocked()
})

/** Block Back/Forward while set; `blocked` runs instead (e.g. open the Leave dialog). Pass null to release. */
export function setLeaveGuard(blocked: (() => void) | null) {
  onBlocked = blocked
  guardHash = location.hash
}
