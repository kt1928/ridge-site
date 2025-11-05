"use client"

import { useState, useEffect } from "react"
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
    }, 800)
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
      // Disable scrolling on desktop
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      // Ensure scrolling is enabled on mobile
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [isMobile])

  if (isLoading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord1} 100%)`,
        }}
      >
        <div
          className="w-16 h-16 rounded-full border-t-transparent animate-spin"
          style={{
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: NORD_COLORS.frost.nord8,
            borderTopColor: "transparent",
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${isMobile ? "min-h-screen overflow-auto" : "h-screen w-screen fixed inset-0 overflow-hidden"}`}
      style={{
        background: `linear-gradient(135deg, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord1} 100%)`,
      }}
    >
      {/* Desktop: Vertical Social Media Icons */}
      {!isMobile && (
        <div className="absolute left-8 flex flex-col gap-6 z-10" style={{ bottom: "3rem" }}>
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
                onMouseEnter={() => setHoveredSocial(social.name)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  transform: hoveredSocial === social.name ? "translateX(4px)" : "translateX(0)",
                }}
              >
                {social.name === "TikTok" ? (
                  <TikTokIcon
                    size={32}
                    color={hoveredSocial === social.name ? social.color : NORD_COLORS.snowStorm.nord5}
                  />
                ) : (
                  <IconComponent
                    size={32}
                    style={{
                      color: hoveredSocial === social.name ? social.color : NORD_COLORS.snowStorm.nord5,
                      transition: "color 0.3s ease",
                    }}
                  />
                )}
              </a>
            )
          })}
        </div>
      )}

      {/* Main Content */}
      <main
        className={`${isMobile ? "min-h-screen pb-24" : "h-full flex items-center justify-center"} px-6 ${isMobile ? "pt-8" : ""}`}
      >
        <div className={`${isMobile ? "w-full" : "max-w-6xl w-full"}`}>
          {/* Projects Grid */}
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div
                  className={`relative p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer flex flex-col ${isMobile ? "h-48" : "h-64"}`}
                  style={{
                    background: `linear-gradient(145deg, ${NORD_COLORS.polarNight.nord1}, ${NORD_COLORS.polarNight.nord2})`,
                    boxShadow:
                      hoveredProject === project.id
                        ? `0 20px 40px ${project.color}33, 0 8px 16px ${NORD_COLORS.polarNight.nord0}66`
                        : `0 8px 32px ${NORD_COLORS.polarNight.nord0}66, inset 0 1px 0 ${NORD_COLORS.polarNight.nord3}33`,
                    border: `1px solid ${hoveredProject === project.id ? project.color + "66" : NORD_COLORS.polarNight.nord3}`,
                  }}
                >
                  {/* Gradient overlay for 3D effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-20 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(145deg, transparent, ${project.color}22)`,
                      opacity: hoveredProject === project.id ? 0.3 : 0.1,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top content */}
                    <div className="flex-1">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: project.color + "22",
                            color: project.color,
                            border: `1px solid ${project.color}44`,
                          }}
                        >
                          {project.category}
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3
                        className={`font-bold mb-2 ${isMobile ? "text-lg" : "text-lg"}`}
                        style={{ color: NORD_COLORS.snowStorm.nord6 }}
                      >
                        {project.title}
                      </h3>

                      {/* Project Description */}
                      <p className="text-sm leading-relaxed" style={{ color: NORD_COLORS.snowStorm.nord5 }}>
                        {project.description}
                      </p>
                    </div>

                    {/* Arrow at bottom right */}
                    <div className="flex items-end justify-end mt-3">
                      <div
                        className="transition-transform duration-300"
                        style={{
                          transform: hoveredProject === project.id ? "translateX(4px)" : "translateX(0)",
                        }}
                      >
                        <ArrowRight size={18} style={{ color: NORD_COLORS.snowStorm.nord6 }} />
                      </div>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(45deg, transparent 30%, ${NORD_COLORS.snowStorm.nord6}11 50%, transparent 70%)`,
                      opacity: hoveredProject === project.id ? 1 : 0,
                    }}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile: Fixed Bottom Social Media Icons */}
      {isMobile && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center gap-8 py-4"
          style={{
            background: `linear-gradient(to top, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord0}CC 70%, transparent 100%)`,
            backdropFilter: "blur(8px)",
          }}
        >
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 active:scale-95"
                onTouchStart={() => setHoveredSocial(social.name)}
                onTouchEnd={() => setHoveredSocial(null)}
              >
                {social.name === "TikTok" ? (
                  <TikTokIcon
                    size={28}
                    color={hoveredSocial === social.name ? social.color : NORD_COLORS.snowStorm.nord5}
                  />
                ) : (
                  <IconComponent
                    size={28}
                    style={{
                      color: hoveredSocial === social.name ? social.color : NORD_COLORS.snowStorm.nord5,
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
