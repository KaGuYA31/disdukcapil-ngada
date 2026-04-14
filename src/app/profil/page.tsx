"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Target, Users, History, MapPin, Printer } from "lucide-react";
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
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-400/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

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
                <motion.div
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4"
                >
                  <Building2 className="h-4 w-4 text-green-200" />
                  <span className="text-sm font-semibold tracking-wider text-green-100">
                    PROFIL DINAS
                  </span>
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold mb-2"
                >
                  Profil Dinas
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-green-100 text-lg">
                  Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
                </motion.p>
                <motion.p variants={fadeInUp} className="text-green-200 mt-2">
                  Melayani dengan sepenuh hati untuk kemudahan akses layanan
                  administrasi kependudukan
                </motion.p>
              </motion.div>
            </div>
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
