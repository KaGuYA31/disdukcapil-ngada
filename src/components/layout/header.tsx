"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronDown, ChevronRight, Building2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { OperatingHoursIndicator } from "@/components/shared/operating-hours-indicator";

interface NavChild {
  title: string;
  href: string;
  description?: string;
}

interface NavItem {
  title: string;
  href: string;
  dropdownLabel?: string;
  children?: NavChild[];
}

const navigation: NavItem[] = [
  { title: "Beranda", href: "/" },
  {
    title: "Profil",
    href: "/profil",
    children: [
      { title: "Visi & Misi", href: "/profil#visi-misi" },
      { title: "Struktur Organisasi", href: "/profil#struktur" },
      { title: "Sejarah", href: "/profil#sejarah" },
      { title: "Lokasi", href: "/profil#lokasi" },
    ],
  },
  {
    title: "Layanan",
    href: "/layanan",
    children: [
      { title: "Pendaftaran Penduduk", href: "/layanan?kategori=Pendaftaran+Penduduk", description: "KTP, KK, dan data penduduk" },
      { title: "Pencatatan Sipil", href: "/layanan?kategori=Pencatatan+Sipil", description: "Akta nikah, cerai, kelahiran" },
      { title: "Layanan Online", href: "/layanan-online", description: "Ajukan layanan secara daring" },
    ],
  },
  { title: "Statistik Kependudukan", href: "/statistik" },
  { title: "Berita", href: "/berita" },
  { title: "Pengaduan", href: "/pengaduan" },
];

// Custom hook for mounted state without setState in useEffect
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Mobile Navigation Item with collapsible children
function MobileNavItem({
  item,
  isActive,
  pathname,
}: {
  item: NavItem;
  isActive: boolean;
  pathname: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isCurrentActive = pathname === item.href || (hasChildren && pathname.startsWith(item.href));

  return (
    <div>
      {hasChildren ? (
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
            isCurrentActive
              ? "text-green-700 bg-green-50"
              : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
          )}
        >
          <div className="text-left">
            <span>{item.title}</span>
            {item.dropdownLabel && (
              <p className="text-[10px] text-gray-400 font-normal mt-0.5 leading-tight">{item.dropdownLabel}</p>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 flex-shrink-0",
              expanded && "rotate-180"
            )}
          />
        </button>
      ) : (
        <Link
          href={item.href}
          className={cn(
            "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
            isActive
              ? "text-green-700 bg-green-50"
              : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
          )}
        >
          {item.title}
        </Link>
      )}
      {/* Sub-menu children */}
      {hasChildren && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "max-h-96 mt-1" : "max-h-0"
          )}
        >
          {item.dropdownLabel && (
            <div className="ml-4 pl-3 mb-2">
              <p className="text-xs font-semibold text-green-700 border-b border-green-100 pb-2">{item.dropdownLabel}</p>
            </div>
          )}
          <div className={cn("pl-3 border-l-2 border-green-200 space-y-1", !item.dropdownLabel && "ml-4")}>
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex flex-col px-3 py-2.5 rounded-lg transition-colors",
                  pathname === child.href
                    ? "text-green-700 bg-green-50 font-medium"
                    : "text-gray-500 hover:text-green-700 hover:bg-gray-50"
                )}
              >
                <span className="flex items-center gap-2 text-sm">
                  <ChevronRight className="h-3 w-3 flex-shrink-0" />
                  {child.title}
                </span>
                {child.description && (
                  <span className="text-[11px] text-gray-400 ml-5 mt-0.5">{child.description}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSearchCommand = () => {
    window.dispatchEvent(new Event("open-search-command"));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white border-b border-gray-100"
      )}
    >
      {/* Top bar */}
      <div className="bg-green-700 text-white py-1.5 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>Pemerintah Kabupaten Ngada</span>
            </span>
          </div>

          {/* Operating Hours Indicator */}
          <OperatingHoursIndicator />

          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-green-200 transition-colors">
              Login Admin
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:text-green-200 transition-colors flex items-center gap-1.5"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <Image
                src="/logo-kabupaten.png"
                alt="Logo Kabupaten Ngada"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-green-800 text-sm md:text-base leading-tight">
                Disdukcapil
              </h1>
              <p className="text-xs text-gray-500">Kabupaten Ngada</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-1 transition-colors",
                        isActive(item.href)
                          ? "text-green-700 bg-green-50"
                          : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                      )}
                    >
                      {item.title}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className={cn(item.dropdownLabel ? "w-64" : "w-48")}>
                    {item.dropdownLabel && (
                      <div className="px-2 py-1.5 border-b border-gray-100 mb-1">
                        <p className="text-xs font-semibold text-green-700 leading-tight">{item.dropdownLabel}</p>
                      </div>
                    )}
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild className="py-2.5">
                        <Link
                          href={child.href}
                          className="w-full cursor-pointer flex flex-col"
                        >
                          <span className="font-medium">{child.title}</span>
                          {child.description && (
                            <span className="text-[11px] text-gray-400 mt-0.5">{child.description}</span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-green-700 bg-green-50"
                      : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                  )}
                >
                  {item.title}
                </Link>
              )
            )}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearchCommand}
              className="hidden md:flex"
              aria-label="Buka pencarian"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle - Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Buka menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0 overflow-y-auto">
                <SheetHeader className="border-b border-gray-100 px-4 py-4">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src="/logo-kabupaten.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-green-800 text-sm leading-tight">Disdukcapil</p>
                      <p className="text-xs text-gray-500">Kabupaten Ngada</p>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Nav Items */}
                <nav className="py-4 space-y-1">
                  {navigation.map((item) => (
                    <MobileNavItem
                      key={item.title}
                      item={item}
                      isActive={isActive(item.href)}
                      pathname={pathname}
                    />
                  ))}

                  {/* Search in Mobile — opens command palette */}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={openSearchCommand}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-500 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all"
                    >
                      <Search className="h-4 w-4" />
                      <span>Cari halaman, layanan, atau berita...</span>
                      <kbd className="ml-auto inline-flex items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
                        ⌘K
                      </kbd>
                    </button>
                  </div>

                  {/* Quick Links */}
                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                    <Link
                      href="/admin"
                      className="block px-4 py-2.5 text-sm text-center border border-green-700 text-green-700 rounded-lg hover:bg-green-50 font-medium transition-colors"
                    >
                      Login Admin
                    </Link>
                    {mounted && (
                      <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full px-4 py-2.5 text-sm text-center border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-2"
                        aria-label="Toggle theme"
                      >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
                      </button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>


      </div>
    </header>
  );
}
