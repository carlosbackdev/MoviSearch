export interface DetailConfig{
    img: string;
    description:string;
    subtitle?: string;
    rate: number;
    detailCards: DetailCard[]
    titleDescription: string;
    logo:string;
}
export interface DetailCard{
    title:string;
    description: string;
}