export interface Cast {
    id: number;
    name: string;
    known_for_department: string;  
    profile_path: string; 
    character: string;  
  }
  
  export interface Crew {
    id: number;
    name: string;
    job: string; 
    profile_path: string;
  }
  
  export interface MovieCastResponse {
    cast: Cast[];  
    crew: Crew[];  
  }
  