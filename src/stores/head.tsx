import { component$, createContextId, Slot, useContextProvider, useStore } from '@builder.io/qwik'

export type HeadStore = {
  title: string
}

export const HEAD_STORE = createContextId<HeadStore>('io.builder.qwik.pn.head')

export default component$(() => {
  const headStore = useStore<HeadStore>({
    title: 'Default Title'
  })
  useContextProvider(HEAD_STORE, headStore)
  return (
    <Slot />
  )
})
