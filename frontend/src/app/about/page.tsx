import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-marble-white">
      {/* Hero */}
      <section className="bg-aegean-blue py-20 px-4 md:px-6 text-center">
        <div className="container mx-auto">
          <h1 className="font-serif-heading text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
            Our Mission
          </h1>
          <p className="text-marble-white/90 text-xl max-w-2xl mx-auto font-sans leading-relaxed">
            Connecting readers with the world's knowledge through a premium, curated exploration experience.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-xl border border-stone-grey/10 shadow-sm">
          <div className="prose prose-lg prose-stone mx-auto">
            <h2 className="font-serif-heading text-3xl font-bold text-charcoal-ink mb-6">About Aretē</h2>
            <p className="text-stone-grey mb-6 leading-relaxed">
              <span className="font-bold text-aegean-blue">Aretē</span> (Greek: ἀρετή) means "excellence" or "virtue." In the Homeric poems, it implies a concept of living up to one's full potential. We chose this name because we believe that the pursuit of knowledge is the highest form of excellence.
            </p>
            
            <p className="text-stone-grey mb-6 leading-relaxed">
              We started Aretē with a simple goal: to make the vast universe of books more accessible and enjoyable. In a digital age where information is abundant but scattered, we strive to be your curated guide.
            </p>

            <h3 className="font-serif-heading text-2xl font-bold text-charcoal-ink mt-10 mb-4">Our Values</h3>
            <ul className="list-disc pl-6 space-y-3 text-stone-grey mb-10">
              <li><strong className="text-charcoal-ink">Curiosity:</strong> We believe in the power of asking questions and seeking answers.</li>
              <li><strong className="text-charcoal-ink">Quality:</strong> We prioritize verified, high-quality sources and products.</li>
              <li><strong className="text-charcoal-ink">Sustainability:</strong> We support the circular economy by promoting pre-loved books.</li>
              <li><strong className="text-charcoal-ink">Discovery:</strong> We build tools that help you find hidden gems you didn't know you were looking for.</li>
            </ul>

            <div className="bg-marble-white p-6 rounded-lg border border-bronze-gold/20 flex flex-col items-center text-center">
              <h3 className="font-serif-heading text-xl font-bold text-charcoal-ink mb-3">Join the Exploration</h3>
              <p className="text-stone-grey mb-6 text-sm">Deliciously curated books are just a click away.</p>
              <Link href="/books">
                <Button>Start Browsing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
