import { component$, useContext, useResource$, Resource } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { PATH_STORE } from '@/stores/main'
import { HEAD_STORE } from '@/stores/head'
import { sdk } from '@/api'

export default component$(() => {
  const pathStore = useContext(PATH_STORE)
  const headStore = useContext(HEAD_STORE)

  const resource = useResource$(async () => {
    const data = await sdk.SinglePublication(pathStore.page!.domain, pathStore.page!.id)
    headStore.title = 'Single publication ' + data.publication.name
    return data.publication
  })

  return (
    <div>
      <div>
        <strong>
          Single publication for {pathStore.page!.domain}:
        </strong>
      </div>
      <div>Back to <Link href="/">Home Page</Link></div>
      <Resource
        value={resource}
        onPending={() => (
          <div>Loading...</div>
        )}
        onRejected={(error) => (
          <div>Error: {error.message}</div>
        )}
        onResolved={(data) => (
          <div>
            <strong>
              {data.name}
            </strong>
          </div>
        )}
      />
    </div>
  )
})
