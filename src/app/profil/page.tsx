"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Target, Users, History, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

function getTabFromHash(): TabValue {
  if (typeof window === "undefined") return "visi-misi";
  const hash = window.location.hash.replace("#", "");
  if (validTabs.includes(hash as TabValue)) return hash as TabValue;
  return "visi-misi";
}

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<TabValue>(() => getTabFromHash());

  // Sync tab with URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabValue);
    window.history.replaceState(null, "", `#${value}`);
    // Scroll to tabs area smoothly
    const tabsEl = document.getElementById("profil-tabs");
    if (tabsEl) {
      tabsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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

        {/* Tabs Navigation */}
        <div
          id="profil-tabs"
          className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="w-full h-auto bg-transparent p-0 overflow-x-auto rounded-none gap-0">
                <TabTriggerItem
                  value="visi-misi"
                  icon={Target}
                  label="Visi & Misi"
                  isActive={activeTab === "visi-misi"}
                />
                <TabTriggerItem
                  value="struktur"
                  icon={Users}
                  label="Struktur Organisasi"
                  isActive={activeTab === "struktur"}
                />
                <TabTriggerItem
                  value="sejarah"
                  icon={History}
                  label="Sejarah"
                  isActive={activeTab === "sejarah"}
                />
                <TabTriggerItem
                  value="lokasi"
                  icon={MapPin}
                  label="Lokasi Kantor"
                  isActive={activeTab === "lokasi"}
                />
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              {activeTab === "visi-misi" && (
                <TabsContent value="visi-misi" forceMount asChild>
                  <motion.div
                    key="visi-misi"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <VisiMisiSection />
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "struktur" && (
                <TabsContent value="struktur" forceMount asChild>
                  <motion.div
                    key="struktur"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <StrukturOrganisasiSection />
                    <StrukturSection />
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "sejarah" && (
                <TabsContent value="sejarah" forceMount asChild>
                  <motion.div
                    key="sejarah"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <SejarahSection />
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "lokasi" && (
                <TabsContent value="lokasi" forceMount asChild>
                  <motion.div
                    key="lokasi"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <LokasiSection />
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

/** Custom tab trigger item with icon and active styling */
function TabTriggerItem({
  value,
  icon: Icon,
  label,
  isActive,
}: {
  value: string;
  icon: typeof Target;
  label: string;
  isActive: boolean;
}) {
  return (
    <TabsTrigger
      value={value}
      className={`
        relative flex items-center gap-2 px-4 md:px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap
        rounded-none border-0 shadow-none bg-transparent
        transition-colors duration-200
        ${
          isActive
            ? "text-green-700"
            : "text-gray-500 hover:text-gray-700"
        }
        data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0
        focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0
      `}
    >
      <Icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
      <span>{label}</span>
      {/* Active bottom indicator */}
      {isActive && (
        <motion.div
          layoutId="active-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </TabsTrigger>
  );
}
