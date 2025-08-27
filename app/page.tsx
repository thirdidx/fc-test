import BearCounter from "@/components/BearCounter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FirecrawlWordmark } from "@/components/firecrawl-logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <FirecrawlWordmark height={32} className="text-primary" />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-8 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Modern Web Stack
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Built with Next.js, Tailwind CSS, shadcn/ui, and Zustand. Clean,
              fast, and ready for production.
            </p>
          </div>

          {/* Demo Section */}
          <div className="py-8">
            <BearCounter />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <a
                href="https://www.firecrawl.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Firecrawl
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                shadcn/ui
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://zustand-demo.pmnd.rs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Zustand
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-8 py-6 text-center text-sm text-muted-foreground">
          [...]
        </div>
      </footer>
    </div>
  );
}
