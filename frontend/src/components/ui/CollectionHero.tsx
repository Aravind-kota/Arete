interface CollectionHeroProps {
  title: string;
  subtitle: string;
  description: string;
}

export function CollectionHero({ title, subtitle, description }: CollectionHeroProps) {
  return (
    <section className="bg-gradient-to-r from-marble-white to-white border-b border-stone-grey/10 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl">
          <h1 className="font-serif-heading text-4xl md:text-5xl font-bold text-charcoal-ink mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-aegean-blue font-medium mb-6">
            {subtitle}
          </p>
          <p className="text-base text-stone-grey leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
