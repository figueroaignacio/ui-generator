import { GitHubIcon } from '@/components/shared/tech-icons';
import { Button } from '@repo/ui/components/button';

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_60%_at_50%_50%,black_20%,transparent_100%)] opacity-40"
      />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          </span>
          Coming soon — currently in development
        </div>
        <h1 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl text-foreground font-bold">
          Generate UI components
          <br />
          with a single prompt.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          NachAI turns your ideas into production-ready components. Just describe what you need —
          built on top of{' '}
          <a
            href="https://nach-ui.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            NachUI
          </a>
          .
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline" size="sm" leftIcon={<GitHubIcon />}>
            <a
              href="https://github.com/figueroaignacio/ui-generator"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Free to use during beta · No credit card required
        </p>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent"
      />
    </section>
  );
}
