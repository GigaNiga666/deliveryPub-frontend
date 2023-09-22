import {FC, useEffect, useState} from 'react';
import styles from './Product.module.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import axios from "axios";
import {useTelegram} from "../../hooks/useTelegram";
import {useCart} from "../../hooks/useCart";

const Product: FC = () => {
    const productId = useParams().id
    const {tg} = useTelegram()
    const navigate = useNavigate()

    const { data : product, isLoading } = useQuery('product', async () => {
        const {data} =  await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getProduct/${productId}`)
        return data
    }, {refetchOnWindowFocus: false})

    const {cart, addFromCart, removeFromCart} = useCart()
    const amountInCart = cart.find(value => value.product.id === product.id)
    const [counter, setCounter] = useState<number>(!amountInCart ? 0 : amountInCart.count)

    if (amountInCart && amountInCart.count !== counter) setCounter(amountInCart.count)

    useEffect(() => {
        tg.BackButton.show()
        tg.BackButton.onClick(() => {
            navigate('/')
            tg.BackButton.hide()
        })
    }, [])

    function counterClick(value : number) {
        setCounter(prev => prev === 0 && value === -1 ? 0 : prev + value)
        value === 1 ? addFromCart(product) : removeFromCart(product.id)
    }

    if (isLoading) return (<span>Идёт загрузка</span>)

    return (
        <div className={styles.product}>
            <div className={styles.productImage}>
                <img src={`./images/${product.image}`} alt=""/>
            </div>
            <div className={styles.productContent}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{product.title}</h3>
                    <h2 className={styles.breweryName}>{product.brewery_name}</h2>
                </div>
                <div className={styles.features}>
                    {product.alcohol_percent}% ABV | {product.liter} Liter | {product.bitterness} IBU | {product.country} | {product.style_name}
                </div>
                <div className={styles.numbers}>
                    <span className={styles.price}>₽{product.price}</span>
                    <div className={styles.counter}>
                        <button className={styles.minus} disabled={counter === 0} onClick={() => counterClick(-1)}>—</button>
                        <p className={styles.count}>{counter}</p>
                        <button className={styles.plus} onClick={() => counterClick(1)}>+</button>
                    </div>
                </div>
                <div className={styles.text}>
                    <span className={styles.descriptionTitle}>Описание</span>
                    <p className={styles.descriptionText}>
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export {Product};