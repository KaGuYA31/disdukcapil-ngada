"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Heart,
  BarChart3,
  FileCheck2,
  GraduationCap,
  Briefcase,
  Calendar,
  PieChart,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Hardcoded Infographic Data (Realistic estimates for Kabupaten Ngada) ──
const infographicData = {
  gender: { lakiLaki: 51.2, perempuan: 48.8 },
  ageGroups: [
    { range: "0-14", percentage: 28.5 },
    { range: "15-24", percentage: 17.2 },
    { range: "25-34", percentage: 16.8 },
    { range: "35-44", percentage: 13.5 },
    { range: "45-54", percentage: 10.8 },
    { range: "55-64", percentage: 7.6 },
    { range: "65+", percentage: 5.6 },
  ],
  documents: [
    { name: "KTP-el", coverage: 85.2 },
    { name: "Kartu Keluarga", coverage: 90.1 },
    { name: "Akta Lahir", coverage: 78.4 },
    { name: "KIA", coverage: 65.3 },
  ],
  religions: [
    { name: "Katolik", percentage: 52.8, color: "bg-violet-500" },
    { name: "Protestan", percentage: 21.3, color: "bg-emerald-500" },
    { name: "Islam", percentage: 18.5, color: "bg-teal-500" },
    { name: "Hindu", percentage: 3.2, color: "bg-orange-500" },
    { name: "Buddha", percentage: 1.5, color: "bg-amber-500" },
    { name: "Lainnya", percentage: 2.7, color: "bg-gray-400 dark:bg-gray-500" },
  ],
  education: [
    { level: "SD/Sederajat", percentage: 35.2 },
    { level: "SMP/Sederajat", percentage: 22.1 },
    { level: "SMA/Sederajat", percentage: 18.5 },
    { level: "D1-D3", percentage: 10.3 },
    { level: "D4/S1", percentage: 9.8 },
    { level: "S2/S3", percentage: 4.1 },
  ],
  employment: [
    { sector: "Pertanian", percentage: 38.5, icon: "🌾" },
    { sector: "Perdagangan", percentage: 18.2, icon: "🏪" },
    { sector: "Jasa", percentage: 15.8, icon: "💼" },
    { sector: "Konstruksi", percentage: 12.3, icon: "🏗️" },
    { sector: "Pemerintahan", percentage: 8.7, icon: "🏛️" },
    { sector: "Lainnya", percentage: 6.5, icon: "📋" },
  ],
};

// ─── Animation Variants ──────────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 25 },
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
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Glass Card Wrapper ─────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`relative border-white/60 dark:border-gray-700/40 shadow-sm hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 bg-white/70 dark:bg-gray-800/50 backdrop-blur-md overflow-hidden group ${className}`}
    >
      {/* Top accent gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-green-400/40 via-emerald-400/60 to-teal-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </Card>
  );
}

// ─── Card 1: Gender Distribution ────────────────────────────────────
function GenderCard({ inView }: { inView: boolean }) {
  const { lakiLaki, perempuan } = infographicData.gender;

  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <PieChart className="h-4 w-4 text-white" />
            </div>
            Distribusi Jenis Kelamin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visual pie representation using conic gradient */}
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-32 h-32">
              <div
                className="w-full h-full rounded-full shadow-inner"
                style={{
                  background: `conic-gradient(
                    rgb(20 184 166) 0% ${lakiLaki}%, 
                    rgb(244 114 182) ${lakiLaki}% 100%
                  )`,
                }}
              />
              <div className="absolute inset-3 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mx-auto mb-0.5" />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {/* Male */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  Laki-laki
                </span>
              </div>
              <motion.span
                className="text-sm font-bold text-teal-700 dark:text-teal-300"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {lakiLaki}%
              </motion.span>
            </div>

            {/* Visual bar for male */}
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: `${lakiLaki}%` } : {}}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" as const }}
              />
            </div>

            {/* Female */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-pink-500 dark:text-pink-400" />
                  Perempuan
                </span>
              </div>
              <motion.span
                className="text-sm font-bold text-pink-600 dark:text-pink-300"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {perempuan}%
              </motion.span>
            </div>

            {/* Visual bar for female */}
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: `${perempuan}%` } : {}}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" as const }}
              />
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}

// ─── Card 2: Age Group Distribution ─────────────────────────────────
function AgeGroupCard({ inView }: { inView: boolean }) {
  const maxPercentage = Math.max(...infographicData.ageGroups.map((g) => g.percentage));

  const barColors = [
    "from-emerald-400 to-emerald-600",
    "from-teal-400 to-teal-600",
    "from-green-400 to-green-600",
    "from-emerald-500 to-teal-500",
    "from-green-500 to-emerald-500",
    "from-teal-500 to-green-500",
    "from-gray-400 to-gray-500",
  ];

  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Distribusi Usia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {infographicData.ageGroups.map((group, i) => (
            <div key={group.range} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-14">
                  {group.range}
                </span>
                <motion.span
                  className="text-xs font-bold text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                >
                  {group.percentage}%
                </motion.span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700/80 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${barColors[i]} rounded-full`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(group.percentage / maxPercentage) * 100}%` } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + i * 0.1,
                    ease: "easeOut" as const,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}

// ─── Card 3: Document Coverage ──────────────────────────────────────
function DocumentCoverageCard({ inView }: { inView: boolean }) {
  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
              <FileCheck2 className="h-4 w-4 text-white" />
            </div>
            Cakupan Kepemilikan Dokumen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {infographicData.documents.map((doc, i) => (
            <div key={doc.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {doc.name}
                </span>
                <motion.span
                  className="text-sm font-bold text-green-700 dark:text-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
                >
                  {doc.coverage}%
                </motion.span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700/80 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${doc.coverage}%` } : {}}
                  transition={{
                    duration: 1.2,
                    delay: 0.4 + i * 0.15,
                    ease: "easeOut" as const,
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                </motion.div>
              </div>
            </div>
          ))}

          {/* Summary note */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
              Data estimasi cakupan kependudukan
            </p>
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}

// ─── Card 4: Religion Distribution ──────────────────────────────────
function ReligionCard({ inView }: { inView: boolean }) {
  const maxPercentage = Math.max(...infographicData.religions.map((r) => r.percentage));

  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Landmark className="h-4 w-4 text-white" />
            </div>
            Distribusi Agama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {infographicData.religions.map((religion, i) => (
            <div key={religion.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${religion.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {religion.name}
                  </span>
                </div>
                <motion.span
                  className="text-xs font-bold text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                >
                  {religion.percentage}%
                </motion.span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700/80 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${religion.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(religion.percentage / maxPercentage) * 100}%` } : {}}
                  transition={{
                    duration: 0.9,
                    delay: 0.3 + i * 0.1,
                    ease: "easeOut" as const,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}

// ─── Card 5: Education Distribution ─────────────────────────────────
function EducationCard({ inView }: { inView: boolean }) {
  const maxPercentage = Math.max(...infographicData.education.map((e) => e.percentage));

  const eduColors = [
    "from-amber-400 to-amber-600",
    "from-yellow-400 to-yellow-600",
    "from-orange-400 to-orange-500",
    "from-emerald-400 to-emerald-600",
    "from-teal-400 to-teal-600",
    "from-green-500 to-green-700",
  ];

  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            Tingkat Pendidikan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {infographicData.education.map((edu, i) => (
            <div key={edu.level} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate mr-2">
                  {edu.level}
                </span>
                <motion.span
                  className="text-xs font-bold text-gray-700 dark:text-gray-300 flex-shrink-0"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                >
                  {edu.percentage}%
                </motion.span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700/80 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${eduColors[i]} rounded-full`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(edu.percentage / maxPercentage) * 100}%` } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + i * 0.1,
                    ease: "easeOut" as const,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}

// ─── Card 6: Employment Distribution ────────────────────────────────
function EmploymentCard({ inView }: { inView: boolean }) {
  const dotColors = [
    "bg-green-500",
    "bg-teal-500",
    "bg-amber-500",
    "bg-orange-500",
    "bg-emerald-500",
    "bg-gray-400 dark:bg-gray-500",
  ];

  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-sm">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            Lapangan Usaha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {infographicData.employment.map((emp, i) => (
            <motion.div
              key={emp.sector}
              className="flex items-center gap-3 group/emp"
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.3 + i * 0.1,
                ease: "easeOut" as const,
              }}
            >
              <span className="text-base flex-shrink-0">{emp.icon}</span>
              <div
                className={`w-2.5 h-2.5 rounded-full ${dotColors[i]} flex-shrink-0 shadow-sm`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                {emp.sector}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Mini bar */}
                <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
                  <motion.div
                    className={`h-full ${dotColors[i]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${emp.percentage}%` } : {}}
                    transition={{
                      duration: 0.8,
                      delay: 0.5 + i * 0.1,
                      ease: "easeOut" as const,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12 text-right">
                  {emp.percentage}%
                </span>
              </div>
            </motion.div>
          ))}

          {/* Total bar */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">Total sektor tercatat</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">100%</span>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export function InfografisRingkasanSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 relative overflow-hidden"
      aria-labelledby="infografis-ringkasan-title"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-teal-50/20 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-green-100/20 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/10 dark:bg-emerald-900/5 rounded-full blur-3xl" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%230f766e'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative">
        {/* ─── Section Header ─── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">
            <BarChart3 className="h-4 w-4" />
            Infografis Kependudukan
          </span>
          <h2
            id="infografis-ringkasan-title"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2"
          >
            Infografis Kependudukan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Ringkasan data statistik penduduk Kabupaten Ngada
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge
              variant="outline"
              className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 text-xs font-medium gap-1.5"
            >
              <Calendar className="h-3 w-3" />
              Periode 2024
            </Badge>
            <Badge
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 text-xs font-medium"
            >
              Data Estimasi
            </Badge>
          </div>
        </motion.div>

        {/* ─── Infographic Cards Grid ─── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          <GenderCard inView={isInView} />
          <AgeGroupCard inView={isInView} />
          <DocumentCoverageCard inView={isInView} />
          <ReligionCard inView={isInView} />
          <EducationCard inView={isInView} />
          <EmploymentCard inView={isInView} />
        </motion.div>

        {/* ─── Footer note ─── */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Sumber: Data estimasi berdasarkan sensus dan registrasi kependudukan Kabupaten Ngada
          </p>
        </motion.div>
      </div>
    </section>
  );
}
