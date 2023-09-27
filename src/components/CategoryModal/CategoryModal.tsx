import {FC} from 'react';
import styles from './CategoryModal.module.scss'
import {ICategory} from "../../types/ICategory";
import sprite from "../../assets/icons/sprite.svg";
import {Service} from "../../services/Service";
import {useQueryClient} from "react-query";

interface CategoryModalProps {
    category : ICategory | null,
    setModal : Function,
}

const CategoryModal: FC<CategoryModalProps> = ({category, setModal}) => {
    const queryClient = useQueryClient()

    async function click() {
        const categoryInput = document.querySelector('#category') as HTMLInputElement
        const classTitle = document.querySelector('#classTitle') as HTMLInputElement

        if (!categoryInput.value) return alert('Не все данные введены!')
        if (!category) await Service.createCategory({category_title : categoryInput.value, class_title : classTitle.value as string})
        else await Service.updateCategory({category_title : categoryInput.value, class_title : classTitle.value as string, id : category.id})
        await queryClient.invalidateQueries(['products'])
        setModal(false)
    }

    return (
        <div className={styles.modal}>
            <div className={styles.window}>
                <button className={styles.cross} onClick={() => setModal(false)}>
                    <svg>
                        <use xlinkHref={sprite + '#cross'}/>
                    </svg>
                </button>
                <p>Категория</p>
                <input id='category' type="text"  defaultValue={category?.category_title} placeholder='Введите текст...'/>
                <p>Тип</p>
                <select id='classTitle' defaultValue={category?.class_title}>
                    <option value={'Еда'}>Еда</option>
                    <option value={'Напитки'}>Напитки</option>
                </select>
                <button className={styles.btn} onClick={() => click()}>Сохранить</button>
            </div>
        </div>
    );
};

export {CategoryModal};