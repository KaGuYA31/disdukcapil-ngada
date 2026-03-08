"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, Building2, Phone, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navigation = [
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
  { title: "Layanan", href: "/layanan" },
  { title: "Statistik", href: "/statistik" },
  { title: "Berita", href: "/berita" },
  { title: "Transparansi", href: "/transparansi" },
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/berita?q=${encodeURIComponent(searchQuery)}`;
    }
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
            <span className="flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              <span>(0382) 21073</span>
            </span>
          </div>
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
                  <DropdownMenuContent align="start" className="w-48">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link
                          href={child.href}
                          className="w-full cursor-pointer"
                        >
                          {child.title}
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
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isSearchOpen ? "max-h-16 pb-4" : "max-h-0"
          )}
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Cari berita atau informasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-green-700 hover:bg-green-800">
              <Search className="h-4 w-4 mr-2" />
              Cari
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-white border-t",
          isMenuOpen ? "max-h-[calc(100vh-5rem)]" : "max-h-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.title}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "text-green-700 bg-green-50"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                )}
              >
                {item.title}
              </Link>
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-green-700"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 border-t">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="search"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-green-700 hover:bg-green-800">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="pt-4 flex gap-2">
            <Link
              href="/admin"
              className="flex-1 text-center px-4 py-2 text-sm border border-green-700 text-green-700 rounded-md hover:bg-green-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Login Admin
            </Link>
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
