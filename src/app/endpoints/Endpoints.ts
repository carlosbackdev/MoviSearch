export class Endpoints{
    static movies: string = 'discover/movie?language=es-ES';
    static series: string = 'discover/tv'
    static movieId = (movie_id: string) =>`movie/${movie_id}?language=es-ES`
    static movieCast = (movie_id: number) =>`movie/${movie_id}/credits`
    static movieTranslate = (movie_id: string) =>`movie/${movie_id}/translations`
    static serieId = (series_id: string) =>`tv/${series_id}`
    static serieCast = (series_id: number) =>`tv/${series_id}/credits`
    static serieTranslate = (series_id: string) =>`tv/${series_id}/translations`
    static trends: string = 'trending/all/day?language=es-ES'
    static imagen: string = 'https://image.tmdb.org/t/p/'
    static searchMovies = (query: string) => `search/movie?query=${encodeURIComponent(query)}`
    static searchSeries = (query: string) => `search/tv?query=${encodeURIComponent(query)}`
    static searchProcesator = (query: string) => `api/text/process`
    static movieWatchProviders = (movie_id: string) => `movie/${movie_id}/watch/providers`;
    static serieWatchProviders = (series_id: string) => `tv/${series_id}/watch/providers`;
    static listMovieId = (item_id: string) => `find/${item_id}?language=es-ES`;
}