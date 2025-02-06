export interface Movie {
    id: number;      // ID interno de la película
    movieId: number; // ID de la película original (de la API)
  }
  
export interface List {
    id: number;       // ID de la lista
    name: string;     // Nombre de la lista
    movies: Movie[];  // Array de películas asociadas a la lista
  }
  