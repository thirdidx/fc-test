import {FirecrawlLogo} from './firecrawl-logo'

export function ScrapingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <FirecrawlLogo size={64} className="animate-pulse text-primary" />
        <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-ping" />
        <div className="absolute -inset-4 rounded-full border border-primary/10 animate-ping animation-delay-200" />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-medium">Scraping content...</p>
        <p className="text-xs text-muted-foreground mt-1">This may take a few moments</p>
      </div>
    </div>
  )
}
