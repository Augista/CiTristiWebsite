"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload, X } from "lucide-react"

const districts = ["Darmo", "Dinoyo", "Tegalsari", "Jambangan", "Wonokromo", "Sukolilo", "Tambaksari", "Genteng"]
const propertyTypes = ["Rumah", "Apartemen", "Ruko", "Tanah"]

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    district: "",
    property_type: "",
    price: "",
    size_sqm: "",
    bedrooms: "",
    bathrooms: "",
    featured_image_url: "",
    gallery_images: [] as string[],
    amenities: "",
    contact_phone: "",
    contact_email: "",
    badge: "",
    hashtags: "",
    social_links: {
      tiktok: "",
      instagram: "",
    },
    is_popup_promo: false,
  })

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData((prev) => ({
    ...prev,
    social_links: {
      ...prev.social_links,
      [name]: value,
    },
  }))
}

const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, checked } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]: checked,
  }))
}


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    setUploadingImage(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Upload failed")
      }

      setFormData((prev) => ({
        ...prev,
        featured_image_url: responseData.url,
      }))
      alert("Gambar utama berhasil diupload!")
    } catch (error) {
      console.error(" Upload error:", error)
      alert(`Gagal upload gambar: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleGalleryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (galleryUrls.length >= 10) {
        alert("Maksimal 10 gambar untuk galeri")
        break
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setGalleryPreviews((prev) => [...prev, event.target?.result as string])
      }
      reader.readAsDataURL(file)

      setUploadingImage(true)
      try {
        const formDataToSend = new FormData()
        formDataToSend.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataToSend,
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || "Upload failed")
        }

        setGalleryUrls((prev) => [...prev, responseData.url])
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...prev.gallery_images, responseData.url],
        }))
      } catch (error) {
        console.error(" Gallery upload error:", error)
        alert(`Gagal upload gambar galeri: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        ...formData,
        price: Number.parseInt(formData.price),
        size_sqm: formData.size_sqm ? Number.parseInt(formData.size_sqm) : null,
        bedrooms: formData.bedrooms ? Number.parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number.parseInt(formData.bathrooms) : null,
        amenities: formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        gallery_images: formData.gallery_images,
        badge: formData.badge,
        hashtags: formData.hashtags,
        social_links: formData.social_links,
        is_popup_promo: formData.is_popup_promo,
      }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create property")
      }

      router.push("/admin/dashboard")
    } catch (error) {
      console.error(" Submit error:", error)
      alert("Gagal menambah properti: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 mb-4 hover:opacity-80">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <h1 className="text-3xl font-serif font-bold">Tambah Properti Baru</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Featured Image Upload */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Foto Utama</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-48 mx-auto rounded-lg mb-4"
                      />
                      <p className="text-sm text-muted-foreground">
                        {uploadingImage ? "Uploading..." : "Klik untuk mengganti foto"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-lg font-medium text-foreground mb-2">Upload Foto Properti</p>
                      <p className="text-sm text-muted-foreground">Drag and drop atau klik untuk pilih</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Gallery Images Upload */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Galeri Foto (Opsional - Maksimal 10 foto)</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryImageChange}
                    disabled={uploadingImage || galleryUrls.length >= 10}
                    className="hidden"
                  />
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground mb-2">Upload Foto Galeri</p>
                    <p className="text-sm text-muted-foreground">
                      {uploadingImage ? "Uploading..." : `Pilih beberapa foto (${galleryUrls.length}/10)`}
                    </p>
                  </div>
                </label>
              </div>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-card rounded-lg p-6 border border-border space-y-4">
            <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Judul Properti *</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Rumah Mewah Darmo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipe Properti *</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value="">Pilih tipe properti</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Harga (Rp) *</label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="2500000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Luas (m²)</label>
                <Input
                  type="number"
                  name="size_sqm"
                  value={formData.size_sqm}
                  onChange={handleInputChange}
                  placeholder="250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kamar Tidur</label>
                <Input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kamar Mandi</label>
                <Input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Lokasi *</label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Jl. Darmo Indah"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kelurahan/Kecamatan *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value="">Pilih kelurahan</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Deskripsi Properti</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi lengkap tentang properti..."
                rows={5}
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fasilitas (pisahkan dengan koma)</label>
              <Input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="Kolam Renang, Taman, Garasi, Dapur Modern"
              />
            </div>
          </div>

          <div>
  <label className="block text-sm font-medium text-foreground mb-2">Badge Properti</label>
  <Input
    type="text"
    name="badge"
    value={formData.badge}
    onChange={handleInputChange}
    placeholder="Contoh: Featured, New"
  />
</div>

<div>
  <label className="block text-sm font-medium text-foreground mb-2">Hashtags (pisahkan dengan koma)</label>
  <Input
    type="text"
    name="hashtags"
    value={formData.hashtags}
    onChange={handleInputChange}
    placeholder="#murah,#citraland"
  />
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">Link TikTok</label>
    <Input
      type="text"
      name="tiktok"
      value={formData.social_links.tiktok}
      onChange={handleSocialLinkChange}
      placeholder="https://www.tiktok.com/@username"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-foreground mb-2">Link Instagram</label>
    <Input
      type="text"
      name="instagram"
      value={formData.social_links.instagram}
      onChange={handleSocialLinkChange}
      placeholder="https://www.instagram.com/username"
    />
  </div>
</div>

<div className="flex items-center gap-2 mt-2">
  <input
    type="checkbox"
    name="is_popup_promo"
    checked={formData.is_popup_promo}
    onChange={handleCheckboxChange}
    className="w-4 h-4"
  />
  <label className="text-sm text-foreground">Tampilkan di pop-up promo</label>
</div>


          {/* Contact Information */}
          <div className="bg-card rounded-lg p-6 border border-border space-y-4">
            <h2 className="text-lg font-semibold mb-4">Kontak</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nomor Telepon</label>
                <Input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="tristi@citristiproperty.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link href="/admin/dashboard" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Batal
              </Button>
            </Link>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Properti"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
