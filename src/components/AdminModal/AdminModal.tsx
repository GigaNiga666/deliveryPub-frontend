import {FC, useState} from 'react';
import styles from './AdminModal.module.scss'
import sprite from "../../assets/icons/sprite.svg";
import {IProductsRes, Service} from "../../services/Service";
import {IProduct} from "../../types/IProduct";
import {ICategory} from "../../types/ICategory";
import {useQueryClient} from "react-query";

interface AdminModalProps {
    data : IProductsRes,
    setModal : Function,
    product : IProduct |  null,
    categories : ICategory[]
}

const AdminModal: FC<AdminModalProps> = ({data, setModal, product, categories}) => {

    const [currentType, setCurrentType] = useState<string>(product?.alcohol_percent ? 'alc' : 'notalc')
    const queryClient = useQueryClient()

    function validate(evt : any) {
        let theEvent = evt;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode( key );
        let regex = /[0-9]|\.|\,/;
        if( !regex.test(key) ) {
            theEvent.returnValue = false;
            if(theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    function fileUpload() {
        let reader = new FileReader()
        const inputFile = document.querySelector('#file-upload') as HTMLInputElement
        const previewImg = document.querySelector('#preview-img') as HTMLImageElement
        if (inputFile?.files) reader.readAsDataURL(inputFile.files[0])
        reader.onload = () => {
            previewImg.src = String(reader.result)
        }
    }

    async function saveToDb() {
        const file = document.querySelector('#file-upload') as HTMLInputElement
        const title = document.querySelector('#title') as HTMLInputElement
        const price = document.querySelector('#price') as HTMLInputElement
        const volume = document.querySelector('#volume') as HTMLInputElement
        const description = document.querySelector('#description') as HTMLInputElement
        const category_id = document.querySelector('#category_id') as HTMLInputElement
        const compound = document.querySelector('#compound') as HTMLInputElement
        const alcohol_percent = document.querySelector('#alcohol_percent') as HTMLInputElement
        const bitterness = document.querySelector('#bitterness') as HTMLInputElement
        const country = document.querySelector('#country') as HTMLInputElement
        const brewery_name = document.querySelector('#brewery_name') as HTMLInputElement
        const style_name = document.querySelector('#style_name') as HTMLInputElement

        if (!file?.files?.length && !product) return alert('Загрузите фото!')

        if (!title.value || !price.value || !volume.value || !description.value) return alert('Не все данные заполнены!')

        if (currentType === 'alc' && (!alcohol_percent.value || !bitterness.value || !country.value || !brewery_name.value || !style_name.value)) return alert('Не все данные заполнены!')
        else if (compound && !compound.value) return alert('Не все данные заполнены!')

        const formData = new FormData()
        if (product) formData.append('id', String(product.id))
        if ((!product || file?.files?.length) && file?.files) formData.append('file', file.files[0])
        formData.append('title', title.value)
        //@ts-ignore
        formData.append('image', !product || file?.files?.length ? file.files[0].name : product.image)
        formData.append('price', price.value)
        formData.append('volume', volume.value)
        formData.append('description', description.value)
        formData.append('alcohol_percent', currentType === 'alc' ? alcohol_percent.value : 'null')
        formData.append('bitterness', currentType === 'alc' ? bitterness.value : 'null')
        formData.append('country', currentType === 'alc' ? country.value : 'null')
        formData.append('brewery_name', currentType === 'alc' ? brewery_name.value : 'null')
        formData.append('style_name', currentType === 'alc' ? style_name.value : 'null')
        formData.append('compound', currentType === 'notalc' ? compound.value : 'null')
        formData.append('category_id', String(categories.find(category => category.category_title === category_id.value.split(' | ')[0])?.id))
        if (product) await Service.updateProduct(formData)
        else await Service.createProduct(formData)
        await queryClient.invalidateQueries(['products'])
        setModal(false)
    }

    return (
        <div className={styles.modal}>
            <button className={styles.cross} onClick={() => setModal(false)}>
                <svg>
                    <use xlinkHref={sprite + '#cross'}/>
                </svg>
            </button>
            <div className={styles.wrapper}>
                    <div className={styles.inputField}><p className={styles.inputTitle}>Название:</p><input type="text" defaultValue={product?.title} id='title' placeholder='Введите текст...'/></div>
                    <div className={`${styles.inputField} ${styles.fileImage}`}>
                        <p className={styles.inputTitle}>Изображение:</p>
                        <input onChange={() => fileUpload()} type="file" accept='image/png' id='file-upload'/>
                        <img src={product ? `${import.meta.env.VITE_BACKEND_URL}/client/public/${product.image}` : ''} id='preview-img' alt=""/>
                        <label htmlFor="file-upload" >Загрузить фото</label>
                    </div>
                    <div className={styles.inputField}><p className={styles.inputTitle}>Цена:</p><input id='price' onKeyPress={validate} type="text"  defaultValue={product?.price} placeholder='Введите текст...'/></div>
                    <div className={styles.inputField}><p className={styles.inputTitle}>Объём, литраж:</p><input id='volume' onKeyPress={validate} type="text"  defaultValue={product?.volume} placeholder='Введите текст...'/></div>
            </div>
            <div className={styles.inputField}>
                <p className={styles.inputTitle}>Категория:</p>
                <select id='category_id' defaultValue={`${product?.category} | ${product?.class}`}>
                {
                    data.categories.map(category =>
                        <option value={`${category.category_title} | ${category.class_title}`} key={category.id}>{category.category_title} | {category.class_title}</option>
                    )
                }
                </select>
            </div>
            <div className={styles.radioWrapper}>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format" defaultChecked={product?.alcohol_percent ? true : false} onClick={() => setCurrentType('alc')} value='alc'/>
                    <span className={styles.customRadio}></span>
                    <span>Алкогольное</span>
                </label>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format" defaultChecked={product?.alcohol_percent ? false : true} onClick={() => setCurrentType('notalc')} value='notalc'/>
                    <span className={styles.customRadio}></span>
                    <span>Безалкогольное</span>
                </label>
            </div>
            {
                currentType === 'alc' ?
                    <div className={styles.alcWrapper}>
                        <div className={styles.inputField}><p className={styles.inputTitle}>% Алкоголя:</p><input onKeyPress={validate}  id='alcohol_percent' defaultValue={product?.alcohol_percent} type="text" placeholder='Введите текст...'/></div>
                        <div className={styles.inputField}><p className={styles.inputTitle}>Горечь:</p><input onKeyPress={validate} id='bitterness' defaultValue={product?.bitterness} type="text" placeholder='Введите текст...'/></div>
                        <div className={styles.inputField}><p className={styles.inputTitle}>Страна:</p><input id='country' defaultValue={product?.country} type="text" placeholder='Введите текст...'/></div>
                        <div className={styles.inputField}><p className={styles.inputTitle}>Стиль:</p><input id='style_name' defaultValue={product?.style_name} type="text" placeholder='Введите текст...'/></div>
                        <div className={styles.inputField}><p className={styles.inputTitle}>Пивоварня:</p><input id='brewery_name' defaultValue={product?.brewery_name} type="text" placeholder='Введите текст...'/></div>
                    </div>
                    : <div className={styles.inputField}><p className={styles.inputTitle}>Состав:</p><input id='compound' defaultValue={product?.compound} type="text" placeholder='Введите текст...'/></div>

            }
            <div className={styles.inputField}><p className={styles.inputTitle}>Описание:</p><textarea id='description' defaultValue={product?.description} className={styles.textArea} placeholder='Введите текст...'></textarea></div>
            <button className={styles.finishBtn} onClick={() => saveToDb()}>Сохранить</button>
        </div>
    );
};

export {AdminModal};