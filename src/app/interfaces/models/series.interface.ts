export interface SeriesData{
    page: number
    results: SerieResult[]
    total_pages: number
    total_results: number
}

export interface SerieResult{
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_country: string[]
    original_language: string
    original_name: string
    overview: string
    popularity: number
    poster_path: string
    fist_air_date: string
    name: string
    video: boolean
    vote_average: number
    vote_count: number
}