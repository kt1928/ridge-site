"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  Database,
  FolderGit2,
  GitBranch,
  HardDrive,
  Monitor,
  Network,
  Shield,
  Workflow,
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
      label: "In progress",
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
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ color: s.fg, background: s.bg, border: `1px solid ${s.bd}` }}
    >
      {s.label}
    </span>
  )
}

function GlassCard({ item }: { item: Card }) {
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
        className="glass relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-300 will-change-transform group-hover:-translate-y-1 group-hover:scale-[1.01]"
        style={{ borderColor: hover ? `${item.accent || NORD.nord8}66` : undefined }}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${(item.accent || NORD.nord8) + "40"}, transparent 70%)`,
            opacity: hover ? 1 : 0.7,
          }}
        />

        <div className="relative flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {item.icon ? (
                <div
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{ background: `${item.accent || NORD.nord8}18`, border: `1px solid ${(item.accent || NORD.nord8) + "33"}` }}
                >
                  <item.icon size={18} style={{ color: item.accent || NORD.nord8 }} />
                </div>
              ) : null}
              <div>
                <h3 className="text-base font-semibold tracking-tight text-nord-6">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-nord-5 text-pretty">{item.description}</p>
              </div>
            </div>

            <div className="shrink-0">
              {item.status ? <StatusPill status={item.status} /> : null}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-end">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-nord-6/90">
              {item.href ? "Open" : "Details"}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      </div>
    </a>
  )
}

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Allow scrolling here (landing page handles its own scroll behavior)
  useEffect(() => {
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
  }, [])

  const groups: Group[] = useMemo(
    () => [
      {
        title: "Self-hosted — ridgeserver",
        subtitle: "Media automation stack",
        icon: Monitor,
        accent: NORD.nord8,
        items: [
          { title: "Plex", description: "Media server", icon: Monitor, accent: NORD.nord8 },
          { title: "Overseerr", description: "Requests & approvals", icon: Network, accent: NORD.nord7 },
          { title: "Tautulli", description: "Plex analytics", icon: Database, accent: NORD.nord9 },
          { title: "Sonarr", description: "TV automation", icon: Workflow, accent: NORD.nord10 },
          { title: "Sonarr (Anime)", description: "Anime automation", icon: Workflow, accent: NORD.nord15 },
          { title: "Sonarr (K-Drama)", description: "K-Drama automation", icon: Workflow, accent: NORD.nord12 },
          { title: "Radarr", description: "Movie automation", icon: Workflow, accent: NORD.nord14 },
          { title: "Radarr (4K)", description: "4K movie automation", icon: Workflow, accent: NORD.nord13 },
          { title: "Jackett", description: "Indexer proxy", icon: Network, accent: NORD.nord9 },
          { title: "qBittorrent", description: "Downloads", icon: HardDrive, accent: NORD.nord10 },
          { title: "Requestrr", description: "Discord request bots (x3)", icon: Network, accent: NORD.nord11 },
        ],
      },
      {
        title: "Self-hosted — tower",
        subtitle: "Storage, photos & edge security",
        icon: HardDrive,
        accent: NORD.nord9,
        items: [
          { title: "Immich", description: "Photo management (Google Photos-like)", icon: Database, accent: NORD.nord8 },
          { title: "Syncthing", description: "File sync", icon: HardDrive, accent: NORD.nord14 },
          { title: "SWAG", description: "Reverse proxy", icon: Network, accent: NORD.nord9 },
          { title: "CrowdSec", description: "Security", icon: Shield, accent: NORD.nord11 },
        ],
      },
      {
        title: "Self-hosted — kapservices",
        subtitle: "Ops + automation",
        icon: Workflow,
        accent: NORD.nord14,
        items: [
          { title: "n8n", description: "Workflow automation", icon: Workflow, accent: NORD.nord14 },
          { title: "Snipe-IT", description: "Asset management", icon: FolderGit2, accent: NORD.nord13 },
          { title: "Homarr", description: "Dashboard", icon: Monitor, accent: NORD.nord8 },
        ],
      },
      {
        title: "Infrastructure",
        subtitle: "How everything is connected",
        icon: Network,
        accent: NORD.nord10,
        items: [
          { title: "kapmox (Proxmox)", description: "Hypervisor", icon: HardDrive, accent: NORD.nord10 },
          { title: "Cloudflare Tunnel", description: "External access", icon: Network, accent: NORD.nord8 },
          { title: "Tailscale", description: "Mesh VPN", icon: Network, accent: NORD.nord7 },
        ],
      },
      {
        title: "Projects",
        subtitle: "Things I’m building",
        icon: FolderGit2,
        accent: NORD.nord15,
        items: [
          {
            title: "kap-ring",
            description: "3-2-1 backup & disaster recovery solution",
            status: "active",
            href: "https://github.com/kt1928/kap-ring",
            icon: HardDrive,
            accent: NORD.nord14,
          },
          {
            title: "kap-estate",
            description: "NYC real estate intelligence platform",
            status: "in-progress",
            href: "https://github.com/kt1928/kap-estate",
            icon: Database,
            accent: NORD.nord8,
          },
          {
            title: "node-system",
            description: "Homelab deployment infrastructure",
            status: "stable",
            href: "https://github.com/kt1928/node-system",
            icon: GitBranch,
            accent: NORD.nord9,
          },
          {
            title: "building-monitor",
            description: "NYC BIS/311 monitoring w/ Discord alerts",
            status: "stable",
            href: "https://github.com/kt1928/building-monitor",
            icon: Shield,
            accent: NORD.nord13,
          },
          {
            title: "inventory-management",
            description: "Asset tracking trial for property operations",
            status: "idea",
            href: "https://github.com/kt1928/inventory-management",
            icon: FolderGit2,
            accent: NORD.nord15,
          },
        ],
      },
    ],
    [],
  )

  return (
    <div className="min-h-dvh bg-nord-0">
      <main className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="glass animate-in rounded-3xl px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-medium tracking-wide text-nord-5">KAPPY</div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-nord-6 sm:text-3xl">Homelab + Projects</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-nord-5 text-balance">
                  Forest Hills, Queens • Real estate ops & investing (QBSON LLC) • Homelab/self-hosting • Business automation • 3D printing •
                  Specialty coffee.
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

          {/* About */}
          <section className="mt-8">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs font-medium tracking-wide text-nord-5">ABOUT</div>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-nord-6">Hi, I’m Kappy.</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-nord-5 text-pretty">
                    I run day-to-day real estate operations and investments across 18 rental units in Brooklyn & Queens under QBSON LLC. Outside
                    of that, I build a self-hosted stack (media, storage, automation) and ship small tools that make life easier.
                  </p>
                </div>
                {!isMobile ? (
                  <div className="rounded-2xl px-4 py-3" style={{ background: `${NORD.nord1}66`, border: `1px solid ${NORD.nord3}55` }}>
                    <div className="text-xs font-medium tracking-wide text-nord-5">GITHUB</div>
                    <a
                      href="https://github.com/kt1928"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-nord-6/90 hover:text-nord-6"
                    >
                      @kt1928 <ArrowUpRight size={16} />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* Groups */}
          <section className="mt-8 space-y-8">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs font-medium tracking-wide text-nord-5">{group.subtitle}</div>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-nord-6">{group.title}</h2>
                  </div>
                  <div
                    className="grid h-10 w-10 place-items-center rounded-2xl"
                    style={{ background: `${group.accent}18`, border: `1px solid ${group.accent}33` }}
                  >
                    <group.icon size={18} style={{ color: group.accent }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <GlassCard key={`${group.title}-${item.title}`} item={{ ...item, accent: item.accent || group.accent }} />
                  ))}
                </div>
              </div>
            ))}
          </section>

          <footer className="mt-10 pb-6 text-center text-xs text-nord-5">
            Built with Next.js • Nord theme • glass UI
          </footer>
        </div>
      </main>
    </div>
  )
}
