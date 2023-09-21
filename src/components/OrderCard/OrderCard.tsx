import React, {FC, useState} from 'react';
import styles from './OrderCard.module.scss'
import {IProduct} from "../../types/IProduct";
import {useCart} from "../../hooks/useCart";

interface OrderCardProps {
    order : {product : IProduct, count : number},
    update : Function
}

const OrderCard: FC<OrderCardProps> = ({order, update}) => {

    const {cart, addFromCart, removeFromCart} = useCart()
    const [counter, setCounter] = useState<number>(order.count)

    if (counter !== order.count) setCounter(order.count)

    function counterClick(value : number) {
        value === 1 ? addFromCart(order.product) : removeFromCart(order.product.id)
        setCounter(prev => prev + value)
        update([...cart])
    }

    return (
        <li className={styles.card}>
            <img src={`./images/${order.product.image}`} alt="" className={styles.image}/>
            <div className={styles.content}>
                <span className={styles.title}>{order.product.title}</span>
                <span className={styles.breweryName}>{order.product.brewery_name}</span>
                <span className={styles.price}>₽{order.product.price}</span>
            </div>
            <div className={styles.counter}>
                <button className={styles.minus} disabled={counter === 0} onClick={() => counterClick(-1)}>—</button>
                <p className={styles.count}>{counter}</p>
                <button className={styles.plus} onClick={() => counterClick(1)}>+</button>
            </div>
        </li>
    );
};

export {OrderCard};