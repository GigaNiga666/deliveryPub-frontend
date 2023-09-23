import axios, {AxiosResponse} from "axios";
import {IProduct} from "../types/IProduct";
import {ICategory} from "../types/ICategory";

const backendLink = import.meta.env.VITE_BACKEND_URL

interface IProductsRes {
    products : IProduct[],
    categories : ICategory[]
}

interface IWebQueryReq {
    queryId : string,
    order : {name : string, style : string, amount : number}[],
    price : number
}

export const Service =  {
    async getAllProducts() : Promise<AxiosResponse<IProductsRes>> {
        return await axios.get<IProductsRes, AxiosResponse<IProductsRes>>(`${backendLink}/api/getProducts`)
    },
    async getProduct(id : number) : Promise<AxiosResponse<IProduct>>  {
        return await axios.get<IProduct, AxiosResponse<IProduct>>(`${backendLink}/api/getProduct/${id}`)
    },
    async sendQuery(query : string, cart : {product : IProduct, count : number}[]) : Promise<void> {
        const request : IWebQueryReq  = {queryId : query, order : [], price : 0}

        let finalPrice = 0;

        cart.forEach(order => {
            request.order.push({name : order.product.title, style : order.product.style_name, amount : order.count})
            finalPrice += order.product.price * order.count
        })

        request.price = finalPrice

        await axios.post<void,AxiosResponse<void>>(`${backendLink}/api/webAppQuery`, request)
    }
}
