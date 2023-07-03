import { component$, useContext, useTask$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { SECTIONS_STORE } from '@/stores/main'
import { HEAD_STORE } from '@/stores/head'

export default component$(() => {
  const sectionsStore = useContext(SECTIONS_STORE)
  const headStore = useContext(HEAD_STORE)

  useTask$(() => {
    headStore.title = 'Main Page Title'
  })

  return (
    <div>
      <div>
        <strong>
          Publications by Section:
        </strong>
      </div>
      <div>
        <ul>
          {sectionsStore.sections.map((section) => (
            <li key={section.id}>
              <Link href={'/' + section.domain + '/'}>
                {section.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})
