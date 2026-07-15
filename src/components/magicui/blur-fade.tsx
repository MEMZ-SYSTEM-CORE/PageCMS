"use client"

import { useEffect, useRef, useState, useMemo } from "react"

type MarginType = string | number

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  inView?: boolean
  inViewMargin?: MarginType
  blur?: string
}

// 单例共享 IntersectionObserver
let sharedObserver: IntersectionObserver | null = null
const callbacks = new Map<Element, () => void>()

function getObserver(margin: string): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target)
            cb?.()
            callbacks.delete(entry.target)
            sharedObserver?.unobserve(entry.target)
          }
        }
      },
      { rootMargin: margin, threshold: 0 }
    )
  }
  return sharedObserver
}

export function BlurFade({
  children,
  className,
  duration = 0.5,
  delay = 0,
  offset = 12,
  direction = "down",
  inView = false,
  inViewMargin = "0px",
  blur = "0px",
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(!inView)
  const styleId = useMemo(() => {
    // 生成唯一类名避免冲突
    return `bf-${Math.random().toString(36).slice(2, 8)}`
  }, [])

  useEffect(() => {
    if (!inView || !ref.current) return

    const el = ref.current
    const onShow = () => setVisible(true)
    callbacks.set(el, onShow)
    getObserver(String(inViewMargin)).observe(el)

    // 如果已经可见了就直接触发
    if (el.getBoundingClientRect().top < window.innerHeight) {
      onShow()
    }

    return () => {
      callbacks.delete(el)
      sharedObserver?.unobserve(el)
    }
  }, [inView, inViewMargin])

  const axis = direction === "left" || direction === "right" ? "X" : "Y"
  const dir = direction === "right" || direction === "down" ? 1 : -1
  const translateVal = visible ? "0" : `${dir * offset}px`

  return (
    <div
      ref={ref}
      className={`${styleId} ${className || ""}`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <style>{`
        .${styleId} {
          transition: opacity ${duration}s ease-out ${delay}s,
                      transform ${duration}s ease-out ${delay}s,
                      filter ${duration}s ease-out ${delay}s;
          transform: translate${axis}(${translateVal});
          filter: blur(${visible ? "0" : blur});
        }
      `}</style>
      {children}
    </div>
  )
}
