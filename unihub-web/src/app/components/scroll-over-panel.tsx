"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

export function ScrollOverPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  })

  const y = useTransform(scrollYProgress, [0, 0.35], [12, 0])
  const boxShadow = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5],
    [
      "0 -4px 16px -4px rgba(0,0,0,0.06)",
      "0 -12px 32px -8px rgba(0,0,0,0.1)",
      "0 -16px 48px -12px rgba(0,0,0,0.08)",
    ]
  )

  return (
    <motion.div ref={ref} className={className} style={{ y, boxShadow }}>
      {children}
    </motion.div>
  )
}
