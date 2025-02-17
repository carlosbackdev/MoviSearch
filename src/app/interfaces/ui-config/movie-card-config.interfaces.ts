export interface MovieCardConfig{
    img:string;
    rate:number;
    movieName:string;
    id?:number;
    onClick?: () => any
    onAddClick?: () => any;
}