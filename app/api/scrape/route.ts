import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {url, formats = ['markdown', 'html']} = body

    if (!url) {
      return NextResponse.json({error: 'URL is required'}, {status: 400})
    }

    // Initialize Firecrawl client
    const apiKey = process.env.FIRECRAWL_API_KEY
    console.log('API Key present:', !!apiKey, apiKey ? 'Key starts with: ' + apiKey.substring(0, 10) : 'No key')

    if (!apiKey || apiKey === 'fc-your-api-key-here') {
      console.log('Using mock response - no valid API key')
      return getMockResponse(url)
    }

    console.log('Using real Firecrawl API for URL:', url)

    try {
      // Call the Firecrawl API v2 with correct structure
      const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          formats: formats,
          onlyMainContent: true,
          waitFor: 2000,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      // Log the full response for debugging
      console.log('Firecrawl API response:', JSON.stringify(result, null, 2))

      // Firecrawl v2 API response structure
      // The API should return { success: true, data: { markdown, html, metadata, ... } }
      return NextResponse.json({
        success: true,
        data: {
          markdown: result.data?.markdown || '',
          html: result.data?.html || '',
          metadata: result.data?.metadata || {},
          rawHtml: result.data?.rawHtml || '',
          links: result.data?.links || [],
          screenshot: result.data?.screenshot || '',
        },
      })
    } catch (firecrawlError: unknown) {
      console.error('Firecrawl API error:', firecrawlError)

      // Return more specific error messages
      const errorMessage = firecrawlError instanceof Error ? firecrawlError.message : String(firecrawlError)
      if (errorMessage?.includes('401') || errorMessage?.includes('unauthorized')) {
        return NextResponse.json({error: 'Invalid API key. Please check your Firecrawl API key.'}, {status: 401})
      } else if (errorMessage?.includes('403') || errorMessage?.includes('forbidden')) {
        return NextResponse.json({error: 'Access forbidden. Please check your API key permissions.'}, {status: 403})
      } else if (errorMessage?.includes('429') || errorMessage?.includes('rate limit')) {
        return NextResponse.json({error: 'Rate limit exceeded. Please try again later.'}, {status: 429})
      } else {
        return NextResponse.json({error: `Scraping failed: ${errorMessage || 'Unknown error'}`}, {status: 500})
      }
    }
  } catch (error: unknown) {
    console.error('API route error:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}

function getMockResponse(url: string) {
  const domain = getDomainName(url)

  const mockResponse = {
    success: true,
    data: {
      markdown: `# ${domain}

**⚠️ This is a mock response because no Firecrawl API key is configured.**

To use the real Firecrawl API, please:

1. Get your API key from [https://firecrawl.dev](https://firecrawl.dev)
2. Add it to your \`.env.local\` file:
   \`\`\`
   FIRECRAWL_API_KEY=fc-your-actual-api-key
   \`\`\`
3. Restart your development server

## Sample Content for ${url}

This would normally contain the actual scraped content from the website.

### Key Features
- Clean markdown formatting
- Structured data extraction  
- Metadata preservation
- Fast processing

> Replace the API key in .env.local to see real scraping results.

### Technical Details
- **URL**: ${url}
- **Scraped at**: ${new Date().toISOString()}
- **Status**: Mock Response (API key not configured)`,
      html: `<h1>${domain}</h1><p><strong>⚠️ Mock response - configure API key to use real Firecrawl</strong></p><img src="https://picsum.photos/200/150?random=1" alt="Sample image 1" title="Mock image for demo"><img src="https://picsum.photos/200/150?random=2" alt="Sample image 2" title="Another demo image"><p>URL: ${url}</p><p>Scraped at ${new Date().toISOString()}</p>`,
      metadata: {
        title: `${domain} - Mock Response`,
        description: 'This is a mock response. Configure your Firecrawl API key to see real data.',
        url: url,
        statusCode: 200,
        timestamp: new Date().toISOString(),
        warning: 'Mock response - API key not configured',
      },
    },
  }

  return NextResponse.json(mockResponse)
}

function getDomainName(url: string): string {
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
    return parsedUrl.hostname.replace('www.', '')
  } catch {
    return 'Sample Website'
  }
}
