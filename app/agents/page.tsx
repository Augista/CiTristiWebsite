import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

const allAgents = [
  {
    id: 1,
    name: "ms. cristi Wijaya",
    title: "Senior Real Estate Agent",
    image: "/professional-female-agent-woman.jpg",
    description:
      "Dengan pengalaman lebih dari 10 tahun di industri real estate, ms. cristi Wijaya adalah ahli terpercaya Anda dalam menemukan properti impian. Spesialisasi di Surabaya pusat dengan track record luar biasa dan kepuasan pelanggan yang tinggi.",
    phone: "+62 812 3456 7890",
    email: "cristi@propertisurabaya.com",
    specialties: ["Residensial Luxury", "Properti Komersial", "Investasi"],
  },
  {
    id: 2,
    name: "Ibu Siti Nurhaliza",
    title: "Property Consultant",
    image: "/professional-female-real-estate-agent-woman.jpg",
    description:
      "Spesialis properti komersial dan residensial modern. Ibu Siti telah membantu ratusan klien menemukan investasi properti terbaik mereka di Surabaya dengan strategi yang tepat.",
    phone: "+62 812 3456 7891",
    email: "siti@propertisurabaya.com",
    specialties: ["Apartemen Modern", "Ruko Strategis", "Property Developer"],
  },
  {
    id: 3,
    name: "Budi Scristiso",
    title: "Investment Specialist",
    image: "/professional-real-estate-broker-man.jpg",
    description:
      "Fokus pada investasi properti jangka panjang dan ROI yang menguntungkan. Budi membimbing setiap klien dengan analisis mendalam dan rekomendasi yang disesuaikan dengan goals finansial mereka.",
    phone: "+62 812 3456 7892",
    email: "budi@propertisurabaya.com",
    specialties: ["Investasi", "Analisis Pasar", "KPR Consultation"],
  },
  {
    id: 4,
    name: "Ratna Sari",
    title: "Residential Specialist",
    image: "/professional-female-agent-woman.jpg",
    description:
      "Spesialis rumah dan apartemen dengan fokus pada kebutuhan keluarga muda. Ratna memahami setiap detail yang penting bagi calon pembeli.",
    phone: "+62 812 3456 7893",
    email: "ratna@propertisurabaya.com",
    specialties: ["Rumah Tinggal", "Apartemen Keluarga", "Properti Ramah Anak"],
  },
]

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Tim Agen Profesional Kami</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bertemu dengan para ahli real estate kami yang siap membantu Anda menemukan properti impian dengan
              dedikasi dan profesionalisme tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-60 overflow-hidden bg-muted">
                  <img
                    src={agent.image || "/placeholder.svg"}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{agent.title}</p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Spesialisasi:</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-2 py-1 bg-muted text-foreground text-xs rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 mb-4 pb-4 border-b border-border text-xs">
                    <a href={`tel:${agent.phone}`} className="block text-primary hover:underline">
                      {agent.phone}
                    </a>
                    <a href={`mailto:${agent.email}`} className="block text-primary hover:underline">
                      {agent.email}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/62${agent.phone.replace(/\D/g, "").slice(-10)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-green-600 text-white rounded text-xs font-medium text-center hover:bg-green-700 transition-colors"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex-1 py-2 border border-primary text-primary rounded text-xs font-medium text-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
