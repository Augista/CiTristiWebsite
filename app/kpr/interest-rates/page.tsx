import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { TrendingDown } from "lucide-react"

const bankRates = [
  { name: "Bank BCA", rate: "5.5% - 6.2%", term: "Hingga 20 tahun", dp: "20% - 30%" },
  { name: "Bank Mandiri", rate: "5.25% - 5.99%", term: "Hingga 20 tahun", dp: "15% - 25%" },
  { name: "Bank BRI", rate: "5.75% - 6.5%", term: "Hingga 20 tahun", dp: "20% - 30%" },
  { name: "Bank BTN", rate: "5.0% - 5.75%", term: "Hingga 20 tahun", dp: "5% - 10%" },
  { name: "Bank CIMB Niaga", rate: "5.5% - 6.25%", term: "Hingga 20 tahun", dp: "20% - 30%" },
  { name: "Bank Permata", rate: "5.99% - 6.75%", term: "Hingga 20 tahun", dp: "20% - 30%" },
]

export default function InterestRates() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Suku Bunga KPR</h1>
            <p className="text-lg text-muted-foreground">
              Informasi terbaru mengenai suku bunga KPR dari berbagai bank di Indonesia. Tarif yang ditampilkan adalah
              rata-rata dan dapat berubah sesuai dengan kebijakan bank.
            </p>
          </div>

          {/* Rates Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {bankRates.map((bank, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">{bank.name}</h3>
                  <TrendingDown className="w-5 h-5 text-primary" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Suku Bunga</p>
                    <p className="text-2xl font-bold text-primary">{bank.rate}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Jangka Waktu</p>
                      <p className="font-medium">{bank.term}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">DP Minimal</p>
                      <p className="font-medium">{bank.dp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Information Section */}
          <div className="bg-muted rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-semibold mb-6">Informasi Penting</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Faktor yang Mempengaruhi Suku Bunga KPR</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Nilai properti dan lokasi</li>
                  <li>Besarnya uang muka (down payment)</li>
                  <li>Penghasilan dan riwayat kredit peminjam</li>
                  <li>Jangka waktu kredit</li>
                  <li>Jenis properti (residensial, komersial, dll)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tips Mendapatkan Suku Bunga Terbaik</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Buatlah riwayat kredit yang baik</li>
                  <li>Siapkan uang muka yang besar (minimal 20%)</li>
                  <li>Pilih properti di lokasi strategis</li>
                  <li>Bandingkan penawaran dari berbagai bank</li>
                  <li>Konsultasi dengan agen profesional kami</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Catatan:</strong> Informasi suku bunga di atas diperbarui secara berkala dan dapat berubah
                  tanpa pemberitahuan. Untuk informasi terkini dan penawaran khusus, silakan hubungi tim ahli kami
                  melalui WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
