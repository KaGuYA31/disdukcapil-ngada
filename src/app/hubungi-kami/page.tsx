"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Building2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CONTACT_INFO, OPERATING_HOURS, LOCATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ─── Animation Variants ─── */

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

/* ─── Contact Info Cards Data ─── */

const contactCards = [
  {
    icon: Phone,
    title: "Telepon",
    value: CONTACT_INFO.phone,
    href: `tel:${CONTACT_INFO.phoneRaw}`,
    actionLabel: "Hubungi",
    color: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    glassBg:
      "hover:bg-blue-50/80 dark:hover:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/40",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: CONTACT_INFO.whatsappDisplay,
    href: CONTACT_INFO.whatsappUrl,
    actionLabel: "Chat",
    color: "from-green-500 to-green-600",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    glassBg:
      "hover:bg-green-50/80 dark:hover:bg-green-950/30 border-green-200/50 dark:border-green-800/40",
  },
  {
    icon: Mail,
    title: "Email",
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
    actionLabel: "Kirim Email",
    color: "from-amber-500 to-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    glassBg:
      "hover:bg-amber-50/80 dark:hover:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/40",
  },
  {
    icon: MapPin,
    title: "Alamat",
    value: CONTACT_INFO.address,
    href: LOCATION.googleMapsUrl,
    actionLabel: "Buka Peta",
    color: "from-rose-500 to-rose-600",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    glassBg:
      "hover:bg-rose-50/80 dark:hover:bg-rose-950/30 border-rose-200/50 dark:border-rose-800/40",
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    value: `${OPERATING_HOURS.weekdays.hours} WITA`,
    href: undefined,
    actionLabel: undefined,
    color: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    glassBg:
      "hover:bg-purple-50/80 dark:hover:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/40",
    extra: (
      <span className="text-xs text-muted-foreground">
        Sabtu &amp; Minggu: Tutup
      </span>
    ),
  },
];

/* ─── Form Subject Options ─── */

const subjectOptions = [
  "Informasi Layanan",
  "Pengaduan Pelayanan",
  "Informasi Dokumen",
  "Pertanyaan Umum",
  "Saran & Masukan",
  "Lainnya",
];

/* ─── Form State Type ─── */

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

/* ─── Contact Form Component ─── */

function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = "Nama wajib diisi";
    }
    if (!formData.email.trim()) {
      errs.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Format email tidak valid";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Nomor telepon wajib diisi";
    }
    if (!formData.subject) {
      errs.subject = "Subjek wajib dipilih";
    }
    if (!formData.message.trim()) {
      errs.message = "Pesan wajib diisi";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Pesan minimal 10 karakter";
    }

    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast.success("Pesan berhasil dikirim!", {
      description:
        "Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.",
      duration: 5000,
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
  }

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
    >
      {/* Form header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Send className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Kirim Pesan</h2>
            <p className="text-green-100 text-sm">
              Isi formulir di bawah untuk mengirim pesan kepada kami
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
        {/* Name & Email row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-name"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={cn(errors.name && "border-red-500 focus-visible:ring-red-500/20")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="contoh@email.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={cn(errors.email && "border-red-500 focus-visible:ring-red-500/20")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="contact-phone">
            Nomor Telepon <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={cn(errors.phone && "border-red-500 focus-visible:ring-red-500/20")}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label>
            Subjek <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.subject}
            onValueChange={(value) => updateField("subject", value)}
          >
            <SelectTrigger
              className={cn(
                "w-full",
                errors.subject && "border-red-500 focus-visible:ring-red-500/20"
              )}
            >
              <SelectValue placeholder="Pilih subjek pesan" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="contact-message">
            Pesan <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="contact-message"
            placeholder="Tulis pesan Anda di sini..."
            rows={5}
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={cn(errors.message && "border-red-500 focus-visible:ring-red-500/20")}
          />
          {errors.message && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold h-11 px-8"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Send className="h-4 w-4" />
              </motion.div>
              Mengirim...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Kirim Pesan
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

/* ─── Map Section Component ─── */

function MapSection() {
  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
          <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Lokasi Kantor
          </h2>
          <p className="text-sm text-muted-foreground">
            Temukan kami di peta
          </p>
        </div>
      </div>

      {/* Map iframe */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0!2d${LOCATION.coordinates.longitude}!3d${LOCATION.coordinates.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${Math.abs(LOCATION.coordinates.latitude)}%C2%B0S+${LOCATION.coordinates.longitude}%C2%B0E!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid`}
          width="100%"
          height="360"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi Kantor Disdukcapil Kabupaten Ngada"
          className="w-full"
        />
      </div>

      {/* Office info overlay card */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50/60 dark:bg-green-950/20">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {LOCATION.name}
            </h3>
            <p className="text-sm text-muted-foreground">{LOCATION.address}</p>
            <p className="text-sm text-muted-foreground">
              {LOCATION.regency} {LOCATION.postalCode}
            </p>
            <a
              href={LOCATION.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400 font-medium hover:underline"
            >
              Buka di Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Main Page Component ─── */

export default function HubungiKamiPage() {
  return (
    <main id="main-content" className="flex-1">
      {/* ─── Hero Banner ─── */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-16 md:py-20 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative gradient orbs */}
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
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 right-[12%] w-4 h-4 bg-green-400/20 rounded-sm rotate-12 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute bottom-20 left-[15%] w-3 h-3 bg-teal-300/20 rounded-full hidden lg:block"
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
                    { label: "Hubungi Kami" },
                  ]}
                />
              </motion.div>

              <motion.div variants={fadeInUp} className="mb-3">
                <span className="inline-block bg-white/15 backdrop-blur-sm text-green-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20">
                  Hubungi Kami
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3"
              >
                <Phone className="h-9 w-9 md:h-11 md:w-11 text-green-200" />
                Hubungi Kami
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-green-100 text-lg md:text-xl leading-relaxed"
              >
                Kami siap membantu Anda. Hubungi kami melalui telepon, WhatsApp,
                email, atau kunjungi langsung kantor kami.
              </motion.p>

              {/* Quick Contact Stats */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                  <Phone className="h-5 w-5 text-green-200 mx-auto mb-1.5" />
                  <p className="text-xs text-green-200 mb-0.5">Telepon</p>
                  <p className="text-sm font-semibold">{CONTACT_INFO.phone}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                  <MessageCircle className="h-5 w-5 text-green-200 mx-auto mb-1.5" />
                  <p className="text-xs text-green-200 mb-0.5">WhatsApp</p>
                  <p className="text-sm font-semibold">
                    {CONTACT_INFO.whatsappDisplay}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center col-span-2 sm:col-span-1">
                  <Clock className="h-5 w-5 text-green-200 mx-auto mb-1.5" />
                  <p className="text-xs text-green-200 mb-0.5">Jam Operasional</p>
                  <p className="text-sm font-semibold">
                    {OPERATING_HOURS.weekdays.shortHours} WITA
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z"
              className="fill-white dark:fill-gray-950"
            />
          </svg>
        </div>
      </section>

      {/* ─── Contact Info Cards Section ─── */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Section header */}
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-3">
                Informasi Kontak
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Cara Menghubungi Kami
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Pilih cara yang paling nyaman untuk Anda menghubungi Disdukcapil
                Kabupaten Ngada
              </p>
            </motion.div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {contactCards.map((card) => {
                const CardIcon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeInUp}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card
                      className={cn(
                        "group relative overflow-hidden transition-all duration-300 border backdrop-blur-sm bg-white/70 dark:bg-gray-900/70",
                        card.glassBg
                      )}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                              card.iconBg
                            )}
                          >
                            <CardIcon className={cn("h-5 w-5", card.iconColor)} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                              {card.title}
                            </h3>
                            <p className="text-sm text-muted-foreground break-all">
                              {card.value}
                            </p>
                            {card.extra}
                          </div>
                        </div>

                        {/* Action button */}
                        {card.href && (
                          <a
                            href={card.href}
                            target={
                              card.title === "WhatsApp" ? "_blank" : undefined
                            }
                            rel={
                              card.title === "WhatsApp"
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                          >
                            {card.actionLabel}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </CardContent>

                      {/* Decorative gradient accent */}
                      <div
                        className={cn(
                          "absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-bl-[40px] -translate-y-1/3 translate-x-1/3 transition-opacity duration-300 group-hover:opacity-20",
                          card.color
                        )}
                      />
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Form & Map Section ─── */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Section header */}
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-3">
                Pesan & Lokasi
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Kirim Pesan atau Kunjungi Kami
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Sampaikan pertanyaan atau keluhan Anda melalui formulir di bawah,
                atau kunjungi langsung kantor kami
              </p>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left: Contact Form */}
              <ContactForm />

              {/* Right: Map */}
              <MapSection />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Additional Help Section ─── */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <span className="inline-block bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-3">
                Bantuan Lainnya
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Butuh Bantuan Lainnya?
              </h2>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5"
            >
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Respon Cepat via WhatsApp
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Untuk respons tercepat, hubungi kami langsung melalui
                    WhatsApp pada jam kerja.
                  </p>
                  <a
                    href={CONTACT_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat Sekarang
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Datang Langsung
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Anda juga dapat mengunjungi kantor kami pada hari kerja untuk
                    mendapatkan pelayanan langsung.
                  </p>
                  <a
                    href={LOCATION.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    Lihat Lokasi
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
