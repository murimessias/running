export type Team = {
  id: number
  abbreviation: string
  city: string
  conference: string
  division: string
  full_name: string
  name: string
}

export type Meta = {
  total_pages: number
  current_page: number
  next_page: number | null
  per_page: number
  total_count: number
}
