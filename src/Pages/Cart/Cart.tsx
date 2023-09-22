import {FC, useEffect, useState} from 'react';
import styles from './Cart.module.scss'
import {useCart} from "../../hooks/useCart";
import {OrderCard} from "../../components/OrderCard/OrderCard";
import {useTelegram} from "../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";
import {IProduct} from "../../types/IProduct";
import axios, {AxiosResponse} from "axios";

interface CartProps {
}

const Cart: FC<CartProps> = ({}) => {

    const {cart} = useCart()
    const {tg} = useTelegram()
    const navigate = useNavigate()

    const [cartState, setCartState] = useState<{product : IProduct, count : number}[]>(cart)

    async function invoice() {
        tg.MainButton.disable()
        //@ts-ignore
        const {data} = await axios.post<AxiosResponse<string>>(`${import.meta.env.VITE_BACKEND_URL}/api/getInvoiceLink`)
        tg.MainButton.enable()
        //@ts-ignore
        await tg.openInvoice(data)
    }

    useEffect(() => {
        tg.BackButton.show()
        tg.BackButton.onClick(() => {
            navigate('/')
            tg.BackButton.hide()
            tg.MainButton.offClick(invoice)
        })
        tg.MainButton.disable()
        tg.MainButton.onClick(invoice)
        tg.MainButton.enable()
    }, [])

    useEffect(() => {
        let finalPrice = 0;

        cart.forEach(order => {
            finalPrice += order.product.price * order.count
        })

        tg.MainButton.text = 'Оплатить ' + finalPrice
    }, [cartState])


    return (
        <div className={styles.cart}>
            <h2 className={styles.title}>Корзина</h2>
            <ul className={styles.orderList}>
                {
                    !cartState.length ? <span>Ваша корзина пустая</span> :
                        cartState.map(order =>
                        <OrderCard update={setCartState} order={order}/>
                    )
                }
            </ul>
        </div>
    );
};

export {Cart};