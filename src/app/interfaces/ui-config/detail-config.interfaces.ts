export interface DetailConfig{
    img: string;
    description:string;
    subtitle?: string;
    rate: number;
    detailCards: DetailCard[]
    titleDescription: string;
    logo:string;
    watchProviders?: {
        flatrate: any[];
        rent: any[];
        buy: any[];
      };
}
export interface DetailCard{
    title:string;
    description: string;
}