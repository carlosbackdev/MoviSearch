export class EndpointsDiscover{

    static movieTranslate = (movie_id: string) =>`movie/${movie_id}/translations`
    static serieTranslate = (series_id: string) =>`tv/${series_id}/translations`
    static trends: string = 'trending/all/day?language=es-ES'
    static imagen: string = 'https://image.tmdb.org/t/p/'
    static movieTop: string = 'movie/top_rated?language=es-ES'
    static movieUp: string = 'movie/upcoming?language=es-ES'
    static moviePopular: string = 'movie/top_rated'
    static serieUp: string = 'tv/on_the_air?language=es-ES'
    static serieTop: string = 'tv/top_rated'
}