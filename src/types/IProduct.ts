export interface IProduct {
    id : number,
    title : string,
    image : string,
    description : string,
    price : number,
    alcohol_percent? : number,
    volume : number,
    bitterness? : number,
    country? : string,
    brewery_name? : string,
    style_name? : string,
    compound : string,
    category : string,
    class : string
}