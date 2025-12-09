import Link from "next/link"
import { ArrowRight, Phone, Mail } from "lucide-react"

export default function AgentSection() {
  const cristiPhone = "+62 812 3456 7890"
  const cristiEmail = "cristi@propertisurabaya.com"
  const whatsappNumber = "628123456789"

  return (
    <section className="py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Meet cristi Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-wide mb-2">KENALI KAMI LEBIH DEKAT</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Temui cristi</h2>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
          {/* Left: Image */}
          <div className="order-2 md:order-1">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-xl">
              <img
                src="/professional-female-agent-woman.jpg"
                alt="ms. cristi Wijaya"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 md:order-2 space-y-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-2">ms. cristi Wijaya</h3>
              <p className="text-primary font-semibold text-lg mb-6">Senior Real Estate Agent & Expert</p>
            </div>

            {/* Main Description */}
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Sebagai pemimpin yang diakui di industri real estate, ms. cristi Wijaya dikenal karena profesionalisme,
                keahlian, dan integritas yang luar biasa. cristi secara konsisten menduduki peringkat teratas sebagai top
                producer dan telah mendapatkan kepercayaan klien-klien eksklusif, dari eksekutif tingkat tinggi, founder
                startup teknologi, hingga profesional terpercaya.
              </p>
              <p>
                cristi sering tampil sebagai expert properti premium di acara-acara industri dan konferensi real estate
                nasional. Dengan mengedepankan kepercayaan dan kepentingan klien di atas segalanya, cristi termotivasi
                untuk melampaui ekspektasi dan memberikan hasil yang luar biasa.
              </p>
            </div>

            {/* Passion Statement */}
            <div className="bg-muted p-6 rounded-lg border border-border">
              <p className="text-foreground italic leading-relaxed">
                "Saya mencintai dunia real estate. Saya berusaha membagikan passion ini kepada setiap klien dan
                menggunakan pengalaman mendalam saya untuk membantu Anda mewujudkan impian tentang rumah, keluarga, dan
                pertumbuhan aset Anda."
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                Chat WhatsApp
              </Link>
              <Link
                href="/kpr/consultation"
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                Bekerja Sama
              </Link>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${cristiPhone}`} className="text-foreground hover:text-primary transition-colors">
                  {cristiPhone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`mailto:${cristiEmail}`} className="text-foreground hover:text-primary transition-colors">
                  {cristiEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise Highlights */}
        <div className="bg-muted rounded-xl p-8 md:p-12">
          <h4 className="text-2xl font-serif font-bold mb-8">Keahlian & Spesialisasi</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-semibold text-lg mb-3">Properti Mewah & Premium</h5>
              <p className="text-muted-foreground">
                Spesialis dalam properti residensial luxury di area-area premium Surabaya dengan fasilitas terbaik
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-lg mb-3">Investasi Real Estate</h5>
              <p className="text-muted-foreground">
                Berpengalaman membantu investor menemukan properti dengan ROI tinggi dan potensi pertumbuhan jangka
                panjang
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-lg mb-3">Konsultasi KPR & Pembiayaan</h5>
              <p className="text-muted-foreground">
                Expert dalam proses KPR dan pembiayaan properti dengan koneksi ke bank-bank terkemuka dan bunga
                kompetitif
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
