import {FC, useEffect, useState} from 'react';
import styles from './App.module.scss'
import logo from '../../assets/Logo_B.svg'
import sprite from '../../assets/icons/sprite.svg'
import {Card} from "../../components/Card/Card";
import {useQuery} from "react-query";
import axios from "axios";
import {useTelegram} from "../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";

interface AppProps {
}

async function fetchProducts() {
    const {data} =  await axios.get(`https://deliverypub-backend.onrender.com/api/getProducts`)
    return data
}

const App: FC<AppProps> = ({}) => {

    const { data , isLoading } = useQuery('products', fetchProducts, {refetchOnWindowFocus: false})

    if (isLoading) {
        return (<span>Идёт загрузка...</span>)
    }

    const [searchInput, setSearchInput] = useState<string>('')
    const [currentCategory, setCategory] = useState<string>('')
    const [currentClass, setCurrentClass] = useState<string>('Пиво')
    const {tg} = useTelegram()
    const navigate = useNavigate()

    tg.onEvent('viewportChanged', () => {
        if (!tg.isExpanded) tg.expand()
    })

    function clickOnMainBtn() {
        navigate('/cart')
        tg.MainButton.offClick(clickOnMainBtn)
    }

    useEffect(() => {
        tg.ready()
        tg.expand()
        tg.MainButton.color = '#1F1F1F'
        tg.MainButton.text = 'Корзина'
        tg.MainButton.onClick(clickOnMainBtn)
    }, [])

    //@ts-ignore
    const products =  data.products.filter(product => {
        const checkCategory = !currentCategory || product.category === currentCategory
        const checkClass = product.class === currentClass

        return searchInput === '' ? checkCategory && checkClass : checkCategory && checkClass && product.title.toLowerCase().includes(searchInput.toLowerCase())
    })

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <img className={styles.logo} src={logo} alt="" />
            </div>
            <div className={styles.search}>
                <div className={styles.container}>
                    <div className={styles.searchWrapper}>
                        <svg className={styles.searchIcon}>
                            <use xlinkHref={`${sprite}#loupe`}/>
                        </svg>
                        <input
                            type="text"
                            className={styles.searchInput}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.currentTarget.value)}
                            placeholder='Искать...'/>
                    </div>
                </div>
            </div>
            <div className={styles.products}>
                <div className={styles.container}>
                    <div className={styles.buttonsProducts}>
                        <button className={`${styles.buttonProduct} ${currentClass === 'Пиво' ? styles.active : ''}`} onClick={() => setCurrentClass('Пиво')}>
                            <svg className={styles.buttonIcon}>
                                <use xlinkHref={`${sprite}#beer`}/>
                            </svg>
                            <span>Пиво</span>
                        </button>
                        <button className={`${styles.buttonProduct} ${currentClass === 'Еда' ? styles.active : ''}`} onClick={() => setCurrentClass('Еда')}>
                            <svg className={styles.buttonIcon}>
                                <use xlinkHref={`${sprite}#food`}/>
                            </svg>
                            <span>Еда</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.navigation}>
                <ul className={styles.navigationList}>
                    <li className={styles.navigationItem}>
                        <button onClick={() => setCategory('')} className={!currentCategory ? styles.navigationItemActive : ''}>Все</button>
                    </li>
                    {
                        //@ts-ignore
                        data.categories.map(category => (
                            <li key={category.id} className={styles.navigationItem}>
                                <button
                                    onClick={() => setCategory(category.category_title)}
                                    className={currentCategory === category.category_title ? styles.navigationItemActive : ''}
                                >
                                    {category.category_title}
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className={styles.container}>
                <ul className={styles.cardList}>
                    {
                        !products.length ? <span>Ничего не удалось найти по вашему запросу :(</span> :
                            //@ts-ignore
                            products.map(product =>
                                <Card key={product.id} product={product}/>
                            )
                    }
                </ul>
            </div>
        </div>

    );
};

export {App};