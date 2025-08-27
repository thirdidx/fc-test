'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrapingAnimation } from '@/components/scraping-animation'
import { Loader2, Copy } from 'lucide-react'

type ScrapeResult = {
  success: boolean
  data?: {
    markdown: string
    html: string
    metadata: Record<string, unknown>
  }
  error?: string
}

type RecentRun = {
  id: string
  url: string
  status: 'success' | 'error' | 'loading'
  timestamp: Date
  result?: ScrapeResult
}

export default function FirecrawlPlayground() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapeResult | null>(null)
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted')
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    const runId = Date.now().toString()
    
    // Add to recent runs immediately
    const newRun: RecentRun = {
      id: runId,
      url: url.trim(),
      status: 'loading',
      timestamp: new Date()
    }
    setRecentRuns(prev => [newRun, ...prev.slice(0, 4)])

    try {
      // Format URL properly
      const formattedUrl = formatUrl(url.trim())
      
      // Call our mock API endpoint (replace with actual Firecrawl API)
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fc-placeholder-api-key'
        },
        body: JSON.stringify({
          url: formattedUrl,
          formats: ['markdown', 'html']
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult({ success: true, data })
        // Update recent run status
        setRecentRuns(prev => 
          prev.map(run => 
            run.id === runId 
              ? { ...run, status: 'success' as const, result: { success: true, data } }
              : run
          )
        )
      } else {
        const errorResult = { success: false, error: data.error || 'Failed to scrape URL' }
        setResult(errorResult)
        setRecentRuns(prev => 
          prev.map(run => 
            run.id === runId 
              ? { ...run, status: 'error' as const, result: errorResult }
              : run
          )
        )
      }
    } catch {
      const errorResult = { success: false, error: 'Network error occurred' }
      setResult(errorResult)
      setRecentRuns(prev => 
        prev.map(run => 
          run.id === runId 
            ? { ...run, status: 'error' as const, result: errorResult }
            : run
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const formatUrl = (inputUrl: string) => {
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      return `https://${inputUrl}`
    }
    return inputUrl
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="flex items-center gap-2 border-b px-4 h-12">
            <SidebarTrigger />
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Title Section */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">🔥 Scrape</h1>
              </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* URL Input */}
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex items-center bg-muted px-3 py-2 rounded-md text-sm text-muted-foreground border">
                      https://
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="example.com"
                      className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Format:</span>
                        <select className="text-sm border border-input rounded px-2 py-1 bg-background">
                          <option>Markdown</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" type="button">
                        Get code
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={!url.trim() || isLoading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Scraping...
                          </>
                        ) : (
                          'Start scraping'
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Loading Animation */}
            {isLoading && (
              <Card>
                <CardContent>
                  <ScrapingAnimation />
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {result && !isLoading && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle>Results</CardTitle>
                      {result.success && (
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Success
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {result.success && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const contentToCopy = activeTab === 'formatted' 
                              ? result.data?.markdown || '' 
                              : JSON.stringify(result.data, null, 2)
                            copyToClipboard(contentToCopy)
                          }}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      )}
                      <div className="flex gap-1 border rounded">
                        <button
                          onClick={() => setActiveTab('formatted')}
                          className={`px-3 py-1 text-sm rounded ${
                            activeTab === 'formatted'
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          Formatted
                        </button>
                        <button
                          onClick={() => setActiveTab('raw')}
                          className={`px-3 py-1 text-sm rounded ${
                            activeTab === 'raw'
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          Raw
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.success ? (
                    <div className="space-y-4">
                      {activeTab === 'formatted' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <div className="bg-muted p-4 rounded border max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm font-mono">
                              {result.data?.markdown || 'No markdown content'}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted p-4 rounded border max-h-96 overflow-auto">
                          <pre className="text-xs font-mono">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-red-500 p-4 bg-red-50 dark:bg-red-950 rounded border">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="font-medium">Error:</span> {result.error}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Runs Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Runs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentRuns.length > 0 ? (
                  <div className="space-y-1">
                    {recentRuns.map((run) => (
                      <div
                        key={run.id}
                        className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => run.result && setResult(run.result)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 text-xs">
                            {run.status === 'loading' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : run.status === 'success' ? (
                              <div className="w-3 h-3 bg-green-500 rounded-full" />
                            ) : (
                              <div className="w-3 h-3 bg-red-500 rounded-full" />
                            )}
                          </div>
                          <span className="text-sm font-medium truncate">
                            {run.url.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground ml-6">
                          <div>Endpoint: 🔥 Scrape</div>
                          <div>
                            Status: {run.status === 'loading' ? 'Loading' : 
                                    run.status === 'success' ? 'Success' : 'Error'}
                          </div>
                          <div>Started: {run.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">No recent runs</p>
                    <p className="text-xs mt-1">Start scraping to see your history</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </>
  )
}