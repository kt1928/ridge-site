"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  Building2,
  Coffee,
  Database,
  FolderGit2,
  GitBranch,
  HardDrive,
  Home,
  Monitor,
  Network,
  Server,
  Shield,
  Workflow,
  Zap,
} from "lucide-react"

const NORD = {
  nord0: "#2E3440",
  nord1: "#3B4252",
  nord2: "#434C5E",
  nord3: "#4C566A",
  nord4: "#D8DEE9",
  nord5: "#E5E9F0",
  nord6: "#ECEFF4",
  nord7: "#8FBCBB",
  nord8: "#88C0D0",
  nord9: "#81A1C1",
  nord10: "#5E81AC",
  nord11: "#BF616A",
  nord12: "#D08770",
  nord13: "#EBCB8B",
  nord14: "#A3BE8C",
  nord15: "#B48EAD",
}

type Status = "active" | "in-progress" | "idea" | "stable"

type Card = {
  title: string
  description: string
  status?: Status
  href?: string
  icon?: any
  accent?: string
  category?: string
}

type Group = {
  title: string
  subtitle: string
  icon: any
  items: Card[]
  accent: string
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; fg: string; bg: string; bd: string }> = {
    active: {
      label: "Active",
      fg: NORD.nord14,
      bg: `${NORD.nord14}22`,
      bd: `${NORD.nord14}55`,
    },
    "in-progress": {
      label: "In Progress",
      fg: NORD.nord13,
      bg: `${NORD.nord13}22`,
      bd: `${NORD.nord13}55`,
    },
    stable: {
      label: "Stable",
      fg: NORD.nord8,
      bg: `${NORD.nord8}22`,
      bd: `${NORD.nord8}55`,
    },
    idea: {
      label: "Idea",
      fg: NORD.nord9,
      bg: `${NORD.nord9}22`,
      bd: `${NORD.nord9}55`,
    },
  }
  const s = map[status]

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
      style={{ color: s.fg, background: s.bg, border: `1px solid ${s.bd}` }}
    >
      {s.label}
    </span>
  )
}

function ServiceCard({ item }: { item: Card }) {
  const [hover, setHover] = useState(false)

  return (
    <a
      href={item.href || "#"}
      target={item.href?.startsWith("http") ? "_blank" : undefined}
      rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group block rounded-3xl focus-visible:focus-ring"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="glass relative h-full overflow-hidden rounded-3xl p-6 transition-all duration-500 will-change-transform group-hover:-translate-y-2 group-hover:scale-[1.02]"
        style={{ 
          borderColor: hover ? `${item.accent || NORD.nord8}66` : undefined,
          boxShadow: hover ? `0 20px 40px ${(item.accent || NORD.nord8)}20, 0 0 0 1px ${(item.accent || NORD.nord8)}30` : undefined,
        }}
      >
        {/* Animated background glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${(item.accent || NORD.nord8) + "50"}, transparent 70%)`,
            opacity: hover ? 1 : 0.3,
            transform: hover ? 'scale(1.2)' : 'scale(1)',
          }}
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300"
                style={{ 
                  background: `${item.accent || NORD.nord8}18`, 
                  border: `1px solid ${(item.accent || NORD.nord8) + "33"}`,
                  transform: hover ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {item.icon && <item.icon size={20} style={{ color: item.accent || NORD.nord8 }} />}
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-nord-6 group-hover:text-nord-6 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-nord-5 text-pretty">
                  {item.description}
                </p>
              </div>
            </div>

            {item.status && (
              <div className="shrink-0">
                <StatusPill status={item.status} />
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            {item.category && (
              <span className="text-xs font-medium px-2 py-1 rounded-lg" 
                    style={{ 
                      color: `${item.accent || NORD.nord8}`, 
                      background: `${item.accent || NORD.nord8}15` 
                    }}>
                {item.category}
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-nord-6/90 ml-auto">
              {item.href ? "Open" : "View"}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </div>

        {/* Top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      </div>
    </a>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl glass p-8 md:p-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${NORD.nord8} 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                 style={{
                   background: `${NORD.nord14}15`,
                   border: `1px solid ${NORD.nord14}30`,
                 }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: NORD.nord14 }} />
              <span className="text-xs font-medium" style={{ color: NORD.nord14 }}>
                System Online
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-nord-6">
              Welcome back,
              <br />
              <span style={{ color: NORD.nord8 }}>Kappy</span>
            </h1>
            
            <p className="text-lg leading-relaxed text-nord-5 max-w-2xl mb-8">
              Managing 18 rental units across Brooklyn & Queens through QBSON LLC, 
              while building a comprehensive homelab ecosystem and passion projects.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass">
                <Building2 size={20} style={{ color: NORD.nord12 }} />
                <div>
                  <div className="text-sm font-semibold text-nord-6">Real Estate</div>
                  <div className="text-xs text-nord-5">18 Units • QBSON LLC</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass">
                <Server size={20} style={{ color: NORD.nord8 }} />
                <div>
                  <div className="text-sm font-semibold text-nord-6">Homelab</div>
                  <div className="text-xs text-nord-5">15+ Services • 3 Servers</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass">
                <Coffee size={20} style={{ color: NORD.nord13 }} />
                <div>
                  <div className="text-sm font-semibold text-nord-6">Coffee Dreams</div>
                  <div className="text-xs text-nord-5">Future Shop Owner</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: NORD.nord8 }}>99.9%</div>
                <div className="text-xs text-nord-5">Uptime</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: NORD.nord14 }}>24/7</div>
                <div className="text-xs text-nord-5">Monitoring</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: NORD.nord13 }}>15+</div>
                <div className="text-xs text-nord-5">Services</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: NORD.nord15 }}>4</div>
                <div className="text-xs text-nord-5">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Allow scrolling here (landing page handles its own scroll behavior)
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
  }, [])

  const groups: Group[] = useMemo(
    () => [
      {
        title: "ridgeserver",
        subtitle: "Media Automation Stack",
        icon: Monitor,
        accent: NORD.nord8,
        items: [
          { title: "Plex", description: "Personal media server with 4K streaming", icon: Monitor, accent: NORD.nord8, category: "Media" },
          { title: "Overseerr", description: "Request management & approval system", icon: Network, accent: NORD.nord7, category: "Management" },
          { title: "Tautulli", description: "Plex analytics and monitoring", icon: Database, accent: NORD.nord9, category: "Analytics" },
          { title: "Sonarr", description: "TV series automation", icon: Workflow, accent: NORD.nord10, category: "Automation" },
          { title: "Sonarr (Anime)", description: "Dedicated anime automation", icon: Workflow, accent: NORD.nord15, category: "Automation" },
          { title: "Sonarr (K-Drama)", description: "Korean drama automation", icon: Workflow, accent: NORD.nord12, category: "Automation" },
          { title: "Radarr", description: "Movie collection automation", icon: Workflow, accent: NORD.nord14, category: "Automation" },
          { title: "Radarr (4K)", description: "4K movie automation", icon: Workflow, accent: NORD.nord13, category: "Automation" },
          { title: "Jackett", description: "Indexer proxy for trackers", icon: Network, accent: NORD.nord9, category: "Indexing" },
          { title: "qBittorrent", description: "Download client with VPN", icon: HardDrive, accent: NORD.nord10, category: "Downloads" },
        ],
      },
      {
        title: "tower",
        subtitle: "Storage & Security Hub",
        icon: HardDrive,
        accent: NORD.nord9,
        items: [
          { title: "Immich", description: "Self-hosted photo management (Google Photos alternative)", icon: Database, accent: NORD.nord8, category: "Photos" },
          { title: "Syncthing", description: "Continuous file synchronization", icon: HardDrive, accent: NORD.nord14, category: "Sync" },
          { title: "SWAG", description: "Secure reverse proxy with SSL", icon: Network, accent: NORD.nord9, category: "Proxy" },
          { title: "CrowdSec", description: "Collaborative security engine", icon: Shield, accent: NORD.nord11, category: "Security" },
        ],
      },
      {
        title: "kapservices",
        subtitle: "Operations & Automation",
        icon: Workflow,
        accent: NORD.nord14,
        items: [
          { title: "n8n", description: "Workflow automation platform", icon: Workflow, accent: NORD.nord14, category: "Automation" },
          { title: "Snipe-IT", description: "Asset management system", icon: FolderGit2, accent: NORD.nord13, category: "Management" },
          { title: "Homarr", description: "Homelab dashboard", icon: Monitor, accent: NORD.nord8, category: "Dashboard" },
        ],
      },
      {
        title: "Infrastructure",
        subtitle: "Core Systems",
        icon: Network,
        accent: NORD.nord10,
        items: [
          { title: "Proxmox VE", description: "Virtualization platform on kapmox", icon: HardDrive, accent: NORD.nord10, category: "Hypervisor" },
          { title: "Cloudflare Tunnel", description: "Secure external access", icon: Network, accent: NORD.nord8, category: "Networking" },
          { title: "Tailscale", description: "Mesh VPN for remote access", icon: Network, accent: NORD.nord7, category: "VPN" },
        ],
      },
      {
        title: "Active Projects",
        subtitle: "Current Development",
        icon: FolderGit2,
        accent: NORD.nord15,
        items: [
          {
            title: "kap-ring",
            description: "3-2-1 backup & disaster recovery solution for homelab",
            status: "active",
            href: "https://github.com/kt1928/kap-ring",
            icon: HardDrive,
            accent: NORD.nord14,
            category: "Backup"
          },
          {
            title: "kap-estate",
            description: "NYC real estate intelligence & analytics platform",
            status: "in-progress",
            href: "https://github.com/kt1928/kap-estate",
            icon: Database,
            accent: NORD.nord8,
            category: "Real Estate"
          },
          {
            title: "node-system",
            description: "Homelab deployment & infrastructure management",
            status: "stable",
            href: "https://github.com/kt1928/node-system",
            icon: GitBranch,
            accent: NORD.nord9,
            category: "DevOps"
          },
          {
            title: "building-monitor",
            description: "NYC BIS/311 monitoring with Discord alerts",
            status: "stable",
            href: "https://github.com/kt1928/building-monitor",
            icon: Shield,
            accent: NORD.nord13,
            category: "Monitoring"
          },
        ],
      },
    ],
    [],
  )

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-dvh bg-nord-0">
      {/* Floating Navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <nav className="glass rounded-2xl px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="rounded-lg p-1.5"
                style={{
                  background: `${NORD.nord8}20`,
                  border: `1px solid ${NORD.nord8}30`,
                }}
              >
                <Server size={16} style={{ color: NORD.nord8 }} />
              </div>
              <span className="text-sm font-medium text-nord-6">Ridge Server</span>
            </div>
            
            <div className="h-4 w-px bg-nord-3" />
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-nord-5 transition-colors hover:text-nord-6"
              >
                <Home size={14} />
                Home
              </a>
              <a
                href="/map"
                className="flex items-center gap-2 text-sm font-medium text-nord-5 transition-colors hover:text-nord-6"
              >
                <Coffee size={14} />
                Map
              </a>
              <a
                href="https://github.com/kt1928"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-nord-5 transition-colors hover:text-nord-6"
              >
                <FolderGit2 size={14} />
                GitHub
              </a>
            </div>
          </div>
        </nav>
      </div>

      <main className="px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Hero Section */}
          <HeroSection />

          {/* Service Groups */}
          {groups.map((group, groupIndex) => (
            <section key={group.title} className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-medium tracking-wide text-nord-5 uppercase">
                    {group.subtitle}
                  </div>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-nord-6 flex items-center gap-3">
                    {group.title}
                    <div
                      className="grid h-8 w-8 place-items-center rounded-xl"
                      style={{ 
                        background: `${group.accent}18`, 
                        border: `1px solid ${group.accent}33` 
                      }}
                    >
                      <group.icon size={16} style={{ color: group.accent }} />
                    </div>
                  </h2>
                </div>
                
                <div className="text-sm text-nord-5">
                  {group.items.length} {group.items.length === 1 ? 'service' : 'services'}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={`${group.title}-${item.title}`}
                    className="animate-in"
                    style={{
                      animationDelay: `${(groupIndex * 100) + (itemIndex * 50)}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ServiceCard item={{ ...item, accent: item.accent || group.accent }} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Footer */}
          <footer className="text-center py-8">
            <div className="glass rounded-2xl px-6 py-4 inline-block">
              <p className="text-sm text-nord-5">
                Built with <span style={{ color: NORD.nord11 }}>♥</span> using Next.js 15, Tailwind CSS & Nord Theme
              </p>
              <p className="text-xs text-nord-4 mt-1">
                Forest Hills, Queens • NYC • {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}