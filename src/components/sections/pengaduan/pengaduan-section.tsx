"use client";

import { useState, useRef } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle, Loader2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Phone,
    title: "Telepon",
    content: "(0382) 21073",
    link: "tel:+6238221073",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  {
    icon: Mail,
    title: "Email",
    content: "disdukcapil@ngadakab.go.id",
    link: "mailto:disdukcapil@ngadakab.go.id",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  {
    icon: Clock,
    title: "Jam Pelayanan",
    content: "Senin - Kamis: 08.00 - 15.30 WITA\nJumat: 08.00 - 16.00 WITA",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const contactCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.1 + i * 0.08, ease: "easeOut" },
  }),
};

const formCardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.35, ease: "easeOut" },
  },
};

const successCardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject) {
      toast({
        title: "Error",
        description: "Silakan pilih subjek pengaduan",
        variant: "destructive",
      });
      return;
    }

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
      <section className="relative py-16 md:py-24 bg-gray-50 overflow-hidden">
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
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-green-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={successCardVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
              {/* Animated checkmark with ring */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                {/* Animated ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-4 border-green-200"
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
                      ease: "easeOut",
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
                  className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-2xl font-bold text-gray-900 mb-3"
              >
                Pengaduan Berhasil Dikirim!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-gray-600 mb-6 leading-relaxed"
              >
                Terima kasih atas masukan Anda. Tim kami akan segera meninjau
                dan merespons pengaduan Anda.
              </motion.p>

              {/* Estimated response time */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center justify-center gap-3">
                  <Clock className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-green-800">
                      Estimasi Waktu Respons
                    </p>
                    <p className="text-sm text-green-700">
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
                  }}
                  className="bg-green-700 hover:bg-green-800 w-full"
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
      className="relative py-12 md:py-20 bg-gray-50 overflow-hidden"
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
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-4">
            <motion.h2
              variants={sectionTitleVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-xl font-bold text-gray-900 mb-6"
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
                <Card className="border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <info.icon className={`h-5 w-5 ${info.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
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
                          <p className="text-sm text-gray-600 whitespace-pre-line">
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
              transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-green-700 text-white border-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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
          <div className="hidden lg:block absolute left-1/3 top-8 bottom-8 w-px bg-gray-200" />

          {/* Complaint Form */}
          <div className="lg:col-span-2">
            <motion.div
              variants={formCardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-gray-200 rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Send className="h-4 w-4 text-green-600" />
                    </div>
                    Formulir Pengaduan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Masukkan nama lengkap"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nik">NIK (Opsional)</Label>
                        <Input
                          id="nik"
                          name="nik"
                          placeholder="16 digit NIK"
                          value={formData.nik}
                          onChange={handleChange}
                          maxLength={16}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@contoh.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          No. Telepon <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Subjek <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={handleSubjectChange}
                        required
                      >
                        <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Pesan <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tuliskan pertanyaan, keluhan, atau saran Anda..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                      <p>
                        <strong>Catatan:</strong> Pengaduan Anda akan ditangani
                        oleh tim kami dalam waktu 1-3 hari kerja. Pastikan data
                        kontak yang Anda berikan aktif dan dapat dihubungi.
                      </p>
                    </div>

                    <motion.div whileTap={{ scale: 0.98 }} className="block">
                      <Button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 font-semibold"
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
