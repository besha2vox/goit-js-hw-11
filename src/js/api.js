// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.
// У відповіді буде масив зображень, що задовольнили критерії параметрів запиту. Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:

import axios from 'axios';

export class API {
  constructor(query) {
    this.URL = 'https://pixabay.com/api/';
    this.API_KEY = '31766266-b4c442347c7d8dfc69a6e358e';
    this.query = query;
    this.page = 1;
  }

  getPhotos() {
    return axios.get(
      `${this.URL}?key=${this.API_KEY}&q=${this.query}&image_type=photo&safesearch=true&orientation=horizontal`
    );
  }

  pageIncrement() {
    this.page += 1;
  }
}
