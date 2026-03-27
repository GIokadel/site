"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const words = [
  { text: "clinical research.", href: "/solutions/life-sciences-research" },
  { text: "life sciences.", href: "/solutions/life-sciences-research" },
  { text: "medical practices.", href: "/solutions/medical-practices" },
  { text: "diagnostic labs.", href: "/solutions/diagnostic-labs" },
  { text: "medical groups.", href: "/solutions/medical-groups" },
  { text: "hospital systems.", href: "/solutions/hospital-systems" },
]

function ShimmerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center",
        "overflow-hidden rounded-full border border-[#0D7F8C] bg-[#0D7F8C]",
        "px-8 py-3.5 text-base font-semibold text-white",
        "transition-colors hover:bg-[#0a6570] [container-type:inline-size]"
      )}
    >
      {/* Shimmer overlay */}
      <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]" />
      <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_225deg,rgba(0,0,0,0)_0deg,rgba(255,255,255,0.3)_90deg,rgba(0,0,0,0)_90deg)]" />
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <a
            href="/healthcare-automation"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm text-neutral-600/70"
          >
            <span
              className="animate-shiny-text bg-clip-text"
              style={{ "--shiny-width": "100px" } as React.CSSProperties}
            >
              AI-powered healthcare automation
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* H1 with cycling words */}
        <h1 className="text-[34px] sm:text-5xl lg:text-7xl font-bold text-black tracking-tight text-center leading-[1.1] mb-6">
          AI &amp; Automation for
          <br />
          <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
            <a
              key={currentIndex}
              href={words[currentIndex].href}
              className={cn(
                "text-[#0D7F8C] hover:text-[#0a6570] transition-colors",
                "animate-[fade-up_0.4s_ease_both]"
              )}
            >
              {words[currentIndex].text}
            </a>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl lg:text-2xl text-gray-400 text-center max-w-3xl mx-auto leading-relaxed font-light mb-10">
          Find expensive workflows. Build AI-powered automations. Run them for you — with compliance-first engineering.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary shimmer button */}
          <a href="/consultation" className="w-full sm:w-auto">
            <ShimmerButton>Book AI Assessment</ShimmerButton>
          </a>
          {/* Secondary */}
          <a
            href="/healthcare-automation"
            className={cn(
              "w-full sm:w-auto inline-flex items-center justify-center gap-2",
              "rounded-full border border-gray-200 px-8 py-3.5",
              "text-base font-semibold text-gray-900",
              "hover:bg-gray-50 transition-colors"
            )}
          >
            See AI Workflows <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
