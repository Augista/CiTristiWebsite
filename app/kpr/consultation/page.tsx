"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { MessageCircle, Phone, Mail } from "lucide-react"

export default function KPRConsultation() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    priceRange: "",
    propertyType: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Format pesan untuk WhatsApp
    const whatsappMessage = `
Halo, saya ingin berkonsultasi mengenai KPR.

Nama: ${formData.name}
Nomor Telepon: ${formData.phone}
Email: ${formData.email}
Rentang Harga: ${formData.priceRange}
Tipe Properti: ${formData.propertyType}

Pertanyaan/Komentar:
${formData.message}
    `.trim()

    // Encode untuk URL
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappURL = `https://wa.me/62812345678?text=${encodedMessage}`

    // Buka WhatsApp
    window.open(whatsappURL, "_blank")

    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        email: "",
        priceRange: "",
        propertyType: "",
        message: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Konsultasi KPR</h1>
            <p className="text-lg text-muted-foreground">
              Hubungi tim ahli kami melalui WhatsApp untuk konsultasi KPR gratis. Kami siap membantu Anda merencanakan
              pembiayaan properti impian.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">WhatsApp</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Chat langsung dengan agen kami di WhatsApp</p>
                <a
                  href="https://wa.me/62812345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Sekarang
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Telepon</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Hubungi kami langsung melalui telepon</p>
                <a
                  href="tel:+628123456789"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  +62 812-345-6789
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Email</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Kirim pertanyaan melalui email</p>
                <a
                  href="mailto:konsultasi@propertisurabaya.com"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Email Kami
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Form Konsultasi</h2>

                {submitted ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-800 font-medium">
                      Terima kasih! Kami akan menghubungi Anda segera melalui WhatsApp.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Nama Lengkap *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Nomor Telepon *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="0812-345-6789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Rentang Harga *</label>
                        <select
                          name="priceRange"
                          value={formData.priceRange}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Pilih rentang harga</option>
                          <option value="< 500 juta">Kurang dari 500 juta</option>
                          <option value="500 juta - 1 miliar">500 juta - 1 miliar</option>
                          <option value="1 - 2 miliar">1 - 2 miliar</option>
                          <option value="2 - 5 miliar">2 - 5 miliar</option>
                          <option value="> 5 miliar">Lebih dari 5 miliar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Tipe Properti *</label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Pilih tipe properti</option>
                          <option value="Rumah">Rumah</option>
                          <option value="Apartemen">Apartemen</option>
                          <option value="Ruko">Ruko</option>
                          <option value="Tanah">Tanah</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Pertanyaan / Komentar</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Tuliskan pertanyaan atau informasi tambahan..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold"
                    >
                      Kirim ke WhatsApp
                    </button>
                  </form>
                )}

                <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Dengan mengirimkan form ini, data Anda akan dikirim ke WhatsApp tim kami
                    untuk konsultasi lebih lanjut. Kami berkomitmen menjaga privasi data Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
