"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

interface StaffMember {
  name: string;
  initials: string;
  position: string;
  nip: string;
}

interface SubSection {
  title: string;
  position: string;
  nip: string;
  initial: string;
  staff: StaffMember[];
}

const kepalaDinas = {
  name: "Kepala Dinas",
  fullName: "Drs. ....................., M.Si",
  position: "Kepala Dinas Kependudukan dan Pencatatan Sipil",
  nip: "NIP. ............................",
  initial: "KD",
};

const subSections: SubSection[] = [
  {
    title: "Kasubag Pendaftaran Penduduk",
    position: "Kepala Sub Bagian Pendaftaran Penduduk",
    nip: "NIP. ............................",
    initial: "PP",
    staff: [
      { name: "....................., S.Sos", initials: "KS", position: "Kepala Seksi Pendaftaran", nip: "NIP. ............" },
      { name: "....................., S.AP", initials: "S1", position: "Staf Pendaftaran", nip: "NIP. ............" },
      { name: "....................., A.Md", initials: "S2", position: "Staf Pendaftaran", nip: "NIP. ............" },
      { name: "....................., S.Kom", initials: "PL", position: "Pelaksana", nip: "NIP. ............" },
    ],
  },
  {
    title: "Kasubag Pencatatan Sipil",
    position: "Kepala Sub Bagian Pencatatan Sipil",
    nip: "NIP. ............................",
    initial: "PS",
    staff: [
      { name: "....................., S.H", initials: "KS", position: "Kepala Seksi Pencatatan", nip: "NIP. ............" },
      { name: "....................., S.Sos", initials: "S1", position: "Staf Pencatatan Sipil", nip: "NIP. ............" },
      { name: "....................., A.Md", initials: "S2", position: "Staf Pencatatan Sipil", nip: "NIP. ............" },
      { name: "....................., S.Kom", initials: "PL", position: "Pelaksana", nip: "NIP. ............" },
    ],
  },
  {
    title: "Kasubag Inovasi & TI",
    position: "Kepala Sub Bagian Inovasi dan Teknologi Informasi",
    nip: "NIP. ............................",
    initial: "IT",
    staff: [
      { name: "....................., S.Kom", initials: "KS", position: "Kepala Seksi IT", nip: "NIP. ............" },
      { name: "....................., S.T", initials: "S1", position: "Staf Pengembangan", nip: "NIP. ............" },
      { name: "....................., S.Kom", initials: "S2", position: "Staf Infrastruktur", nip: "NIP. ............" },
      { name: "....................., A.Md", initials: "PL", position: "Pelaksana", nip: "NIP. ............" },
    ],
  },
];

function AvatarCircle({ initials, size = "md", className = "" }: { initials: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-2xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold flex items-center justify-center flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}

function StaffCard({ member, index }: { member: StaffMember; index: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <AvatarCircle initials={member.initials} size="sm" className="group-hover:from-green-600 group-hover:to-green-800 transition-all duration-200" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
          <p className="text-xs text-green-700 font-medium truncate">{member.position}</p>
          <p className="text-xs text-gray-400 mt-0.5">{member.nip}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function StrukturOrganisasiSection() {
  return (
    <section id="struktur-organisasi" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              Struktur Organisasi
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900">
            Bagan Organisasi Dinas
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 mt-4">
            Struktur organisasi Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada
          </motion.p>
        </motion.div>

        {/* Organizational Tree */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          {/* Kepala Dinas Card */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <div className="relative">
              {/* Gradient border wrapper */}
              <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-green-400 via-green-600 to-green-800" />
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  {/* Photo placeholder */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center ring-4 ring-green-100">
                      <span className="text-white font-bold text-3xl md:text-4xl">
                        {kepalaDinas.initial}
                      </span>
                    </div>
                    {/* Decorative badge */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    {kepalaDinas.fullName}
                  </h3>
                  <p className="text-green-700 font-semibold text-sm mt-1">
                    {kepalaDinas.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 max-w-xs">
                    {kepalaDinas.position}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {kepalaDinas.nip}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vertical connector from Kepala to horizontal line */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-0.5 h-10 bg-gradient-to-b from-green-500 to-green-300" />
            <div className="w-full max-w-4xl h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent" />
          </div>

          {/* 3 Sub-section cards in grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {subSections.map((section, sectionIndex) => (
              <motion.div key={sectionIndex} variants={fadeInUp} className="flex flex-col">
                {/* Vertical connector from horizontal line to kasubag card */}
                <div className="flex justify-center mb-6">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-green-300 to-green-200" />
                </div>

                {/* Kasubag Card */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-br from-green-300 via-green-500 to-green-600 opacity-80" />
                    <div className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="flex flex-col items-center text-center">
                        <AvatarCircle initials={section.initial} size="lg" className="mb-3 ring-3 ring-green-50" />
                        <h4 className="font-bold text-gray-900 text-sm">
                          {section.title}
                        </h4>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {section.position}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {section.nip}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Vertical connector from kasubag to staff */}
                <div className="flex justify-center mb-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-green-200 to-green-100" />
                </div>

                {/* Staff cards */}
                <motion.div
                  variants={staggerContainer}
                  className="space-y-3"
                >
                  {section.staff.map((member, memberIndex) => (
                    <StaffCard key={memberIndex} member={member} index={memberIndex} />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
