import React, {FC, useEffect, useState} from 'react';
import styles from './Product.module.scss'
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import icons from '../../assets/icons/sprite.svg'
import {useQuery} from "react-query";
import axios from "axios";
import {getExampleData} from "../../heplers/getExampleData";
import {useTelegram} from "../../hooks/useTelegram";
import {useCart} from "../../hooks/useCart";
import {IProduct} from "../../types/IProduct";

const Product: FC = () => {
    const productId = useParams().id
    const {tg} = useTelegram()
    const navigate = useNavigate()

    const product = getExampleData().products.find(product => product.id === Number(productId)) as IProduct

    const {cart, addFromCart, removeFromCart} = useCart()
    const amountInCart = cart.find(value => value.product.id === product.id)
    const [counter, setCounter] = useState<number>(!amountInCart ? 0 : amountInCart.count)


    // const { data : product, isLoading } = useQuery('product', async () => {
    //     const {data} =  await axios.get(`http://localhost:5000/api/getProduct/${productId}`)
    //     return data
    // }, {refetchOnWindowFocus: false})
    //
    // if (isLoading) return (<span>Идёт загрузка</span>)

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