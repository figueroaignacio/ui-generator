export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 py-24 lg:flex-row lg:items-center lg:gap-20 lg:py-0">
        <div className="flex flex-1 flex-col r lg:items-start lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            Coming soon — currently in development
          </div>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Generate UI components
            <br />
            with a single prompt.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            NachAI turns your ideas into production-ready components. Just describe what you need |
            built on top of{' '}
            <a href="https://nach-ui.vercel.app" className="text-foreground underline">
              NachUI
            </a>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-8">
            {[
              { value: 'Beta', label: 'Free during beta' },
              { value: 'NachUI', label: 'Built on top of' },
              { value: '0', label: 'Credit card required' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-lg font-semibold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full shrink-0 items-center justify-center lg:w-auto">
          {/* Login Card removed from here, moving to get-started page */}
        </div>
      </div>
    </section>
  );
}
