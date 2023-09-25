import {FC, useEffect, useState} from 'react';
import styles from './Product.module.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {useTelegram} from "../../hooks/useTelegram";
import {useCart} from "../../hooks/useCart";
import {Service} from "../../services/Service";

const Product: FC = () => {
    const productId = useParams().id
    const {tg} = useTelegram()
    const navigate = useNavigate()

    const { data : response, isLoading } = useQuery(['product', productId], () => Service.getProduct(Number(productId)), {refetchOnWindowFocus: false})

    const {cart, addFromCart, removeFromCart} = useCart()
    const amountInCart = cart.find(value => value.product.id === Number(productId))
    const [counter, setCounter] = useState<number>(!amountInCart ? 0 : amountInCart.count)

    useEffect(() => {
        if (amountInCart) setCounter(amountInCart.count)
        tg.BackButton.show()
        tg.BackButton.onClick(() => {
            navigate('/')
            tg.BackButton.hide()
        })
    }, [])

    if (isLoading) return (<span>Идёт загрузка</span>)
    if (!response) return (<span>Данные по неизвестной причине отсутствуют</span>)

    const product = response.data
    const isAlcohol : boolean = !!product.alcohol_percent

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
                    {
                        isAlcohol ? `${product.alcohol_percent}% ABV | ${product.volume} Liter | ${product.bitterness} IBU | ${product.country} | ${product.style_name}` :
                            `${product.volume}${product.class === 'Напитки' ? ' Liter' : 'g'}`
                    }

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
                    {
                        !isAlcohol &&
                        <p className={styles.compound}>
                          <span className={styles.descriptionTitle}>Состав:</span>
                            {product.compound}
                        </p>
                    }
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