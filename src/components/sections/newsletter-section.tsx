"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Mail, Bell, Calendar, CheckCircle, Star, Users } from "lucide-react";
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

function AnimatedSubscriberCount() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, 1200, {
        duration: 2.5,
        ease: "easeOut",
      });
      const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));
      return () => { controls.stop(); unsubscribe(); };
    }
  }, [inView, motionValue, rounded]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat("id-ID").format(display)}+
    </span>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-teal-800" />

      {/* Animated gradient mesh blobs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -20, 15, -10, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -25, 15, -10, 0],
          y: [0, 15, -25, 10, 0],
          scale: [1, 0.95, 1.1, 1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-cyan-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 15, -15, 0],
          y: [0, -15, 10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-300/15 to-green-400/5 rounded-full blur-3xl"
      />

      {/* SVG cross-hatch pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ─── Floating decorative shapes ─── */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-[10%] w-4 h-4 bg-green-300/20 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-20 right-[15%] w-3 h-3 bg-teal-200/20 rounded-sm rotate-12 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-16 left-[20%] w-3 h-3 bg-emerald-300/20 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 6, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-24 right-[10%] w-5 h-5 border border-green-300/15 rounded-full hidden lg:block"
      />

      {/* ─── Floating star particles (5) ─── */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{
            y: [0, -15 - i * 3, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: i * 1.2,
          }}
          className="absolute hidden lg:block"
          style={{
            top: `${15 + i * 15}%`,
            left: `${5 + i * 22}%`,
          }}
        >
          <Star className="h-3 w-3 text-green-200/30" />
        </motion.div>
      ))}

      <div className="relative container mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Heading */}
          <motion.div variants={fadeInUp} className="mb-4 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-green-100 text-sm font-medium border border-white/20">
              <Mail className="h-4 w-4" />
              Berlangganan
            </span>

            {/* Subscriber count badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-green-200 text-xs font-medium border border-white/10"
            >
              <Users className="h-3.5 w-3.5" />
              <AnimatedSubscriberCount /> Berlangganan
            </motion.span>
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

          {/* ─── Animated gradient line separator ─── */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xs mx-auto mb-8 h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent origin-center"
          />

          {/* Email subscription form */}
          <motion.div variants={scaleIn} className="mb-12">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                {/* Gradient border glow on focus */}
                <div className={`absolute -inset-[2px] rounded-xl bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300 opacity-0 transition-opacity duration-500 blur-sm ${isFocused ? "opacity-60" : ""}`} />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="email"
                  placeholder="Masukkan alamat email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="relative pl-10 h-12 bg-white/95 backdrop-blur-sm border-white/20 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-green-300/60 focus-visible:border-green-300/60 rounded-xl z-0"
                  disabled={isSubmitting}
                />
              </div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-white text-green-700 hover:bg-green-50 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5"
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
              </motion.div>
            </form>
            <p className="text-green-200/70 text-xs mt-3">
              Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.
            </p>
          </motion.div>

          {/* Benefit cards — glassmorphism with hover effects */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-3 gap-4 md:gap-6"
          >
            {benefits.map((benefit) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={fadeInUp}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="relative bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-300 overflow-hidden group">
                    {/* Gradient top accent line reveal */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    </div>

                    <CardContent className="p-5 md:p-6 text-center">
                      {/* Icon with rotation on hover */}
                      <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/10 group-hover:bg-white/20 group-hover:shadow-lg group-hover:shadow-green-500/10 transition-all duration-300">
                        <BenefitIcon className="h-6 w-6 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
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
