"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Target, Users, History, MapPin, Printer, Eye, Compass, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { VisiMisiSection } from "@/components/sections/profil/visi-misi-section";
import { StrukturSection } from "@/components/sections/profil/struktur-section";
import { StrukturOrganisasiSection } from "@/components/sections/profil/struktur-organisasi";
import { SejarahSection } from "@/components/sections/profil/sejarah-section";
import { LokasiSection } from "@/components/sections/profil/lokasi-section";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const floatOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const validTabs = ["visi-misi", "struktur", "sejarah", "lokasi"] as const;
type TabValue = (typeof validTabs)[number];

const heroStats = [
  { icon: Eye, label: "Visi & Misi" },
  { icon: Users, label: "Struktur" },
  { icon: History, label: "Sejarah" },
  { icon: Compass, label: "Lokasi" },
];

const tabItems: { value: TabValue; icon: typeof Target; label: string }[] = [
  { value: "visi-misi", icon: Target, label: "Visi & Misi" },
  { value: "struktur", icon: Users, label: "Struktur Organisasi" },
  { value: "sejarah", icon: History, label: "Sejarah" },
  { value: "lokasi", icon: MapPin, label: "Lokasi Kantor" },
];

function getTabFromHash(): TabValue {
  if (typeof window === "undefined") return "visi-misi";
  const hash = window.location.hash.replace("#", "");
  if (validTabs.includes(hash as TabValue)) return hash as TabValue;
  return "visi-misi";
}

export default function ProfilPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabValue>(() => getTabFromHash());

  // Sync tab with URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = useCallback((value: TabValue) => {
    if (value === activeTab) return;
    setActiveTab(value);
    window.history.replaceState(null, "", `#${value}`);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Animated decorative gradient orbs */}
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"
          />
          <motion.div
            variants={floatOrb}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-green-400/15 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"
          />

          {/* Floating decorative shapes */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 right-[15%] w-4 h-4 bg-green-400/20 rounded-sm rotate-12 hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-16 left-[20%] w-3 h-3 bg-teal-300/20 rounded-full hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 right-[25%] w-2 h-2 bg-amber-300/20 rounded-full hidden lg:block"
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Breadcrumb
                    items={[
                      { label: "Beranda", href: "/" },
                      { label: "Profil Dinas" },
                    ]}
                  />
                </motion.div>

                {/* Section Label */}
                <motion.div variants={fadeInUp} className="mb-3">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                    <Building2 className="h-3.5 w-3.5 inline-block mr-1.5 -mt-0.5" />
                    PROFIL DINAS
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <Award className="h-6 w-6 md:h-7 md:w-7 text-green-200" />
                  </div>
                  Profil Dinas
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg md:text-xl leading-relaxed max-w-2xl">
                  Mengenal lebih dekat Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-green-200/80 mt-2">
                  Melayani dengan sepenuh hati untuk kemudahan akses layanan
                  administrasi kependudukan
                </motion.p>

                {/* Quick info pills in hero */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  {heroStats.map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 0.4 }}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15"
                      >
                        <StatIcon className="h-4 w-4 text-green-200" />
                        <span className="text-sm text-green-100 font-medium">{stat.label}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z" className="fill-white dark:fill-gray-950" />
            </svg>
          </div>
        </section>

        {/* Print Button */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                window.print();
                toast({ title: "Mencetak...", description: "Dialog cetak akan muncul", duration: 2000 });
              }}
              variant="outline"
              className="gap-2 print:hidden"
            >
              <Printer className="h-4 w-4" />
              Cetak Halaman
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div
          id="profil-tabs"
          className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <nav className="flex w-full overflow-x-auto rounded-none" role="tablist">
              {tabItems.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.value}`}
                    onClick={() => handleTabChange(tab.value)}
                    className={`
                      relative flex items-center gap-2 px-4 md:px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap
                      rounded-none border-0 shadow-none bg-transparent cursor-pointer
                      transition-colors duration-200 outline-none
                      ${
                        isActive
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }
                    `}
                  >
                    <tab.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                    {/* Active bottom indicator */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                        isActive
                          ? "bg-green-600 dark:bg-green-500 scale-x-100"
                          : "bg-transparent scale-x-0"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-950">
          <AnimatePresence mode="wait">
            {activeTab === "visi-misi" && (
              <motion.div
                key="visi-misi"
                id="panel-visi-misi"
                role="tabpanel"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <VisiMisiSection />
              </motion.div>
            )}

            {activeTab === "struktur" && (
              <motion.div
                key="struktur"
                id="panel-struktur"
                role="tabpanel"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <StrukturOrganisasiSection />
                <StrukturSection />
              </motion.div>
            )}

            {activeTab === "sejarah" && (
              <motion.div
                key="sejarah"
                id="panel-sejarah"
                role="tabpanel"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SejarahSection />
              </motion.div>
            )}

            {activeTab === "lokasi" && (
              <motion.div
                key="lokasi"
                id="panel-lokasi"
                role="tabpanel"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <LokasiSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
