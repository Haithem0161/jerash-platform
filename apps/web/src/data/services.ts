import {
  Activity,
  Boxes,
  Cable,
  ClipboardCheck,
  Cog,
  Compass,
  Droplet,
  Factory,
  FileSearch,
  Flame,
  FlaskConical,
  Fuel,
  Gauge,
  GraduationCap,
  Layers,
  type LucideIcon,
  Pipette,
  Settings,
  Target,
  TestTube,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'

export type ServiceCategory = 'production' | 'wireline' | 'consultancy' | 'other'

export interface Service {
  id: string
  category: ServiceCategory
  icon: LucideIcon
}

export const services: Service[] = [
  // Production Services (8)
  { id: 'coiledTubing', category: 'production', icon: Cog },
  { id: 'drillingFluid', category: 'production', icon: Droplet },
  { id: 'cementing', category: 'production', icon: Layers },
  { id: 'nitrogen', category: 'production', icon: FlaskConical },
  { id: 'filtration', category: 'production', icon: Pipette },
  { id: 'pipelines', category: 'production', icon: Cable },
  { id: 'waterProduction', category: 'production', icon: Droplet },
  { id: 'artificialLift', category: 'production', icon: Target },

  // Wireline Services (7)
  { id: 'wirelineLogging', category: 'wireline', icon: Activity },
  { id: 'wellTesting', category: 'wireline', icon: TestTube },
  { id: 'stimulationPumping', category: 'wireline', icon: Zap },
  { id: 'thruTubing', category: 'wireline', icon: Wrench },
  { id: 'slickline', category: 'wireline', icon: Cable },
  { id: 'completions', category: 'wireline', icon: Settings },
  { id: 'scaffolding', category: 'wireline', icon: Boxes },

  // Consultancy Services (8)
  { id: 'importMachinery', category: 'consultancy', icon: Truck },
  { id: 'importChemicals', category: 'consultancy', icon: FlaskConical },
  { id: 'importGasStation', category: 'consultancy', icon: Fuel },
  { id: 'processing', category: 'consultancy', icon: Factory },
  { id: 'customsClearance', category: 'consultancy', icon: ClipboardCheck },
  { id: 'explosives', category: 'consultancy', icon: Flame },
  { id: 'inspection', category: 'consultancy', icon: FileSearch },
  { id: 'training', category: 'consultancy', icon: GraduationCap },

  // Other Services (3)
  { id: 'fuelStations', category: 'other', icon: Fuel },
  { id: 'mudLogging', category: 'other', icon: Gauge },
  { id: 'integratedDrilling', category: 'other', icon: Compass },
]

// Category helpers
export const serviceCategories: ServiceCategory[] = [
  'production',
  'wireline',
  'consultancy',
  'other',
]

export const getServicesByCategory = (category: ServiceCategory): Service[] => {
  return services.filter((service) => service.category === category)
}

export const getServiceById = (id: string): Service | undefined => {
  return services.find((service) => service.id === id)
}
