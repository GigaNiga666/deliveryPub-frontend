import axios, {AxiosResponse} from "axios";
import {IProduct} from "../types/IProduct";
import {ICategory} from "../types/ICategory";

const backendLink = import.meta.env.VITE_BACKEND_URL

interface IProductsRes {
    products : IProduct[],
    categories : ICategory[]
}

export const Service =  {
    async getAllProducts() : Promise<AxiosResponse<IProductsRes>> {
        return await axios.get<IProductsRes, AxiosResponse<IProductsRes>>(`${backendLink}/api/getProducts`)
    },
    async getProduct(id : number) : Promise<AxiosResponse<IProduct>>  {
        return await  axios.get<IProduct, AxiosResponse<IProduct>>(`${backendLink}/api/getProduct/${id}`)
    },
    async getInvoiceLink() : Promise<string> {
        const {data} = await axios.post<string,AxiosResponse<string>>(`${backendLink}/api/getInvoiceLink`)
        return data
    }
}
