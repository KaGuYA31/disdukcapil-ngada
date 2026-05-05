"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Bell, Calendar, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const benefits = [
  {
    icon: Mail,
    title: "Info Layanan Terbaru",
    description: "Dapatkan informasi terbaru tentang layanan kependudukan langsung ke email Anda.",
  },
  {
    icon: Bell,
    title: "Pengumuman Penting",
    description: "Tidak ketinggalan pengumuman penting dari Disdukcapil Ngada.",
  },
  {
    icon: Calendar,
    title: "Jadwal Pelayanan",
    description: "Informasi jadwal pelayanan dan perubahan jam operasional kantor.",
  },
];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email wajib diisi",
        description: "Silakan masukkan alamat email Anda.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Format email tidak valid",
        description: "Silakan masukkan alamat email yang benar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Mock subscription: store in localStorage
    try {
      const stored = localStorage.getItem("newsletter_subscriptions");
      const subscriptions: string[] = stored ? JSON.parse(stored) : [];

      if (subscriptions.includes(email)) {
        toast({
          title: "Email sudah terdaftar",
          description: "Anda sudah berlangganan informasi dari kami.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      subscriptions.push(email);
      localStorage.setItem("newsletter_subscriptions", JSON.stringify(subscriptions));

      toast({
        title: "Berhasil berlangganan!",
        description: "Terima kasih! Anda akan menerima informasi terbaru dari Disdukcapil Ngada.",
      });

      setEmail("");
    } catch {
      toast({
        title: "Berhasil berlangganan!",
        description: "Terima kasih! Anda akan menerima informasi terbaru dari Disdukcapil Ngada.",
      });
      setEmail("");
    }

    setIsSubmitting(false);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-teal-800" />
      {/* Decorative overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Heading */}
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-green-100 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Berlangganan
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4"
          >
            Tetap Terhubung dengan{" "}
            <span className="text-green-200">Informasi Terkini</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-green-100 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Dapatkan update terbaru tentang layanan kependudukan, pengumuman penting, dan
            jadwal pelayanan Disdukcapil Kabupaten Ngada langsung ke inbox Anda.
          </motion.p>

          {/* Email subscription form */}
          <motion.div variants={scaleIn} className="mb-12">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Masukkan alamat email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/95 backdrop-blur-sm border-white/20 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/40 rounded-xl"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 bg-white text-green-700 hover:bg-green-50 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Berlangganan
                  </span>
                )}
              </Button>
            </form>
            <p className="text-green-200/70 text-xs mt-3">
              Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.
            </p>
          </motion.div>

          {/* Benefit cards */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-3 gap-4 md:gap-6"
          >
            {benefits.map((benefit) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.div key={benefit.title} variants={fadeInUp}>
                  <Card className="bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="p-5 md:p-6 text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BenefitIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-sm md:text-base mb-1.5">
                        {benefit.title}
                      </h3>
                      <p className="text-green-100 text-xs md:text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
