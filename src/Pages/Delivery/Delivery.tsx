import styles from './Delivery.module.scss'
import {useTelegram} from "../../hooks/useTelegram";
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Service} from "../../services/Service";
import {useCart} from "../../hooks/useCart";

const Delivery = () => {

    const {tg, queryId} = useTelegram()
    const {cart} = useCart()
    const navigate = useNavigate()
    const name = useRef<HTMLInputElement>(null)
    const tel = useRef<HTMLInputElement>(null)
    const address = useRef<HTMLInputElement>(null)
    const nal = useRef<HTMLInputElement>(null)
    const beznal = useRef<HTMLInputElement>(null)
    const com = useRef<HTMLTextAreaElement>(null)

    function buy() {

        if (!name.current || !tel.current || !address.current || !nal.current || !beznal.current || !com.current) return

        const delivery = {
            name : name.current.value,
            telephone : tel.current.value,
            address : address.current.value,
            paymentType : nal.current?.checked ? nal.current?.value : beznal.current?.value,
            com : com.current.value
        }

        tg.MainButton.disable()
        Service.sendQuery(queryId as string, cart, delivery).then(() => tg.close())
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
                <input ref={name} type="text" className={styles.input} placeholder='Имя'/>
                <input ref={tel} type="tel" className={styles.input} placeholder='Телефон'/>
                <input ref={address} type="text" className={styles.input} placeholder='Адрес'/>
            </div>
            <fieldset className={styles.radioWrapper}>
                <label className={styles.radioLabel}>
                    <input ref={nal} className={styles.radio} type="radio" name="format" checked value="наличные"/>
                    <span className={styles.customRadio}></span>
                    <span>Наличными</span>
                </label>
                <label className={styles.radioLabel}>
                    <input ref={beznal} className={styles.radio} type="radio" name="format"  value="безнал"/>
                    <span className={styles.customRadio}></span>
                    <span>Безналичными</span>
                </label>
            </fieldset>
            <textarea ref={com} placeholder='Комментарий к заказу...' className={styles.textArea}></textarea>
        </div>
    );
};

export {Delivery};