const sections = [
  { id: 1, domain: 'first', name: 'First Section' },
  { id: 2, domain: 'second', name: 'Second Section' },
  { id: 3, domain: 'third', name: 'Section with error'}
]

const publications = [
  { id: 1, domain: '', name: 'First Publication - no domain', sections: [1] },
  { id: 2, domain: '', name: 'Second Publication - no domain', sections: [1] },
  { id: 3, domain: 'custom-domain', name: 'Third Publication with custom domain', sections: [1, 2] },
  { id: 4, domain: '', name: 'Publication #4', sections: [2] },
  { id: 5, domain: '', name: 'Publication #5', sections: [2] },
  { id: 6, domain: 'another-domain', name: 'Publication #6 with another domain', sections: [2] }
]

const delay = (timeout: number) => (new Promise((resolve) => {
  setTimeout(resolve, timeout)
}))

export const sdk = {
  Sections: async () => {
    await delay(100)
    return { sections }
  },
  PublicationsBySection: async (id: number | undefined) => {
    await delay(100)
    if (id === 3 || !id) {
      throw new Error('Sample Error')
    }
    if (!sections.some(section => section.id === id)) {
      throw new Error('Section not found')
    }
    return { publications: publications.filter(publication => publication.sections.includes(id)) }
  },
  SinglePublication: async (domain: string, id?: number | undefined) => {
    await delay(100)
    const publication = publications.find(publication => (publication.domain && publication.domain === domain) || (!publication.domain && publication.id === id))
    if (!publication) {
      throw new Error('Publication not found')
    }
    return { publication }
  }
}
