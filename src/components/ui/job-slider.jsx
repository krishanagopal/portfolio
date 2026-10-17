import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const projects = [
  {
    title: "GitAnalyzer",
    intro: "Developer analytics engine offering deep telemetry insights into GitHub profiles, repositories, and coding activity.",
    demoUrl: "https://gitanalzer-wjtj.vercel.app/",
    githubUrl: "https://github.com/krishanagopal/gitanalzer",
    image: "https://cdn.21st.dev/assets/mirror/63/633172958fbafeb8ecfd70d783e2a37d002439c088458abd29061ba84389f0b6.png"
  },
  {
    title: "Evident",
    intro: "Unified professional identity platform aggregating resumes, code repositories, and interactive walkthroughs.",
    demoUrl: "https://evident.krishanagopal.sbs/",
    githubUrl: "https://github.com/krishanagopal/hire.me",
    image: "https://cdn.21st.dev/assets/mirror/63/633172958fbafeb8ecfd70d783e2a37d002439c088458abd29061ba84389f0b6.png"
  },
  {
    title: "NearDoc",
    intro: "Full-stack healthcare booking platform connecting patients with verified medical professionals for real-time appointment scheduling.",
    demoUrl: null,
    githubUrl: "https://github.com/krishanagopal/NearDoc",
    image: "https://cdn.21st.dev/assets/mirror/63/633172958fbafeb8ecfd70d783e2a37d002439c088458abd29061ba84389f0b6.png"
  },
]

export default function JobSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartXRef = useRef(null)

  const handlePrev = () =>
    setCurrentSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1))

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX
    }
  }

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX
    if (diff > 45) {
      handleNext()
    } else if (diff < -45) {
      handlePrev()
    }
    touchStartXRef.current = null
  }

  return (
    <section
      className="
      w-full min-h-[calc(100dvh-56px)] sm:min-h-screen flex flex-col items-center justify-center
      bg-[#FDF8F3] dark:bg-[#0A0A0C]
      py-6 sm:py-16 px-4 sm:px-12 lg:px-20
      relative transition-colors box-border my-0 border-0 rounded-none overflow-hidden
      "
    >
      {/* Top Header Row */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-3 sm:mb-8 z-30">
        <div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1917] dark:text-white">
            Featured Projects
          </h2>
          <p className="text-xs sm:text-base text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
            Selected full-stack web applications & telemetry tools
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-white dark:bg-[#18181C] text-gray-900 dark:text-[#FACC15] font-semibold text-xs sm:text-base border border-gray-200/80 dark:border-[#FACC15]/30 shadow-sm flex-shrink-0">
          0{currentSlide + 1} / 0{projects.length}
        </span>
      </div>

      {/* Static Featured Image at the top (pinned, does not slide/scroll) */}
      <div className="w-full max-w-4xl flex justify-center bg-transparent py-1 sm:py-2 mb-2 sm:mb-4">
        <img
          src="https://cdn.21st.dev/assets/mirror/63/633172958fbafeb8ecfd70d783e2a37d002439c088458abd29061ba84389f0b6.png"
          alt="Featured Projects"
          width={360}
          height={360}
          className="rounded-2xl object-contain max-h-[140px] sm:max-h-[290px] drop-shadow-md"
        />
      </div>

      {/* Main Slider Area - Text details only slide left/right */}
      <div
        className="w-full max-w-4xl relative flex flex-col sm:flex-row sm:items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop-only Left Arrow Button */}
        <Button
          variant="ghost"
          size="icon"
          className="
            hidden sm:flex absolute -left-12 top-1/2 -translate-y-1/2
            rounded-full bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md
            shadow-lg hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700
            z-30 w-12 h-12 flex-shrink-0 transition-transform hover:scale-105 active:scale-95
          "
          onClick={handlePrev}
          title="Previous Project"
          aria-label="Previous Project"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-[#FACC15]" />
        </Button>

        {/* Project Content Container - NO background card, text written directly on page */}
        <div className="overflow-hidden w-full px-0 sm:px-16 py-1 sm:py-2 touch-pan-y">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="min-w-full flex flex-col items-start text-left space-y-2.5 sm:space-y-4 px-1 sm:px-0"
              >
                {/* Title */}
                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-white tracking-tight">
                  {project.title}
                </h3>

                {/* Description in Editorial Serif */}
                <p
                  className="text-sm sm:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed font-normal"
                  style={{
                    fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    letterSpacing: "0.01em"
                  }}
                >
                  "{project.intro}"
                </p>

                {/* Underlined Text Links */}
                <div className="flex flex-wrap items-center gap-3.5 sm:gap-6 pt-2 sm:pt-4 sm:border-t sm:border-gray-300/40 sm:dark:border-neutral-800 w-full">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs sm:text-lg font-bold text-[#C83737] dark:text-[#FACC15] underline underline-offset-4 decoration-2 hover:opacity-80 transition-opacity"
                    >
                      Live Application ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs sm:text-lg font-bold text-[#1C1917] dark:text-white underline underline-offset-4 decoration-2 hover:opacity-80 transition-opacity"
                    >
                      GitHub Repository ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-only Navigation Controls (Dots + Prev/Next buttons) */}
        <div className="flex sm:hidden items-center justify-between w-full pt-4 mt-1 px-1">
          {/* Slide Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === i
                    ? "w-6 bg-[#FACC15]"
                    : "w-2 bg-gray-300 dark:bg-neutral-700"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Pill Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-white dark:bg-[#18181C] border border-gray-200 dark:border-neutral-700/80 flex items-center justify-center text-gray-800 dark:text-[#FACC15] shadow-sm active:scale-90 transition-transform"
              aria-label="Previous Project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white dark:bg-[#18181C] border border-gray-200 dark:border-neutral-700/80 flex items-center justify-center text-gray-800 dark:text-[#FACC15] shadow-sm active:scale-90 transition-transform"
              aria-label="Next Project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop-only Right Arrow Button */}
        <Button
          variant="ghost"
          size="icon"
          className="
            hidden sm:flex absolute -right-12 top-1/2 -translate-y-1/2
            rounded-full bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md
            shadow-lg hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700
            z-30 w-12 h-12 flex-shrink-0 transition-transform hover:scale-105 active:scale-95
          "
          onClick={handleNext}
          title="Next Project"
          aria-label="Next Project"
        >
          <ChevronRight className="w-6 h-6 text-gray-800 dark:text-[#FACC15]" />
        </Button>
      </div>
    </section>
  )
}


