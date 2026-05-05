"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronDown,
  BarChart3,
  Lightbulb,
  UserCircle,
  CreditCard,
  Globe,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminMenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface MenuGroup {
  label: string;
  items: AdminMenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Utama",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Data & Layanan",
    items: [
      {
        title: "Data Kependudukan",
        href: "/admin/statistik",
        icon: BarChart3,
      },
      {
        title: "Manajemen Layanan",
        href: "/admin/layanan",
        icon: CreditCard,
      },
      {
        title: "Pengajuan Online",
        href: "/admin/pengajuan-online",
        icon: Globe,
        badge: "Baru",
      },
    ],
  },
  {
    label: "Konten",
    items: [
      {
        title: "Kegiatan Inovasi",
        href: "/admin/inovasi",
        icon: Lightbulb,
      },
      {
        title: "Manajemen Berita",
        href: "/admin/berita",
        icon: FileText,
      },
    ],
  },
  {
    label: "Organisasi",
    items: [
      {
        title: "Struktur Organisasi",
        href: "/admin/struktur",
        icon: UserCircle,
      },
      {
        title: "Pengaduan",
        href: "/admin/pengaduan",
        icon: MessageSquare,
      },
    ],
  },
];

const bottomItems: AdminMenuItem[] = [
  {
    title: "Pengaturan",
    href: "/admin/pengaturan",
    icon: Settings,
  },
];

// Map path to breadcrumb title
function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/statistik": "Data Kependudukan",
    "/admin/layanan": "Manajemen Layanan",
    "/admin/pengajuan-online": "Pengajuan Online",
    "/admin/inovasi": "Kegiatan Inovasi",
    "/admin/berita": "Manajemen Berita",
    "/admin/struktur": "Struktur Organisasi",
    "/admin/pengaduan": "Pengaduan",
    "/admin/pengaturan": "Pengaturan",
  };
  return map[pathname] || "Admin";
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/");
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800" />

        <div className="relative flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.06] flex-shrink-0">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20 group-hover:shadow-green-900/40 transition-shadow">
                <Building2 className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm leading-tight">Disdukcapil</span>
                <span className="text-[10px] text-gray-400 leading-tight">Kabupaten Ngada</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
            {menuGroups.map((group) => (
              <div key={group.label}>
                {/* Group Label */}
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                          isActive
                            ? "bg-green-600/90 text-white shadow-lg shadow-green-900/30"
                            : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                        )}
                      >
                        <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-400")} />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && !isActive && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-green-500/20 text-green-400 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-white/[0.06] py-3 px-3 flex-shrink-0">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5",
                    isActive
                      ? "bg-green-600/90 text-white shadow-lg shadow-green-900/30"
                      : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            <div className="mt-2 px-3 py-2.5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-300 truncate">Administrator</p>
                  <p className="text-[10px] text-gray-500 truncate">admin@ngadakab.go.id</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-gray-300 transition-colors">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="top">
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80">
          <div className="flex items-center justify-between h-14 px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-sm">
                <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
                  Admin
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                <span className="font-medium text-gray-800">{pageTitle}</span>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Date & Time */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{formatTime(currentTime)}</span>
                <span className="text-gray-300">·</span>
                <span className="hidden lg:inline">{formatDate(currentTime)}</span>
              </div>

              <Separator orientation="vertical" className="hidden md:block h-6" />

              {/* Admin Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 hover:bg-gray-100">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push("/admin/pengaturan")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
