import { component$, useComputed$, useContext, useResource$, useTask$, Resource } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { PATH_STORE, SECTIONS_STORE } from '@/stores/main'
import { HEAD_STORE } from '@/stores/head'
import { sdk } from '@/api'

export default component$(() => {
  const sectionsStore = useContext(SECTIONS_STORE)
  const pathStore = useContext(PATH_STORE)
  const headStore = useContext(HEAD_STORE)

  const section = useComputed$(() => {
    return sectionsStore.sections.find(section => section.id === pathStore.page!.id)
  })

  useTask$(({ track }) => {
    track(() => section.value?.name)
    headStore.title = 'Section ' + section.value?.name
  })

  const resource = useResource$(async () => {
    const data = await sdk.PublicationsBySection(pathStore.page!.id)
    return data.publications
  })

  return (
    <div>
      <div>
        <strong>
          Publications for Section {section.value?.name}:
        </strong>
        <div>Back to <Link href="/">Home Page</Link></div>
      </div>
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
            <ul>
              {data.map((publication) => (
                <li key={publication.id}>
                  <Link href={'/' + (publication.domain || 'n' + publication.id) + '.html'}>
                    {publication.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      />
    </div>
  )
})
