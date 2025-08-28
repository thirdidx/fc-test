'use client'

import {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {ScrapingAnimation} from '@/components/scraping-animation'
import {
  Loader2,
  Copy,
  Check,
  Code,
  Link2,
  FileText,
  Camera,
  FileJson,
  Settings2,
  ArrowUpRight,
  CircleDot,
  Download,
  ExternalLink,
} from 'lucide-react'
import {useAppStore, type FormatOption} from '@/lib/store'
import {copyToClipboard, parseImagesFromHtml, formatUrl, downloadImage, type RecentRun} from '@/lib/utils'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Checkbox} from '@/components/ui/checkbox'
import {Badge} from '@/components/ui/badge'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'

const formatOptions: FormatOption[] = [
  {id: 'markdown', label: 'Markdown', icon: 'M'},
  {id: 'summary', label: 'Summary', icon: '≡'},
  {id: 'links', label: 'Links', icon: '🔗'},
  {
    id: 'html',
    label: 'HTML',
    icon: '<>',
    subOptions: [
      {label: 'Cleaned', value: 'cleaned'},
      {label: 'Raw', value: 'raw'},
    ],
  },
  {
    id: 'screenshot',
    label: 'Screenshot',
    icon: '[]',
    subOptions: [
      {label: 'Viewport', value: 'viewport'},
      {label: 'Full Page', value: 'fullpage'},
    ],
  },
  {id: 'json', label: 'JSON', icon: '{}'},
]

export function Playground() {
  const {
    url,
    isLoading,
    result,
    activeTab,
    recentRuns,
    selectedFormats,
    isAccordionOpen,
    setUrl,
    setIsLoading,
    setResult,
    setActiveTab,
    addRecentRun,
    updateRecentRun,
    toggleFormat,
    setAccordionOpen,
  } = useAppStore()

  const [showFormatDropdown, setShowFormatDropdown] = useState(false)
  const [htmlOption, setHtmlOption] = useState<'cleaned' | 'raw'>('cleaned')
  const [screenshotOption, setScreenshotOption] = useState<'viewport' | 'fullpage'>('viewport')

  useEffect(() => {
    if (result && !isLoading) {
      setAccordionOpen(true)
    }
  }, [result, isLoading, setAccordionOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setAccordionOpen(false)
    const runId = Date.now().toString()

    const newRun: RecentRun = {
      id: runId,
      url: url.trim(),
      status: 'loading',
      timestamp: new Date(),
      formats: selectedFormats,
    }
    addRecentRun(newRun)

    try {
      const formattedUrl = formatUrl(url.trim())

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formattedUrl,
          formats: selectedFormats,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const parsedImages = data.data?.html ? parseImagesFromHtml(data.data.html) : []
        const resultData = {success: true, data: {...data.data, images: parsedImages}}
        setResult(resultData)
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

  const getFormatIcon = (format: FormatOption) => {
    switch (format.id) {
      case 'links':
        return <Link2 className="h-4 w-4" />
      case 'html':
        return <Code className="h-4 w-4" />
      case 'screenshot':
        return <Camera className="h-4 w-4" />
      case 'json':
        return <FileJson className="h-4 w-4" />
      case 'summary':
        return <FileText className="h-4 w-4" />
      case 'markdown':
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      {/* Header Section */}
      <div className="text-center space-y-2 pt-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Web Scraper</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Extract content from any website in multiple formats</p>
      </div>

      {/* Input Section */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center bg-muted px-3 py-2 rounded-md text-sm text-muted-foreground border whitespace-nowrap">https://</div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-muted-foreground hidden sm:block" />

                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                  >
                    <FileText className="h-4 w-4" />
                    Format:{' '}
                    {selectedFormats.length === 0
                      ? 'None'
                      : selectedFormats.length === 1
                      ? selectedFormats[0].charAt(0).toUpperCase() + selectedFormats[0].slice(1)
                      : `${selectedFormats.length} selected`}
                    <span className="ml-auto">▼</span>
                  </Button>

                  {showFormatDropdown && (
                    <Card className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto mt-2 w-full sm:w-[400px] z-50 shadow-lg">
                      <CardHeader className="p-3">
                        <div className="flex items-center justify-between mb-0">
                          <CardTitle className="text-base">Format</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => setShowFormatDropdown(false)}>
                            ✕
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {formatOptions.map((format) => (
                          <div key={format.id} className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={format.id}
                                checked={selectedFormats.includes(format.id)}
                                onCheckedChange={() => toggleFormat(format.id)}
                              />
                              <label
                                htmlFor={format.id}
                                className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {getFormatIcon(format)}
                                {format.label}
                              </label>
                            </div>
                            {format.subOptions && selectedFormats.includes(format.id) && (
                              <div className="ml-9 flex gap-4">
                                {format.subOptions.map((option) => (
                                  <label
                                    key={option.value}
                                    className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name={`${format.id}-option`}
                                      value={option.value}
                                      checked={
                                        (format.id === 'html' && htmlOption === option.value) ||
                                        (format.id === 'screenshot' && screenshotOption === option.value)
                                      }
                                      onChange={(e) => {
                                        if (format.id === 'html') {
                                          setHtmlOption(e.target.value as 'cleaned' | 'raw')
                                        } else if (format.id === 'screenshot') {
                                          setScreenshotOption(e.target.value as 'viewport' | 'fullpage')
                                        }
                                      }}
                                      className="h-3 w-3"
                                    />
                                    {option.label}
                                  </label>
                                ))}
                              </div>
                            )}
                            {format.id === 'json' && selectedFormats.includes('json') && (
                              <div className="ml-9">
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                  ✏️ Edit schema
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" type="button" className="w-full sm:w-auto">
                  <Code className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Get code</span>
                  <span className="sm:hidden">Code</span>
                </Button>
                <Button type="submit" disabled={!url.trim() || isLoading} className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Scraping...</span>
                      <span className="sm:hidden">Loading...</span>
                    </>
                  ) : (
                    <span>Start scraping</span>
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

      {/* Results Accordion */}
      {result && !isLoading && (
        <Accordion
          type="single"
          collapsible
          value={isAccordionOpen ? 'results' : ''}
          onValueChange={(value) => setAccordionOpen(value === 'results')}
        >
          <AccordionItem value="results" className="border rounded-lg">
            <div className="flex items-center justify-between px-6">
              <AccordionTrigger className="flex-1 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Results</span>
                  {result.success && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                      <Check className="w-3 h-3 mr-1" />
                      Success
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
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
            <AccordionContent className="px-6 pb-6">
              {result.success ? (
                <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as typeof activeTab)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                    <TabsTrigger value="markdown" className="text-xs sm:text-sm py-1.5">Markdown</TabsTrigger>
                    <TabsTrigger value="media" className="text-xs sm:text-sm py-1.5">Media ({result.data?.images?.length || 0})</TabsTrigger>
                    <TabsTrigger value="raw" className="text-xs sm:text-sm py-1.5">Raw JSON</TabsTrigger>
                  </TabsList>
                  <TabsContent value="markdown" className="mt-4">
                    <div className="bg-muted p-4 rounded border max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{result.data?.markdown || 'No markdown content'}</pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="media" className="mt-4">
                    <div className="bg-muted p-4 rounded border max-h-96 overflow-y-auto">
                      {result.data?.images && result.data.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
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
                                    const target = e.target as HTMLImageElement
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+'
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
              ) : (
                <div className="text-red-500 p-4 bg-red-50 rounded border border-red-200">
                  <div className="flex items-center gap-2">
                    <CircleDot className="w-4 h-4" />
                    <span className="font-medium">Error:</span> {result.error}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Recent Runs Grid */}
      {recentRuns.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Runs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRuns.map((run) => (
              <Card
                key={run.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  if (run.result) {
                    setResult(run.result)
                    setUrl(run.url)
                    setAccordionOpen(true)
                  }
                }}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded flex items-center justify-center text-sm sm:text-lg font-bold">M</div>
                      <span className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">{run.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-orange-500" />
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Endpoint</span>
                      <span className="flex items-center gap-1">
                        <CircleDot className="h-3 w-3 text-orange-500" />
                        Scrape
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="flex items-center gap-1">
                        {run.status === 'loading' ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Loading
                          </>
                        ) : run.status === 'success' ? (
                          <>
                            <Check className="h-3 w-3 text-green-500" />
                            Success
                          </>
                        ) : (
                          <>
                            <CircleDot className="h-3 w-3 text-red-500" />
                            Error
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started</span>
                      <div className="text-right">
                        <div>{run.timestamp.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                        <div className="text-xs text-muted-foreground">
                          {run.timestamp.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Formats</span>
                      <div className="flex gap-2 mt-1">
                        {(run.formats || ['markdown']).map((format) => (
                          <Badge key={format} variant="secondary" className="text-xs">
                            {getFormatIcon(formatOptions.find((f) => f.id === format) || formatOptions[0])}
                            {format.charAt(0).toUpperCase() + format.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
