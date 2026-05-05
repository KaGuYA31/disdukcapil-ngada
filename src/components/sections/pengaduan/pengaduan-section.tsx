"use client";

import { useState, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageCircle,
  Loader2,
  User,
  FileText,
  AtSign,
  Smartphone,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Info,
  RotateCcw,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    content: "Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT 86413",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/40",
  },
  {
    icon: Phone,
    title: "Telepon",
    content: "(0382) 21073",
    link: "tel:+6238221073",
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/40",
  },
  {
    icon: Mail,
    title: "Email",
    content: "disdukcapil@ngadakab.go.id",
    link: "mailto:disdukcapil@ngadakab.go.id",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/40",
  },
  {
    icon: Clock,
    title: "Jam Pelayanan",
    content: "Senin - Jumat: 08.00 - 15.00 WITA",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/40",
  },
];

const subjectOptions = [
  "Pertanyaan Umum",
  "Keluhan Pelayanan",
  "Informasi Layanan",
  "Saran & Masukan",
  "Lainnya",
];

// Animation variants
const sectionTitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const contactCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.1 + i * 0.08, ease: "easeOut" as const },
  }),
};

const formCardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.35, ease: "easeOut" as const },
  },
};

const successCardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function PengaduanSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (value.length === 0) return "Nama wajib diisi";
        if (value.length < 3) return "Nama minimal 3 karakter";
        return undefined;
      case "email":
        if (value.length === 0) return "Email wajib diisi";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Format email tidak valid";
        return undefined;
      case "phone": {
        const cleaned = value.replace(/[\s\-()]/g, "");
        if (cleaned.length === 0) return "No. telepon wajib diisi";
        if (!/^(\+62|62|08)\d{8,13}$/.test(cleaned))
          return "Format tidak valid (08xx atau +62xx)";
        return undefined;
      }
      case "subject":
        if (!value) return "Silakan pilih subjek pengaduan";
        if (value.length < 5) return "Subjek tidak valid";
        return undefined;
      case "message":
        if (value.length === 0) return "Pesan wajib diisi";
        if (value.length < 20) return "Pesan minimal 20 karakter";
        if (value.length > 1000) return "Pesan maksimal 1000 karakter";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = ["name", "email", "phone", "subject", "message"] as const;
    for (const field of fields) {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => {
        if (error) return { ...prev, [name]: error };
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev) => {
      if (error) return { ...prev, [name]: error };
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
    setTouched((prev) => ({ ...prev, subject: true }));
    const error = validateField("subject", value);
    setErrors((prev) => {
      if (error) return { ...prev, subject: error };
      const { subject: _, ...rest } = prev;
      return rest;
    });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      nik: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, email: true, phone: true, subject: true, message: true });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pengaduan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Pengaduan Berhasil Dikirim",
          description: "Terima kasih atas masukan Anda. Tim kami akan segera merespons.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal mengirim pengaduan",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <section className="relative py-16 md:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative gradient blob */}
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-green-200/30 dark:bg-green-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={successCardVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 dark:border-gray-700">
              {/* Animated checkmark with ring */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                {/* Animated ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
                  className="absolute inset-0 rounded-full border-4 border-green-200 dark:border-green-700"
                />
                {/* Confetti dots */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <motion.div
                    key={deg}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5 + i * 0.05,
                      ease: "easeOut" as const,
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        i % 3 === 0
                          ? "#16a34a"
                          : i % 3 === 1
                            ? "#f59e0b"
                            : "#f43f5e",
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-44px)`,
                    }}
                  />
                ))}
                {/* Check icon container */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="absolute inset-0 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3"
              >
                Pengaduan Berhasil Dikirim!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
              >
                Terima kasih atas masukan Anda. Tim kami akan segera meninjau
                dan merespons pengaduan Anda.
              </motion.p>

              {/* Estimated response time */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center justify-center gap-3">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Estimasi Waktu Respons
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      1–3 hari kerja melalui email atau telepon
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      nik: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                    setErrors({});
                    setTouched({});
                  }}
                  className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Pengaduan Lainnya
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative gradient blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-200/20 dark:bg-green-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-200/15 dark:bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-teal-200/10 dark:bg-teal-800/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-4">
            <motion.h2
              variants={sectionTitleVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            >
              Informasi Kontak
            </motion.h2>
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                custom={index}
                variants={contactCardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover={{ y: -2 }}
              >
                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <info.icon className={`h-5 w-5 ${info.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className={`text-sm ${info.color} hover:underline`}
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {info.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Quick Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 16 }
              }
              transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" as const }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-green-700 dark:bg-green-800 text-white border-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Butuh Respon Cepat?</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Hubungi kami langsung melalui WhatsApp untuk respon lebih
                    cepat
                  </p>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat via WhatsApp
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Vertical Divider on desktop */}
          <div className="hidden lg:block absolute left-1/3 top-8 bottom-8 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Complaint Form */}
          <div className="lg:col-span-2">
            <motion.div
              variants={formCardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 rounded-xl shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        Formulir Pengaduan
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        Isi formulir berikut untuk menyampaikan pengaduan Anda
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section: Data Pribadi */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 rounded-md flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                          Data Pribadi
                        </h3>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                            Nama Lengkap <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="name"
                              name="name"
                              placeholder="Masukkan nama lengkap"
                              value={formData.name}
                              onChange={handleChange}
                              onBlur={() => handleBlur("name")}
                              className={`pl-9 dark:bg-gray-900 dark:border-gray-600 ${touched.name && errors.name ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500" : ""}`}
                            />
                          </div>
                          {touched.name && errors.name && (
                            <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1.5">
                              <span className="inline-block w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nik" className="text-gray-700 dark:text-gray-300">
                            NIK <span className="text-gray-400 dark:text-gray-500 font-normal">(Opsional)</span>
                          </Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="nik"
                              name="nik"
                              placeholder="16 digit NIK"
                              value={formData.nik}
                              onChange={handleChange}
                              maxLength={16}
                              className="pl-9 dark:bg-gray-900 dark:border-gray-600"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="email@contoh.com"
                              value={formData.email}
                              onChange={handleChange}
                              onBlur={() => handleBlur("email")}
                              className={`pl-9 dark:bg-gray-900 dark:border-gray-600 ${touched.email && errors.email ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500" : ""}`}
                            />
                          </div>
                          {touched.email && errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1.5">
                              <span className="inline-block w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                            No. Telepon <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="08xxxxxxxxxx"
                              value={formData.phone}
                              onChange={handleChange}
                              onBlur={() => handleBlur("phone")}
                              className={`pl-9 dark:bg-gray-900 dark:border-gray-600 ${touched.phone && errors.phone ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500" : ""}`}
                            />
                          </div>
                          {touched.phone && errors.phone && (
                            <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1.5">
                              <span className="inline-block w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section: Detail Pengaduan */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/40 rounded-md flex items-center justify-center">
                          <MessageSquare className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                          Detail Pengaduan
                        </h3>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">
                            Subjek Pengaduan <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.subject}
                            onValueChange={handleSubjectChange}
                          >
                            <SelectTrigger className={`dark:bg-gray-900 dark:border-gray-600 ${touched.subject && errors.subject ? "border-red-500 dark:border-red-500" : ""}`}>
                              <SelectValue placeholder="Pilih subjek pengaduan" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjectOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {touched.subject && errors.subject && (
                            <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1.5">
                              <span className="inline-block w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                              {errors.subject}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
                              Pesan <span className="text-red-500">*</span>
                            </Label>
                            <span className={`text-xs tabular-nums ${formData.message.length > 1000 ? "text-red-500 font-semibold" : formData.message.length > 800 ? "text-amber-500" : "text-gray-400 dark:text-gray-500"}`}>
                              {formData.message.length}/1000
                            </span>
                          </div>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tuliskan pertanyaan, keluhan, atau saran Anda..."
                            rows={5}
                            maxLength={1000}
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={() => handleBlur("message")}
                            className={`dark:bg-gray-900 dark:border-gray-600 ${touched.message && errors.message ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {touched.message && errors.message && (
                            <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1.5">
                              <span className="inline-block w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                              {errors.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-sm text-green-800 dark:text-green-300">
                        <p className="font-semibold mb-1">Waktu Respons</p>
                        <p>
                          Pengaduan Anda akan ditangani dalam waktu 1–3 hari kerja.
                          Pastikan data kontak yang Anda berikan aktif dan dapat dihubungi.
                        </p>
                      </div>
                    </div>

                    {/* Privacy note */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Data Anda dilindungi dan hanya digunakan untuk keperluan pengaduan</span>
                    </div>

                    <div className="flex gap-3">
                      <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          type="submit"
                          className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 font-semibold h-12 text-base"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mengirim...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Kirim Pengaduan
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="h-12 px-5 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={isSubmitting}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
