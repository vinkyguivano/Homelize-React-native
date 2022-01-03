const professionalType = [
  { id: 1, name: 'Arsitek'},
  { id: 2, name: 'Desainer Interior'}
]

const professionalSorting = [
  { id: 0, name: 'Terdekat'},
  { id: 1, name: 'Terbaik'},
  { id: 2, name: 'Terpopuler'}
]

const homeArchitecturePackage = [
  {
    id: 1,
    name: 'Paket Silver',
    desc:`  \u2022 3D Eksterior (4 view)
  \u2022 Siteplan
  \u2022 Situasi
  \u2022 Denah
  \u2022 Tampak`,
    price: 40000
  },
  {
    id: 2,
    name: 'Paket Gold',
    desc:`  \u2022 3D Eksterior (4 view)
  \u2022 Siteplan
  \u2022 Situasi
  \u2022 Denah
  \u2022 Tampak
  \u2022 Potongan
  \u2022 Detail Arsitektur
  \u2022 Detail Struktur
  \u2022 Detail MEP`,
    price: 60000
  },
]

export {
  professionalType,
  professionalSorting,
  homeArchitecturePackage
}
