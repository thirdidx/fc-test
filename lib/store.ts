import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {ScrapeResult, RecentRun} from './utils'

export type FormatType = 'markdown' | 'summary' | 'links' | 'html' | 'screenshot' | 'json'

export interface FormatOption {
  id: FormatType
  label: string
  icon?: string
  subOptions?: { label: string; value: string }[]
}

interface AppState {
  // Scraping state
  url: string
  isLoading: boolean
  result: ScrapeResult | null
  activeTab: 'markdown' | 'media' | 'raw'
  recentRuns: RecentRun[]
  selectedFormats: FormatType[]
  isAccordionOpen: boolean

  // Actions
  setUrl: (url: string) => void
  setIsLoading: (loading: boolean) => void
  setResult: (result: ScrapeResult | null) => void
  setActiveTab: (tab: 'markdown' | 'media' | 'raw') => void
  addRecentRun: (run: RecentRun) => void
  updateRecentRun: (id: string, updates: Partial<RecentRun>) => void
  clearResults: () => void
  setSelectedFormats: (formats: FormatType[]) => void
  toggleFormat: (format: FormatType) => void
  setAccordionOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      url: '',
      isLoading: false,
      result: null,
      activeTab: 'markdown',
      recentRuns: [],
      selectedFormats: ['markdown', 'html'],
      isAccordionOpen: false,

      // Actions
      setUrl: (url: string) => set({url}),

      setIsLoading: (loading: boolean) => set({isLoading: loading}),

      setResult: (result: ScrapeResult | null) => set({result}),

      setActiveTab: (tab: 'markdown' | 'media' | 'raw') => set({activeTab: tab}),

      addRecentRun: (run: RecentRun) =>
        set((state) => ({
          recentRuns: [run, ...state.recentRuns.slice(0, 4)],
        })),

      updateRecentRun: (id: string, updates: Partial<RecentRun>) =>
        set((state) => ({
          recentRuns: state.recentRuns.map((run) => (run.id === id ? {...run, ...updates} : run)),
        })),

      clearResults: () =>
        set({
          result: null,
          url: '',
          isLoading: false,
          isAccordionOpen: false,
        }),

      setSelectedFormats: (formats: FormatType[]) => set({selectedFormats: formats}),

      toggleFormat: (format: FormatType) =>
        set((state) => ({
          selectedFormats: state.selectedFormats.includes(format)
            ? state.selectedFormats.filter((f) => f !== format)
            : [...state.selectedFormats, format],
        })),

      setAccordionOpen: (open: boolean) => set({isAccordionOpen: open}),
    }),
    {
      name: 'firecrawl-playground',
    }
  )
)
