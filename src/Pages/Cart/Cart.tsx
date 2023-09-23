import {useEffect, useState} from 'react';
import styles from './Cart.module.scss'
import {useCart} from "../../hooks/useCart";
import {OrderCard} from "../../components/OrderCard/OrderCard";
import {useTelegram} from "../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";
import {IProduct} from "../../types/IProduct";

const Cart = ({}) => {

    const {cart} = useCart()
    const {tg} = useTelegram()
    const navigate = useNavigate()

    const [cartState, setCartState] = useState<{product : IProduct, count : number}[]>(cart)

    function delivery() {
        navigate('/form')
        tg.MainButton.offClick(delivery)
    }

    useEffect(() => {
        tg.BackButton.show()
        tg.BackButton.onClick(() => {
            navigate('/')
            tg.BackButton.hide()
            tg.MainButton.offClick(delivery)
        })
        tg.MainButton.onClick(delivery)
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