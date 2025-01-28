export interface DetailConfig{
    img: string;
    subtitle?: string;
    rate: string;
    detailCards: DetailCard[]
}
export interface DetailCard{
    title:string;
    description: string;
}