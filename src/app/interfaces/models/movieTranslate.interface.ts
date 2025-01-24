export interface MovieTranslationData {
    homepage: string;  
    overview: string;   
    runtime: number;    
    tagline: string;    
    title: string;      
  }
  
  export interface MovieTranslation {
    iso_3166_1: string;           // Código del país (ISO 3166-1)
    iso_639_1: string;            // Código del idioma (ISO 639-1)
    name: string;                 
    english_name: string;         
    data: MovieTranslationData;   
  }
  
  export interface MovieTranslationsResponse {
    id: number;                
    translations: MovieTranslation[]; 
  }
  