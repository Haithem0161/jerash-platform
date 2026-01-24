export interface Job {
  id: string
  titleKey: string
  departmentKey: string
  locationKey: string
  typeKey: string
  descriptionKey: string
  fullDescriptionKey: string
}

export const jobs: Job[] = [
  {
    id: 'petroleum-engineer',
    titleKey: 'jobs.petroleumEngineer.title',
    departmentKey: 'jobs.petroleumEngineer.department',
    locationKey: 'jobs.petroleumEngineer.location',
    typeKey: 'jobs.petroleumEngineer.type',
    descriptionKey: 'jobs.petroleumEngineer.description',
    fullDescriptionKey: 'jobs.petroleumEngineer.fullDescription',
  },
  {
    id: 'hse-officer',
    titleKey: 'jobs.hseOfficer.title',
    departmentKey: 'jobs.hseOfficer.department',
    locationKey: 'jobs.hseOfficer.location',
    typeKey: 'jobs.hseOfficer.type',
    descriptionKey: 'jobs.hseOfficer.description',
    fullDescriptionKey: 'jobs.hseOfficer.fullDescription',
  },
  {
    id: 'wireline-operator',
    titleKey: 'jobs.wirelineOperator.title',
    departmentKey: 'jobs.wirelineOperator.department',
    locationKey: 'jobs.wirelineOperator.location',
    typeKey: 'jobs.wirelineOperator.type',
    descriptionKey: 'jobs.wirelineOperator.description',
    fullDescriptionKey: 'jobs.wirelineOperator.fullDescription',
  },
  {
    id: 'accountant',
    titleKey: 'jobs.accountant.title',
    departmentKey: 'jobs.accountant.department',
    locationKey: 'jobs.accountant.location',
    typeKey: 'jobs.accountant.type',
    descriptionKey: 'jobs.accountant.description',
    fullDescriptionKey: 'jobs.accountant.fullDescription',
  },
  {
    id: 'field-technician',
    titleKey: 'jobs.fieldTechnician.title',
    departmentKey: 'jobs.fieldTechnician.department',
    locationKey: 'jobs.fieldTechnician.location',
    typeKey: 'jobs.fieldTechnician.type',
    descriptionKey: 'jobs.fieldTechnician.description',
    fullDescriptionKey: 'jobs.fieldTechnician.fullDescription',
  },
]
