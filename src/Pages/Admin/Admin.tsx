import styles from './Admin.module.scss'
import {useState} from "react";
import {Service} from "../../services/Service";
import {useQuery, useQueryClient} from "react-query";
import sprite from '../../assets/icons/sprite.svg'
import {AdminModal} from "../../components/AdminModal/AdminModal";
import {IProduct} from "../../types/IProduct";
import {CategoryModal} from "../../components/CategoryModal/CategoryModal";
import {ICategory} from "../../types/ICategory";

const Admin = () => {
    const {data: response, isLoading} = useQuery('products', () => Service.getAllProducts(), {refetchOnWindowFocus: false})
    const queryClient = useQueryClient()

    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [inCorrectData, setInCorrectData] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false)
    const [modalData, setModalData] = useState<IProduct | ICategory |null>(null)
    const [currentType, setCurrentType] = useState<string>('product')
    

    const [authName, setAuthName] = useState<string>('')
    const [authPassword, setAuthPassword] = useState<string>('')

    if (!isAuth)
        return (
            <div className={styles.auth}>
                <div className={styles.authWrapper}>
                    <h3 className={styles.entry}>Вход</h3>
                    <input className={styles.authInput} value={authName}
                           onInput={(e) => setAuthName(e.currentTarget.value)} type="text"
                           placeholder='Имя пользователя'/>
                    <input className={styles.authInput} value={authPassword}
                           onInput={(e) => setAuthPassword(e.currentTarget.value)} type="password"
                           placeholder='Пароль'/>
                    <button onClick={async () => {
                        const bool = await Service.adminAuth(authName, authPassword)
                        setIsAuth(bool)
                        if (!bool) setInCorrectData(true)
                        else setInCorrectData(false)
                    }}>Войти
                    </button>
                    {
                        inCorrectData ? <span style={{color: 'red'}}>Данные не корректны!</span> : null
                    }
                </div>
            </div>
        )

    if (isLoading) return (<span>Идёт загрузка...</span>)

    if (!response) return (<span>Данных почему-то нету...</span>)

    if (modal && currentType === 'product') return <AdminModal data={response.data} setModal={setModal} product={modalData as IProduct | null} categories={response.data.categories}/>

    return (
        <>
            {modal && currentType === 'category' ? <CategoryModal category={modalData as ICategory | null} setModal={setModal}/> : null}
            <header className={styles.header}>
                <button onClick={() => setCurrentType('product')}>Товары</button>
                <button onClick={() => setCurrentType('category')}>Категории</button>
            </header>
            <div className={styles.main}>
                <div className={styles.top}>
                    <h2 className={styles.title}>{currentType === 'product' ? 'Каталог товаров' : 'Категории товаров'}</h2>
                    <button className={styles.addProduct} onClick={() => {
                        setModal(true);
                        setModalData(null)
                    }}>{currentType === 'product' ? 'Добавить товар' : 'Добавить категорию'}</button>
                </div>
                {currentType === 'product' ?
                    <table className={styles.dataTable} border={1}>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Изображение</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Цена, руб.</th>
                            <th>Категория</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            response.data.products.sort((a, b) => a.id - b.id).map(product =>
                                <tr key={product.title}>
                                    <td>{product.id}</td>
                                    <td><img src={`${import.meta.env.VITE_BACKEND_URL}/client/public/${product.image}`}
                                             alt=""/></td>
                                    <td>{product.title}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.class}, {product.category}</td>
                                    <td>
                                        <div>
                                            <button className={styles.trashBtn} onClick={async () => {
                                                await Service.deleteProduct(product.id)
                                                await queryClient.invalidateQueries(['products'])
                                            }}>
                                                <svg>
                                                    <use xlinkHref={sprite + '#trash'}/>
                                                </svg>
                                            </button>
                                            <button className={styles.pencilBtn} onClick={() => {
                                                setModalData(product)
                                                setModal(true)
                                            }}>
                                                <svg>
                                                    <use xlinkHref={sprite + '#pencil'}/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                </table> :
                    <table className={styles.dataTableCategory} border={1}>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Категория</th>
                            <th>Тип</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            response.data.categories.sort((a, b) => a.id - b.id).map(category =>
                                <tr key={category.category_title}>
                                    <td>{category.id}</td>
                                    <td>{category.category_title}</td>
                                    <td>{category.class_title}</td>
                                    <td>
                                        <div>
                                            <button className={styles.trashBtn} onClick={async () => {
                                                await Service.deleteCategory(category.id)
                                                await queryClient.invalidateQueries(['products'])
                                            }}>
                                                <svg>
                                                    <use xlinkHref={sprite + '#trash'}/>
                                                </svg>
                                            </button>
                                            <button className={styles.pencilBtn} onClick={() => {
                                                setModalData(category)
                                                setModal(true)
                                            }}>
                                                <svg>
                                                    <use xlinkHref={sprite + '#pencil'}/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>}
            </div>
        </>
    );
};

export {Admin};