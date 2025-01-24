// Interfaz para las traducciones de series
export interface SeriesTranslations {
    iso_639_1: string;
    iso_3166_1?: string;
    data: {
      name: string;
      overview: string;
      tagline: string;
      homepage: string;
    };
  }
  