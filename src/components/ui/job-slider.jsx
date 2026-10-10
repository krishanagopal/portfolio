import { useState } from "react"
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

  const handlePrev = () =>
    setCurrentSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1))

  return (
    <section
      className="
      w-full min-h-screen flex flex-col items-center justify-center
      bg-[#FDF8F3] dark:bg-[#0A0A0C]
      py-16 px-6 sm:px-12 lg:px-20
      relative transition-colors box-border my-0 border-0 rounded-none
      "
    >
      {/* Top Header Row */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 z-30">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1917] dark:text-white">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Selected full-stack web applications & telemetry tools
          </p>
        </div>
        <span className="inline-flex items-center px-5 py-2 rounded-2xl bg-white dark:bg-[#18181C] text-gray-900 dark:text-[#FACC15] font-semibold text-sm sm:text-base border border-gray-200/80 dark:border-[#FACC15]/30 shadow-sm">
          0{currentSlide + 1} / 0{projects.length}
        </span>
      </div>

      {/* Static Featured Image at the top (pinned, does not slide/scroll) */}
      <div className="w-full max-w-4xl flex justify-center bg-transparent py-2 mb-4">
        <img
          src="https://cdn.21st.dev/assets/mirror/63/633172958fbafeb8ecfd70d783e2a37d002439c088458abd29061ba84389f0b6.png"
          alt="Featured Projects"
          width={360}
          height={360}
          className="rounded-2xl object-contain max-h-[250px] sm:max-h-[290px] drop-shadow-md"
        />
      </div>

      {/* Main Slider Area - Text details only slide left/right */}
      <div className="w-full max-w-4xl relative flex items-center">
        {/* Left Arrow Button (positioned outside with high z-index and ample padding) */}
        <Button
          variant="ghost"
          size="icon"
          className="
            absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2
            rounded-full bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md
            shadow-lg hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700
            z-30 w-12 h-12 flex-shrink-0 transition-transform hover:scale-105
          "
          onClick={handlePrev}
          title="Previous Project"
          aria-label="Previous Project"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-[#FACC15]" />
        </Button>

        {/* Project Content Container - NO background card, text written directly on page */}
        <div className="overflow-hidden w-full px-12 sm:px-16 py-2">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="min-w-full flex flex-col items-start text-left space-y-4"
              >
                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-white tracking-tight">
                  {project.title}
                </h3>

                {/* Description in Editorial Serif */}
                <p
                  className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 leading-snug font-normal"
                  style={{
                    fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    letterSpacing: "0.01em"
                  }}
                >
                  "{project.intro}"
                </p>

                {/* Underlined Text Links */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-300/40 dark:border-neutral-800 w-full">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base sm:text-lg font-bold text-[#C83737] dark:text-[#FACC15] underline underline-offset-4 decoration-2 hover:opacity-80 transition-opacity"
                    >
                      Live Application ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-white underline underline-offset-4 decoration-2 hover:opacity-80 transition-opacity"
                    >
                      GitHub Repository ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button (positioned outside with high z-index and ample padding) */}
        <Button
          variant="ghost"
          size="icon"
          className="
            absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2
            rounded-full bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md
            shadow-lg hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700
            z-30 w-12 h-12 flex-shrink-0 transition-transform hover:scale-105
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


