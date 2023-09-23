import styles from './Delivery.module.scss'
import {useTelegram} from "../../hooks/useTelegram";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Service} from "../../services/Service";
import {useCart} from "../../hooks/useCart";

const Delivery = () => {

    const {tg, queryId} = useTelegram()
    const {cart} = useCart()
    const navigate = useNavigate()

    function buy() {
        tg.MainButton.disable()
        Service.sendQuery(queryId as string, cart).then(() => tg.close())
    }

    useEffect(() => {
        tg.BackButton.show()
        tg.BackButton.onClick(() => {
            navigate('/cart')
            tg.BackButton.hide()
            tg.MainButton.offClick(buy)
        })
        tg.MainButton.onClick(buy)

        let finalPrice = 0;

        cart.forEach(order => {
            finalPrice += order.product.price * order.count
        })

        tg.MainButton.text = 'Закончить. Сумма оплаты: ' + finalPrice
    }, [])

    return (
        <div className={styles.form}>
            <h2 className={styles.title}>Доставка</h2>
            <div className={styles.wrapper}>
                <input type="text" className={styles.input} placeholder='Имя'/>
                <input type="tel" className={styles.input} placeholder='Телефон'/>
                <input type="text" className={styles.input} placeholder='Адрес'/>
            </div>
            <fieldset className={styles.radioWrapper}>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format" checked value="nal"/>
                    <span className={styles.customRadio}></span>
                    <span>Наличными</span>
                </label>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format"  value="beznal"/>
                    <span className={styles.customRadio}></span>
                    <span>Безналичными</span>
                </label>
            </fieldset>
            <textarea placeholder='Комментарий к заказу...' className={styles.textArea}></textarea>
        </div>
    );
};

export {Delivery};