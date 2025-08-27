'use client'

import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {ScrapingAnimation} from '@/components/scraping-animation'
import {Loader2, Copy, Download, ExternalLink} from 'lucide-react'
import {useAppStore} from '@/lib/store'
import {copyToClipboard, parseImagesFromHtml, downloadImage, formatUrl, type RecentRun} from '@/lib/utils'

export function Playground() {
  const {
    url,
    isLoading,
    result,
    activeTab,
    recentRuns,
    setUrl,
    setIsLoading,
    setResult,
    setActiveTab,
    addRecentRun,
    updateRecentRun,
  } = useAppStore()

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
      timestamp: new Date(),
    }
    addRecentRun(newRun)

    try {
      // Format URL properly
      const formattedUrl = formatUrl(url.trim())

      // Call our API endpoint
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fc-placeholder-api-key',
        },
        body: JSON.stringify({
          url: formattedUrl,
          formats: ['markdown', 'html'],
        }),
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (response.ok) {
        const parsedImages = data.data?.html ? parseImagesFromHtml(data.data.html) : []
        console.log('Parsed images:', parsedImages)
        const resultData = {success: true, data: {...data.data, images: parsedImages}}
        setResult(resultData)
        // Update recent run status
        updateRecentRun(runId, {status: 'success', result: resultData})
      } else {
        const errorResult = {success: false, error: data.error || 'Failed to scrape URL'}
        setResult(errorResult)
        updateRecentRun(runId, {status: 'error', result: errorResult})
      }
    } catch {
      const errorResult = {success: false, error: 'Network error occurred'}
      setResult(errorResult)
      updateRecentRun(runId, {status: 'error', result: errorResult})
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Input Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* URL Input */}
        <Card className="shadow-sm border-border">
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
                <div></div>
                <div className="flex gap-2">
                  <Button variant="outline" type="button">
                    Get code
                  </Button>
                  <Button type="submit" disabled={!url.trim() || isLoading} className="bg-primary hover:bg-primary/90">
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
          <Card className="shadow-sm border-border">
            <CardContent>
              <ScrapingAnimation />
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && !isLoading && (
          <Card className="shadow-sm border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>Results</CardTitle>
                  {result.success && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
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
                        let contentToCopy = ''
                        if (activeTab === 'markdown') {
                          contentToCopy = result.data?.markdown || ''
                        } else if (activeTab === 'media') {
                          contentToCopy = JSON.stringify(result.data?.images || [], null, 2)
                        } else if (activeTab === 'raw') {
                          contentToCopy = JSON.stringify(result.data, null, 2)
                        }
                        copyToClipboard(contentToCopy)
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-4">
                  <Tabs
                    value={activeTab}
                    onValueChange={(value: string) => setActiveTab(value as typeof activeTab)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="markdown">Markdown</TabsTrigger>
                      <TabsTrigger value="media">Media ({result.data?.images?.length || 0})</TabsTrigger>
                      <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                    </TabsList>
                    <TabsContent value="markdown" className="mt-4">
                      <div className="bg-muted p-4 rounded border max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {result.data?.markdown || 'No markdown content'}
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="media" className="mt-4">
                      <div className="bg-muted p-4 rounded border max-h-96 overflow-y-auto">
                        {result.data?.images && result.data.images.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {result.data.images.map((image, index) => (
                              <div
                                key={index}
                                className="group relative bg-background rounded-lg border p-2 hover:shadow-md transition-shadow"
                              >
                                <div className="aspect-square rounded overflow-hidden bg-muted mb-2">
                                  <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src =
                                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+'
                                    }}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate" title={image.alt}>
                                      {image.alt}
                                    </p>
                                    {image.title && (
                                      <p className="text-xs text-muted-foreground truncate" title={image.title}>
                                        {image.title}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => window.open(image.src, '_blank')}
                                      title="View full size"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => downloadImage(image.src, `image-${index + 1}.jpg`)}
                                      title="Download image"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <div className="mb-2">🖼️</div>
                            <p>No images found on this page</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="raw" className="mt-4">
                      <div className="bg-muted p-4 rounded border max-h-96 overflow-auto">
                        <pre className="text-xs font-mono">{JSON.stringify(result.data, null, 2)}</pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-red-500 p-4 bg-red-50 rounded border">
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
        <Card className="shadow-sm border-border">
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
                    onClick={() => {
                      if (run.result) {
                        setResult(run.result)
                        setUrl(run.url)
                      }
                    }}
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
                      <span className="text-sm font-medium truncate">{run.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">
                      <div>Endpoint: 🔥 Scrape</div>
                      <div>Status: {run.status === 'loading' ? 'Loading' : run.status === 'success' ? 'Success' : 'Error'}</div>
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
  )
}