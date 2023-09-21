import {IProduct} from "../types/IProduct";
import {ICategory} from "../types/ICategory";

export function getExampleData() : {products : IProduct[], categories : ICategory[]}  {
    return JSON.parse('{\n' +
        '    "products": [\n' +
        '        {\n' +
        '            "id": 5,\n' +
        '            "title": "Replica Sultan",\n' +
        '            "image": "1.png",\n' +
        '            "description": "крутое пиво",\n' +
        '            "price": 450,\n' +
        '            "alcohol_percent": 10,\n' +
        '            "liter": 0.6,\n' +
        '            "bitterness": 90,\n' +
        '            "country": "USA",\n' +
        '            "brewery_name": "Zagovor Brewery",\n' +
        '            "style_name": "New Engalnd IBA",\n' +
        '            "category": "Тёмное",\n' +
        '            "class": "Пиво"\n' +
        '        },\n' +
        '        {\n' +
        '            "id": 4,\n' +
        '            "title": "GGG Sultan",\n' +
        '            "image": "2.png",\n' +
        '            "description": "крутое пиво",\n' +
        '            "price": 300,\n' +
        '            "alcohol_percent": 6,\n' +
        '            "liter": 0.5,\n' +
        '            "bitterness": 120,\n' +
        '            "country": "gfgf",\n' +
        '            "brewery_name": "fggf",\n' +
        '            "style_name": "gfg",\n' +
        '            "category": "Тёмное",\n' +
        '            "class": "Пиво"\n' +
        '        },\n' +
        '        {\n' +
        '            "id": 6,\n' +
        '            "title": "Myracco Sudaru",\n' +
        '            "image": "3.png",\n' +
        '            "description": "крутое пиво",\n' +
        '            "price": 500,\n' +
        '            "alcohol_percent": 11,\n' +
        '            "liter": 0.6,\n' +
        '            "bitterness": 90,\n' +
        '            "country": "USA",\n' +
        '            "brewery_name": "Zagovor Brewery",\n' +
        '            "style_name": "New Engalnd IBA",\n' +
        '            "category": "Светлое",\n' +
        '            "class": "Пиво"\n' +
        '        }\n' +
        '    ],\n' +
        '    "categories": [\n' +
        '        {\n' +
        '            "id": 1,\n' +
        '            "category_title": "Тёмное",\n' +
        '            "class_title": "Пиво"\n' +
        '        },\n' +
        '        {\n' +
        '            "id": 2,\n' +
        '            "category_title": "Светлое",\n' +
        '            "class_title": "Пиво"\n' +
        '        }\n' +
        '    ]\n' +
        '}')
}