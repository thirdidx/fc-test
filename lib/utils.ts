import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ImageData = {
  src: string
  alt: string
  title?: string
}

export type ScrapeResult = {
  success: boolean
  data?: {
    markdown: string
    html: string
    images: ImageData[]
    metadata: Record<string, unknown>
  }
  error?: string
}

export type RecentRun = {
  id: string
  url: string
  status: 'success' | 'error' | 'loading'
  timestamp: Date
  result?: ScrapeResult
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

export const parseImagesFromHtml = (html: string): ImageData[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const imgTags = doc.querySelectorAll('img')

  return Array.from(imgTags)
    .map((img) => ({
      src: img.src || img.getAttribute('data-src') || '',
      alt: img.alt || 'Image',
      title: img.title,
    }))
    .filter((img) => img.src && !img.src.startsWith('data:'))
    .slice(0, 20) // Limit to first 20 images
}

export const downloadImage = (src: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = src
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const formatUrl = (inputUrl: string): string => {
  if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
    return `https://${inputUrl}`
  }
  return inputUrl
}
