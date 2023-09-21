import React, {FC} from 'react';
import styles from './Card.module.scss'
import {Link} from "react-router-dom";
import {IProduct} from "../../types/IProduct";

interface CardProps {
    product : IProduct
}

const Card: FC<CardProps> = ({product}) => {
    return (
        <Link to={String(product.id)}>
            <li className={styles.card}>
                <img src={`./images/${product.image}`} alt="" className={styles.img}/>
                <div className={styles.content}>
                    <span className={styles.price}><span className={styles.currency}>₽</span>{product.price}</span>
                    <span className={styles.name}>{product.title}</span>
                </div>
            </li>
        </Link>
    );
};

export {Card};