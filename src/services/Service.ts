import axios, {AxiosResponse} from "axios";
import {IProduct} from "../types/IProduct";
import {ICategory} from "../types/ICategory";

const backendLink = import.meta.env.VITE_BACKEND_URL

export interface IProductsRes {
    products : IProduct[],
    categories : ICategory[]
}

interface IWebQueryReq {
    queryId : string,
    order : {name : string, amount : number}[],
    price : number,
    delivery : IDelivery,
    userLink : number
}

interface IDelivery { name : string, telephone : string, address : string, paymentType : string, com : string, surrender : string | null}

export const Service =  {
    async getAllProducts() : Promise<AxiosResponse<IProductsRes>> {
        return await axios.get<IProductsRes, AxiosResponse<IProductsRes>>(`${backendLink}/api/getProducts`)
    },
    async getProduct(id : number) : Promise<AxiosResponse<IProduct>>  {
        return await axios.get<IProduct, AxiosResponse<IProduct>>(`${backendLink}/api/getProduct/${id}`)
    },
    async sendQuery(query : string, cart : {product : IProduct, count : number}[], delivery : IDelivery, userLink : string) : Promise<void> {
        const request : IWebQueryReq  = {queryId : query, order : [], price : 0, delivery, userLink}

        let finalPrice = 0;

        cart.forEach(order => {
            request.order.push({name : order.product.title, amount : order.count})
            finalPrice += order.product.price * order.count
        })

        request.price = finalPrice

        await axios.post<void,AxiosResponse<void>>(`${backendLink}/api/webAppQuery`, request)
    },
    async adminAuth(username : string, password : string) : Promise<boolean> {
        const {data} = await axios.post<boolean,AxiosResponse<boolean>>(`${backendLink}/api/adminAuth`, {username, password})
        return data
    },
    async createProduct(formData : FormData) {
        return await axios.post(`${backendLink}/api/createProduct`, formData)
    },
    async updateProduct(formData : FormData) {
        return await axios.post(`${backendLink}/api/updateProduct`, formData)
    },
    async deleteProduct(id : number) {
        return await axios.post(`${backendLink}/api/deleteProduct`, {id})
    },
    async createCategory(data : {category_title : string, class_title : string}) {
        return await axios.post(`${backendLink}/api/createCategory`, {category_title : data.category_title, class_title: data.class_title})
    },
    async updateCategory(data : {category_title : string, class_title : string, id : number}) {
        return await axios.post(`${backendLink}/api/updateCategory`, {category_title : data.category_title, class_title: data.class_title, id : data.id})
    },
    async deleteCategory(id : number) {
        return await axios.post(`${backendLink}/api/deleteCategory`, {id})
    },
}
