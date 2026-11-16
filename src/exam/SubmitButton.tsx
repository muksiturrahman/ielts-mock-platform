import { AnimatePresence, motion } from 'motion/react'
import { Send } from 'lucide-react'
import { useState } from 'react'

/** Finish button with the "you have N unanswered questions" check. */
export function SubmitButton({ unanswered, onSubmit, label = 'Submit' }: { unanswered: number; onSubmit: () => void; label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-[#1d4ed8] px-4 py-2 text-sm font-semibold text-white shadow transition hover:brightness-110">
        <Send size={15} /> {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.92, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-2xl">
              <h2 className="mb-2 text-xl font-bold">Submit your answers?</h2>
              <p className="mb-5 text-sm text-slate-600">
                {unanswered > 0 ? <>You have <b className="text-rose-600">{unanswered} unanswered question{unanswered === 1 ? '' : 's'}</b>. </> : 'All questions are answered. '}
                You can't change your answers after submitting.
              </p>
              <div className="flex justify-end gap-2">
                <button className="rounded-md border px-4 py-2 text-sm" onClick={() => setOpen(false)}>Review answers</button>
                <button className="rounded-md bg-[#1d4ed8] px-4 py-2 text-sm font-semibold text-white" onClick={() => { setOpen(false); onSubmit() }}>Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
