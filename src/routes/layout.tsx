import { component$, Slot } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import MainStore from '@/stores/main'

export const useRouteLoader = routeLoader$(({ url, params }) => {
  return {
    hostname: url.hostname,
    path: params.path
  }
})

export default component$(() => {
  const routeLoader = useRouteLoader()
  return (
    <MainStore hostname={routeLoader.value.hostname} path={routeLoader.value.path}>
      <Slot />
    </MainStore>
  )
})
