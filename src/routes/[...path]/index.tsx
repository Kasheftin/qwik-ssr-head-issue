import { component$, useContext } from '@builder.io/qwik'
import { PATH_STORE } from '@/stores/main'
import SinglePublication from '@/pages/SinglePublication'
import PublicationsBySection from '@/pages/PublicationsBySection'
import MainPage from '@/pages/MainPage'

export default component$(() => {
  const pathStore = useContext(PATH_STORE)
  if (pathStore.isReady) {
    console.log('page', pathStore.page)
    if (pathStore.page?.type === 'SINGLE_PUBLICATION') {
      return <SinglePublication key={pathStore.page!.type} />
    } else if (pathStore.page?.type === 'PUBLICATIONS_BY_SECTION') {
      return <PublicationsBySection key={pathStore.page!.type} />
    } else if (pathStore.page?.type === 'MAIN_PAGE') {
      return <MainPage key={pathStore.page!.type} />
    } else {
      return <div>Empty Page</div>
    }
  } else if (pathStore.isValid) {
    return (
      <div>Page is Loading?</div>
    )
  } else {
    return (
      <div>
        Error {pathStore.error?.statusCode}: {pathStore.error?.message}
      </div>
    )
  }
})
