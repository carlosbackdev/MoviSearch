export class Endpoints{
    static movies: string = 'discover/movie';
    static series: string = 'discover/tv'
    static movieId = (movie_id: string) =>`movie/${movie_id}`
    static movieTranslate = (movie_id: string) =>`movie/${movie_id}/translations`
    static serieId = (series_id: string) =>`tv/${series_id}`
    static serieTranslate = (series_id: string) =>`tv/${series_id}/translations`
    static trends: string = 'trending/all/day?language=en-US'
    static imagen: string = 'https://image.tmdb.org/t/p/'
    static searchMovies = (query: string) => `search/movie?query=${encodeURIComponent(query)}`
    static searchProcesator = (query: string) => `api/text/process`
    static movieWatchProviders = (movie_id: string) => `movie/${movie_id}/watch/providers`;
    static serieWatchProviders = (series_id: string) => `tv/${series_id}/watch/providers`;
}