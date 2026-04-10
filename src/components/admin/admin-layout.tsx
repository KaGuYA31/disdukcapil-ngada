"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Lightbulb,
  UserCircle,
  CreditCard,
  Globe,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminMenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: { title: string; href: string; icon: React.ElementType; description?: string }[];
  groupLabel?: string;
}

const menuItems: AdminMenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Info Kependudukan",
    href: "/admin/statistik",
    icon: Database,
    groupLabel: "Pengelolaan Informasi Administrasi Kependudukan",
    children: [
      {
        title: "Data Statistik",
        href: "/admin/statistik",
        icon: BarChart3,
        description: "Statistik penduduk & dokumen",
      },
      {
        title: "Transparansi & Publikasi",
        href: "/admin/transparansi",
        icon: FileText,
        description: "Dokumen, laporan, SOP",
      },
      {
        title: "Open Data",
        href: "/admin/statistik#open-data",
        icon: Database,
        description: "Data terbuka untuk publik",
      },
    ],
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
  },
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
  {
    title: "Pengaturan",
    href: "/admin/pengaturan",
    icon: Settings,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Info Kependudukan"]);

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/");
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800 flex-shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">Disdukcapil</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = !item.children && pathname === item.href;
            const isParentActive = item.children
              ? item.children.some((child) => pathname === child.href)
              : false;
            const isExpanded = expandedMenus.includes(item.title);

            if (item.children) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isParentActive
                        ? "bg-gray-800 text-green-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 flex-shrink-0",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="mt-1 space-y-0.5">
                      {item.groupLabel && (
                        <div className="px-4 py-1.5">
                          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider leading-tight">
                            {item.groupLabel}
                          </p>
                        </div>
                      )}
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors",
                              childActive
                                ? "bg-green-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                          >
                            <child.icon className="h-4 w-4 flex-shrink-0" />
                            <div className="text-left">
                              <span className="block text-sm">{child.title}</span>
                              {child.description && (
                                <span className={cn(
                                  "block text-[10px] mt-0.5 leading-tight",
                                  childActive ? "text-green-200" : "text-gray-500"
                                )}>
                                  {child.description}
                                </span>
                              )}
                            </div>
                            {childActive && (
                              <ChevronRight className="h-3 w-3 ml-auto flex-shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <span className="hidden md:inline">Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
