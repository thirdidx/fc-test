'use client'

import {SidebarInset, SidebarTrigger} from '@/components/ui/sidebar'
import {Playground} from '@/components/playground'

export default function FirecrawlPlayground() {
  return (
    <SidebarInset>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center gap-2 border-b px-4 h-12">
          <SidebarTrigger />
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Playground />
          </div>
        </main>
      </div>
    </SidebarInset>
  )
}
