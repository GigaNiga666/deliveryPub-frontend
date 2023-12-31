import styles from './Delivery.module.scss'
import {useTelegram} from "../../hooks/useTelegram";
import {FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Service} from "../../services/Service";
import {useCart} from "../../hooks/useCart";

const Delivery = () => {

    const {tg, queryId, user} = useTelegram()
    const {cart} = useCart()
    const navigate = useNavigate()
    const [currentPaymentType, setCurrentPaymentType] = useState<string>('Оплата картой')

    function validation() {
        const allInputs = document.querySelectorAll('input');
        let result = true


        for (const input of allInputs) {
            const telValid = input.id === 'inputTel' && (input.value.match(/^9/) ? input.value.match(/^\+?[9]\d{2}\d{3}\d{2}\d{2}$/) === null : input.value.match(/^\+?[78]\d{3}\d{3}\d{2}\d{2}$/) === null)
            if (input.value === '' || telValid) {
                result = false
                input.classList.add('error-validation')
                const parent = input.parentNode;
                if (!parent?.querySelector('.error-label')) {
                    const errorLabel = document.createElement('label')
                    errorLabel.classList.add('error-label')
                    errorLabel.textContent = telValid && input.value !== '' ? 'Неккоректный номер телефона' : 'Поле не заполнено!'
                    parent?.append(errorLabel)
                }
                if (parent?.querySelector('.tel-label')) {
                    parent?.querySelector('.tel-label')?.remove()
                }
            }
        }

        return result
    }

    function validateTel(evt : any) {
        let theEvent = evt;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode( key );
        let regex = /[0-9]|\+/;
        if( !regex.test(key) ) {
            theEvent.returnValue = false;
            if(theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    function buy() {

        if (!validation()) return

        const name = document.querySelector('#inputName') as HTMLInputElement
        const tel = document.querySelector('#inputTel') as HTMLInputElement
        const address = document.querySelector('#inputAddress') as HTMLInputElement
        const com = document.querySelector('#inputCom') as HTMLInputElement
        const surrender = document.querySelector('#inputSurrender') as HTMLInputElement | undefined
        const paymentType = document.querySelector('input[type="radio"]:checked') as HTMLInputElement

        const delivery = {
            name : name.value as string,
            telephone : tel.value as string,
            address : address.value as string,
            paymentType : paymentType.value as string,
            surrender : surrender ? surrender.value : null,
            com : com.value as string
        }

        tg.MainButton.disable()
        Service.sendQuery(queryId as string, cart, delivery, user?.id as number).then(() => tg.close())
    }

    function removeError(e : FormEvent<HTMLInputElement>) {
        if (e.currentTarget.classList.contains('error-validation')){
            e.currentTarget.classList.remove('error-validation')
            e.currentTarget.parentNode?.querySelector('.error-label')?.remove()
        }
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
                <div className={styles.input}><input onInput={removeError} type="text" id='inputName' placeholder='Имя'/></div>
                <div className={styles.input}><input onInput={removeError} type="tel" onChange={(e) => {
                    const input = e.currentTarget
                    const parent = input.parentNode;

                    if (!parent?.querySelector('.tel-label')) {
                        const errorLabel = document.createElement('label')
                        errorLabel.classList.add('tel-label')
                        errorLabel.textContent = 'После заказа мы свяжемся с вами для уточнения информации!'
                        parent?.append(errorLabel)
                    }
                    else if (input.value === '')
                        parent?.querySelector('.tel-label')?.remove()

                }} onKeyPress={validateTel} id='inputTel' placeholder='Телефон'/></div>
                <div className={styles.input}><input onInput={removeError} type="text" id='inputAddress' placeholder='Адрес'/></div>
            </div>
            <div className={styles.radioWrapper}>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format" defaultChecked={true} onClick={() => setCurrentPaymentType('Оплата картой')} value="Оплата картой"/>
                    <span className={styles.customRadio}></span>
                    <span>Оплата картой</span>
                </label>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format" defaultChecked={false} onClick={() => setCurrentPaymentType('Наличные')} value="Наличные"/>
                    <span className={styles.customRadio}></span>
                    <span>Наличные</span>
                </label>
            </div>
            {currentPaymentType === 'Наличные' ? <div className={styles.input}><input onInput={removeError} id='inputSurrender' type="tel" onKeyPress={validateTel} placeholder='Сдача с ...'/></div> : null}
            <textarea placeholder='Комментарий к заказу...' id='inputCom' className={styles.textArea}></textarea>
        </div>
    );
};

export {Delivery};