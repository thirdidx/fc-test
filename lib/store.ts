import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {ScrapeResult, RecentRun} from './utils'

interface AppState {
  // Scraping state
  url: string
  isLoading: boolean
  result: ScrapeResult | null
  activeTab: 'markdown' | 'media' | 'raw'
  recentRuns: RecentRun[]

  // Actions
  setUrl: (url: string) => void
  setIsLoading: (loading: boolean) => void
  setResult: (result: ScrapeResult | null) => void
  setActiveTab: (tab: 'markdown' | 'media' | 'raw') => void
  addRecentRun: (run: RecentRun) => void
  updateRecentRun: (id: string, updates: Partial<RecentRun>) => void
  clearResults: () => void
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
        }),
    }),
    {
      name: 'firecrawl-playground',
    }
  )
)
