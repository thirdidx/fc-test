import BearCounter from '@/components/BearCounter'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Next.js + Tailwind + shadcn/ui + Zustand
          </h1>
          <p className="text-muted-foreground text-lg">
            A modern React stack with beautiful components and state management
          </p>
        </div>
        
        <BearCounter />
        
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
              shadcn/ui Docs
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noopener noreferrer">
              Zustand Docs
            </a>
          </Button>
        </div>
      </main>
    </div>
  )
}