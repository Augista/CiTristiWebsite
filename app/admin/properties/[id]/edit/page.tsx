"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"


const districts = ["Darmo", "Dinoyo", "Tegalsari", "Jambangan", "Wonokromo", "Sukolilo", "Tambaksari", "Genteng"]
const propertyTypes = ["Rumah", "Apartemen", "Ruko", "Tanah"]

export default function EditPropertyPage() {
  const router = useRouter()
   const params = useParams() // params.id is now available
  const propertyId = params?.id // make optional chaining just in case
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>("")
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

  
  // Fetch property data
 useEffect(() => {
  if (!propertyId) return

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`)
      if (!response.ok) throw new Error("Failed to fetch property")
      const property = await response.json()

      setFormData({
        title: property.title || "",
        description: property.description || "",
        location: property.location || "",
        district: property.district || "",
        property_type: property.property_type || "",
        price: property.price?.toString() || "",
        size_sqm: property.size_sqm?.toString() || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        featured_image_url: property.featured_image_url || "",
        gallery_images: property.gallery_images || [],
        amenities: Array.isArray(property.amenities) ? property.amenities.join(", ") : property.amenities || "",
        contact_phone: property.contact_phone || "",
        contact_email: property.contact_email || "",
        badge: property.badge || "",
        hashtags: property.hashtags || "",
        social_links: property.social_links || { tiktok: "", instagram: "" },
        is_popup_promo: property.is_popup_promo || false,
      })

      if (property.featured_image_url) setImagePreview(property.featured_image_url)
    } catch (error) {
      console.error("Fetch property error:", error)
    } finally {
      setFetching(false)
    }
  }

  fetchProperty()
}, [propertyId])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value },
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Featured image upload
  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => setImagePreview(event.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      const response = await fetch("/api/upload", { method: "POST", body: formDataToSend })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Upload failed")
      setFormData((prev) => ({ ...prev, featured_image_url: data.url }))
      alert("Gambar utama berhasil diupload!")
    } catch (error) {
      console.error("Upload error:", error)
      alert(`Gagal upload gambar: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Gallery images upload
  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (formData.gallery_images.length >= 10) {
        alert("Maksimal 10 gambar untuk galeri")
        break
      }

      const reader = new FileReader()
      reader.onload = (event) => setFormData((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, event.target?.result as string] }))
      reader.readAsDataURL(file)

      try {
        const formDataToSend = new FormData()
        formDataToSend.append("file", file)
        const response = await fetch("/api/upload", { method: "POST", body: formDataToSend })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Upload failed")
        setFormData((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, data.url] }))
      } catch (error) {
        console.error("Gallery upload error:", error)
        alert(`Gagal upload gambar galeri: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }))
  }

  // Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          size_sqm: formData.size_sqm ? Number(formData.size_sqm) : null,
          bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
          amenities: formData.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) throw new Error("Failed to update property")
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Submit error:", error)
      alert("Gagal update properti")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 mb-4 hover:opacity-80">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-3xl font-serif font-bold">Edit Properti</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Featured Image */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Foto Utama</h2>
            <div className="flex items-center justify-center w-full">
              <label className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <input type="file" accept="image/*" onChange={handleFeaturedImageChange} className="hidden" />
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Preview" className="h-48 mx-auto rounded-lg mb-4" />
                    <p className="text-sm text-muted-foreground">Klik untuk mengganti foto</p>
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

          {/* Gallery Images */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Galeri Foto</h2>
            <div className="flex items-center justify-center w-full mb-4">
              <label className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="hidden" />
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground mb-2">Upload Foto Galeri</p>
                <p className="text-sm text-muted-foreground">{formData.gallery_images.length}/10</p>
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.gallery_images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} className="w-full h-32 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-card rounded-lg p-6 border border-border space-y-4">
            <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Judul Properti *" name="title" value={formData.title} onChange={handleInputChange} required />
              <SelectField label="Tipe Properti *" name="property_type" value={formData.property_type} onChange={handleInputChange} options={propertyTypes} required />
              <InputField label="Harga (Rp) *" name="price" value={formData.price} onChange={handleInputChange} type="number" required />
              <InputField label="Luas (m²)" name="size_sqm" value={formData.size_sqm} onChange={handleInputChange} type="number" />
              <InputField label="Kamar Tidur" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} type="number" />
              <InputField label="Kamar Mandi" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} type="number" />
              <InputField label="Lokasi *" name="location" value={formData.location} onChange={handleInputChange} required />
              <SelectField label="Kelurahan/Kecamatan *" name="district" value={formData.district} onChange={handleInputChange} options={districts} required />
            </div>
            <TextareaField label="Deskripsi Properti" name="description" value={formData.description} onChange={handleInputChange} rows={5} />
            <InputField label="Fasilitas (pisahkan dengan koma)" name="amenities" value={formData.amenities} onChange={handleInputChange} />
          </div>

          {/* Contact */}
          <div className="bg-card rounded-lg p-6 border border-border space-y-4">
            <h2 className="text-lg font-semibold mb-4">Kontak</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Nomor Telepon" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange} />
              <InputField label="Email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} type="email" />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link href="/admin/dashboard" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">Batal</Button>
            </Link>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-colors font-medium disabled:opacity-50">
              {loading ? "Menyimpan..." : "Update Properti"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable Input Components
function InputField({ label, name, value, onChange, type = "text", required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <Input type={type} name={name} value={value} onChange={onChange} required={required} />
    </div>
  )
}

function TextareaField({ label, name, value, onChange, rows = 3 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows={rows} className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground" />
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground" required={required}>
        <option value="">Pilih {label.toLowerCase()}</option>
        {options.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  )
}
