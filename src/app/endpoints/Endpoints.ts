export class Endpoints{
    static movies: string = 'discover/movie';
    static series: string = 'discover/tv'
    static movieId = (movie_id: string) =>`movie/${movie_id}`
    static serieId = (series_id: string) =>`movie/${series_id}`
    static trends: string = 'trending/all/day?language=en-US'
    static image: string = 'https://image.tmdb.org/t/p/'
}