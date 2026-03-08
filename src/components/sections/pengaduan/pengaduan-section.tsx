"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
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
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Mail,
    title: "Email",
    content: "disdukcapil@ngadakab.go.id",
    link: "mailto:disdukcapil@ngadakab.go.id",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Clock,
    title: "Jam Pelayanan",
    content: "Senin - Kamis: 08.00 - 15.30 WITA\nJumat: 08.00 - 16.00 WITA",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
];

const subjectOptions = [
  "Pertanyaan Umum",
  "Keluhan Pelayanan",
  "Informasi Layanan",
  "Saran & Masukan",
  "Lainnya",
];

export function PengaduanSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pengaduan Berhasil Dikirim
            </h2>
            <p className="text-gray-600 mb-6">
              Terima kasih atas masukan Anda. Tim kami akan merespons dalam
              waktu 1-3 hari kerja melalui email atau telepon yang Anda
              berikan.
            </p>
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
              className="bg-green-700 hover:bg-green-800"
            >
              Kirim Pengaduan Lainnya
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Informasi Kontak
            </h2>
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <info.icon className={`h-5 w-5 ${info.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{info.title}</h3>
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
            ))}

            {/* Quick Contact CTA */}
            <Card className="bg-green-700 text-white border-0">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Butuh Respon Cepat?</h3>
                <p className="text-green-100 text-sm mb-4">
                  Hubungi kami langsung melalui WhatsApp untuk respon lebih cepat
                </p>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-white text-green-700 hover:bg-green-50">
                    Chat via WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Complaint Form */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-green-600" />
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

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <p>
                      <strong>Catatan:</strong> Pengaduan Anda akan ditangani
                      oleh tim kami dalam waktu 1-3 hari kerja. Pastikan data
                      kontak yang Anda berikan aktif dan dapat dihubungi.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Pengaduan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
