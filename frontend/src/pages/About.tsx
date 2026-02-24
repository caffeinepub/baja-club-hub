import { useEffect, useRef, useState } from 'react';
import { Wrench, Cpu, Users, Trophy } from 'lucide-react';

const paragraphs = [
  {
    text: "Our BAJA Club is a student-driven engineering team dedicated to designing, manufacturing, and competing with an all-terrain vehicle in prestigious national-level competitions such as SAE BAJA. The club brings together passionate students from various departments who collaborate to build a rugged, single-seater off-road vehicle capable of withstanding challenging terrains and extreme racing conditions. More than just a competition team, BAJA is a platform where theoretical knowledge meets practical implementation, transforming classroom concepts into real-world engineering solutions.",
  },
  {
    text: "The club operates through multiple specialized domains including Design, Analysis, Fabrication, Powertrain, Electronics, Operations, Marketing, and Finance. Each department plays a vital role in ensuring the successful development of the vehicle. From conceptualizing the chassis structure and suspension geometry to manufacturing components, performing testing, managing budgets, and securing sponsorships, every member contributes toward a shared mission.",
  },
  {
    text: "Participation in BAJA competitions demands rigorous preparation, innovation, and strategic planning. The vehicle undergoes technical inspections, brake tests, acceleration runs, maneuverability challenges, suspension and traction evaluations, and finally, the endurance race. Through this journey, students gain hands-on experience in CAD modeling, simulation, manufacturing processes, project management, documentation, and real-time problem-solving.",
  },
  {
    text: "Beyond engineering excellence, the BAJA Club instills a culture of discipline, collaboration, and continuous improvement. The club not only builds a vehicle but also builds engineers—equipping students with industry-relevant skills, practical experience, and a strong professional mindset.",
  },
];

const domains = [
  { icon: Wrench, label: 'Design & Fabrication' },
  { icon: Cpu, label: 'Electronics & Powertrain' },
  { icon: Users, label: 'Operations & Finance' },
  { icon: Trophy, label: 'Competition & Marketing' },
];

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
      }}
    >
      {children}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative bg-carbon-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-racing-red/20 via-transparent to-championship-gold/10 pointer-events-none" />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
          }}
        />
        <div className="container relative py-20 md:py-28 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 bg-racing-red/10 border border-racing-red/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse" />
              <span className="text-racing-red text-sm font-semibold tracking-widest uppercase">VVCE BAJA Club</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
              About Our{' '}
              <span className="text-racing-red">BAJA Club</span>
            </h1>
            <p className="text-metallic-silver text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Engineering excellence. Competitive spirit. Real-world impact.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Domain Highlights */}
      <section className="bg-carbon-black/60 border-y border-racing-red/10">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domains.map((domain, i) => (
              <FadeInSection key={domain.label} delay={i * 80}>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-carbon-black/80 border border-racing-red/10 hover:border-racing-red/40 transition-colors group">
                  <domain.icon className="w-6 h-6 text-racing-red group-hover:scale-110 transition-transform" />
                  <span className="text-metallic-silver text-sm font-medium text-center">{domain.label}</span>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-14 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Decorative accent */}
          <FadeInSection>
            <div className="flex items-center gap-3 mb-10">
              <div className="h-1 w-12 rounded-full bg-racing-red" />
              <span className="text-racing-red font-semibold text-sm uppercase tracking-widest">Our Story</span>
            </div>
          </FadeInSection>

          {/* Paragraphs */}
          <div className="space-y-8">
            {paragraphs.map((para, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="relative pl-5 border-l-2 border-racing-red/30 hover:border-racing-red/70 transition-colors">
                  <p className="text-base md:text-lg leading-relaxed text-foreground/85 font-normal">
                    {para.text}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <FadeInSection delay={400}>
            <div className="mt-14 rounded-2xl bg-gradient-to-r from-racing-red/10 via-carbon-black/60 to-championship-gold/10 border border-racing-red/20 p-8 text-center">
              <p className="text-championship-gold font-bold text-xl md:text-2xl mb-2 tracking-tight">
                #BuiltBeyondBounds
              </p>
              <p className="text-metallic-silver text-sm md:text-base">
                Join us and be part of something extraordinary — where passion meets engineering.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
