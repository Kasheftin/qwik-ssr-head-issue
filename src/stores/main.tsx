import { component$, createContextId, useContextProvider, useSignal, useStore, useTask$, Slot } from '@builder.io/qwik'
import { sdk } from '@/api'

export type PageType = 'MAIN_PAGE' | 'PUBLICATIONS_BY_SECTION' | 'SINGLE_PUBLICATION'

export type SectionsStore = {
  sections: {
    id: number
    domain: string
    name: string
  }[]
  isReady: boolean
}

export type PathPage = {
  id?: number
  domain: string
  type: PageType
}

export type PathStore = {
  isValid: boolean
  isReady: boolean
  error: { statusCode: number; message: string } | null
  page: PathPage | null
}

export const SECTIONS_STORE = createContextId<SectionsStore>('io.builder.qwik.pn.sections')
export const PATH_STORE = createContextId<PathStore>('io.builder.qwik.pn.path')

export default component$<{ hostname: string; path: string }>(({ hostname, path }) => {
  const hostnameInner = useSignal(hostname)
  useTask$(({ track }) => {
    track(() => hostname)
    hostnameInner.value = hostname
  })

  const pathInner = useSignal(path)
  useTask$(({ track }) => {
    track(() => path)
    pathInner.value = path
  })

  const sectionsStore = useStore<SectionsStore>({
    sections: [],
    isReady: false
  })
  useContextProvider(SECTIONS_STORE, sectionsStore)

  useTask$(async () => {
    const data = await sdk.Sections()
    sectionsStore.sections = data.sections
    sectionsStore.isReady = true
    console.log('sectionsstore is ready')
  })

  const pathStore = useStore<PathStore>({
    isReady: false,
    isValid: true,
    error: null,
    page: null
  })
  useContextProvider(PATH_STORE, pathStore)

  useTask$(({ track }) => {
    track(() => pathInner.value)
    track(() => sectionsStore.isReady)
    console.log('pathInner', pathInner.value, 'sections', sectionsStore.isReady)
    if (!sectionsStore.isReady) {
      return
    }
    try {
      let page: PathPage | null = null
      if (!pathInner.value) {
        page = {
          domain: '',
          type: 'MAIN_PAGE'
        }
      } else {
        const ar = pathInner.value.split('/')
        console.log('ar', ar)
        const mSingleById = ar[0].match(/^n(\d+)\.html$/i)
        const mSingleByDomain = ar[0].match(/^(\S+)\.html$/i)
        const section = sectionsStore.sections.find(section => section.domain === ar[0])
        console.log('ar2', ar, mSingleById, mSingleByDomain, section)
        if (mSingleById) {
          page = {
            id: Number(mSingleById[1]),
            domain: mSingleById[0],
            type: 'SINGLE_PUBLICATION'
          }
        } else if (mSingleByDomain) {
          page = {
            domain: mSingleByDomain[1],
            type: 'SINGLE_PUBLICATION'
          }
        } else if (section) {
          page = {
            id: section.id,
            domain: section.domain,
            type: 'PUBLICATIONS_BY_SECTION'
          }
        } else {
          throw new Error('Page Not Found')
        }
        console.log('set page', page)
      }
      pathStore.page = page
      pathStore.isValid = true
      pathStore.isReady = true
    } catch (error) {
      pathStore.error = {
        statusCode: 404,
        message: error instanceof Error ? error.message : 'General Error'
      }
      pathStore.page = null
      pathStore.isValid = false
      pathStore.isReady = true
    }
  })

  return (
    <Slot />
  )
})
