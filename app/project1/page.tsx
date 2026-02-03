"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Instagram, Youtube } from "lucide-react"

// Nord color palette
const NORD_COLORS = {
  polarNight: {
    nord0: "#2E3440",
    nord1: "#3B4252",
    nord2: "#434C5E",
    nord3: "#4C566A",
  },
  snowStorm: {
    nord4: "#D8DEE9",
    nord5: "#E5E9F0",
    nord6: "#ECEFF4",
  },
  frost: {
    nord7: "#8FBCBB",
    nord8: "#88C0D0",
    nord9: "#81A1C1",
    nord10: "#5E81AC",
  },
  aurora: {
    nord11: "#BF616A",
    nord12: "#D08770",
    nord13: "#EBCB8B",
    nord14: "#A3BE8C",
    nord15: "#B48EAD",
  },
}

// TikTok icon component (since it's not in Lucide)
const TikTokIcon = ({ size = 24, color = "#ECEFF4" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.294-1.98-1.294-3.338h-3.239v14.19c0 1.457-1.183 2.64-2.64 2.64s-2.64-1.183-2.64-2.64 1.183-2.64 2.64-2.64c.291 0 .57.047.832.134V9.604a5.853 5.853 0 0 0-.832-.059c-3.237 0-5.86 2.623-5.86 5.86s2.623 5.86 5.86 5.86 5.86-2.623 5.86-5.86V8.362a9.468 9.468 0 0 0 5.453 1.696V6.839c-1.126 0-2.166-.447-2.96-1.277z"
      fill={color}
    />
  </svg>
)

// Project data - expanded to 9 projects for 3x3 grid
const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack online store with payment integration",
    category: "Web Development",
    color: NORD_COLORS.frost.nord8,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 2,
    title: "Mobile App Design",
    description: "iOS/Android app with modern UI/UX design",
    category: "Mobile Development",
    color: NORD_COLORS.frost.nord9,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 3,
    title: "Data Visualization",
    description: "Interactive dashboards and analytics platform",
    category: "Data Science",
    color: NORD_COLORS.frost.nord10,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 4,
    title: "AI Chatbot",
    description: "Intelligent conversational AI with NLP capabilities",
    category: "Artificial Intelligence",
    color: NORD_COLORS.aurora.nord11,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 5,
    title: "Blockchain DApp",
    description: "Decentralized application on Ethereum network",
    category: "Blockchain",
    color: NORD_COLORS.aurora.nord13,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 6,
    title: "DevOps Pipeline",
    description: "Automated CI/CD pipeline with Docker containers",
    category: "DevOps",
    color: NORD_COLORS.aurora.nord14,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 7,
    title: "Machine Learning Model",
    description: "Predictive analytics and recommendation system",
    category: "Machine Learning",
    color: NORD_COLORS.aurora.nord15,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 8,
    title: "Cloud Architecture",
    description: "Scalable microservices on AWS infrastructure",
    category: "Cloud Computing",
    color: NORD_COLORS.frost.nord7,
    link: "#", // You'll replace this with your actual link
  },
  {
    id: 9,
    title: "Game Development",
    description: "2D platformer game built with Unity engine",
    category: "Game Development",
    color: NORD_COLORS.aurora.nord12,
    link: "#", // You'll replace this with your actual link
  },
]

// Social media links
const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/kappys.corner/profilecard/?igsh=MWpoenJpbHFtYjUydw==",
    icon: Instagram,
    color: NORD_COLORS.aurora.nord11,
  },
  {
    name: "YouTube",
    url: "http://www.youtube.com/@kappyscorner",
    icon: Youtube,
    color: NORD_COLORS.aurora.nord11,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@kappys.corner?_t=ZP-8wsh4xY3KRT&_r=1",
    icon: TikTokIcon,
    color: NORD_COLORS.snowStorm.nord6,
  },
]

export default function ProjectDirectoryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Prevent scrolling on desktop only
  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [isMobile])

  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-nord-0">
        <div className="w-[22rem] max-w-[85vw] animate-in">
          <div className="mb-4 text-center">
            <div className="text-xs font-medium tracking-wide text-nord-5">RIDGE</div>
            <div className="mt-1 text-xl font-semibold tracking-tight text-nord-6">Loading projects</div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-nord-1/70">
            <div className="h-full w-1/2 rounded-full bg-nord-8/90" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-nord-0">
      {/* Desktop: Vertical Social Media Icons */}
      {!isMobile && (
        <div className="fixed left-8 z-20 flex flex-col gap-6" style={{ bottom: "3rem" }}>
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            const isHovered = hoveredSocial === social.name
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-110"
                onMouseEnter={() => setHoveredSocial(social.name)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)" }}
              >
                {social.name === "TikTok" ? (
                  <TikTokIcon size={32} color={isHovered ? social.color : NORD_COLORS.snowStorm.nord5} />
                ) : (
                  <IconComponent
                    size={32}
                    style={{
                      color: isHovered ? social.color : NORD_COLORS.snowStorm.nord5,
                      transition: "color 0.3s ease",
                    }}
                  />
                )}
              </a>
            )
          })}
        </div>
      )}

      <main className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="glass animate-in rounded-3xl px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-medium tracking-wide text-nord-5">PROJECT DIRECTORY</div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-nord-6 sm:text-3xl">Project 1</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-nord-5 text-balance">
                  A curated set of experiments and builds. Tap a card to open it.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-nord-6/90 transition-colors hover:bg-nord-3/20 focus-visible:focus-ring"
                >
                  Home
                </a>
                <a
                  href="/map"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-nord-6/90 transition-colors hover:bg-nord-3/20 focus-visible:focus-ring"
                >
                  Map
                </a>
              </div>
            </div>
          </header>

          {/* Grid */}
          <section className="mt-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const isHovered = hoveredProject === project.id
                return (
                  <a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block focus-visible:focus-ring rounded-3xl"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div
                      className="glass relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-300 will-change-transform group-hover:-translate-y-1 group-hover:scale-[1.01]"
                      style={{ borderColor: isHovered ? `${project.color}66` : undefined }}
                    >
                      {/* soft accent */}
                      <div
                        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${project.color}40, transparent 70%)`,
                          opacity: isHovered ? 1 : 0.7,
                        }}
                      />

                      <div className="relative flex h-full flex-col">
                        <div className="mb-4">
                          <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              background: `${project.color}22`,
                              color: project.color,
                              border: `1px solid ${project.color}44`,
                            }}
                          >
                            {project.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold tracking-tight text-nord-6">{project.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-nord-5">{project.description}</p>

                        <div className="mt-6 flex items-center justify-end">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-nord-6/90">
                            Open
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>

                      {/* top highlight */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile: Fixed Bottom Social Media Icons */}
      {isMobile && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-8 px-6 py-4"
          style={{
            background: `linear-gradient(to top, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord0}CC 70%, transparent 100%)`,
            backdropFilter: "blur(12px)",
          }}
        >
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            const isHovered = hoveredSocial === social.name
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 active:scale-95"
                onTouchStart={() => setHoveredSocial(social.name)}
                onTouchEnd={() => setHoveredSocial(null)}
              >
                {social.name === "TikTok" ? (
                  <TikTokIcon size={28} color={isHovered ? social.color : NORD_COLORS.snowStorm.nord5} />
                ) : (
                  <IconComponent
                    size={28}
                    style={{
                      color: isHovered ? social.color : NORD_COLORS.snowStorm.nord5,
                      transition: "color 0.3s ease",
                    }}
                  />
                )}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
