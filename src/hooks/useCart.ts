import {IProduct} from "../types/IProduct";
import {useTelegram} from "./useTelegram";
import {getExampleData} from "../heplers/getExampleData";

// const cart : {product : IProduct, count : number}[] = [{product :getExampleData().products[0], count: 3}, {product :getExampleData().products[1], count: 2}]
const cart : {product : IProduct, count : number}[] = []

export function useCart() {
    const {tg} = useTelegram()

    function addFromCart(product : IProduct) {

        const currentOrder = cart.find(order => order.product.id === product.id)

        currentOrder ? currentOrder.count++ : cart.push({product, count: 1})

        if (!tg.MainButton.isVisible) tg.MainButton.show()
    }

    function removeFromCart(id : number) {
        const currentOrder = cart.find(order => order.product.id === id)

        currentOrder.count--

        if (currentOrder.count === 0)
            cart.splice(cart.indexOf(currentOrder), 1)

        if (!cart.length) tg.MainButton.hide()
    }

    return {
        cart,
        addFromCart,
        removeFromCart
    }
}