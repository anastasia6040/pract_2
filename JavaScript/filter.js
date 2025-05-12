// устанавливаем соответствие между полями формы и столбцами таблицы
let correspond = {
    "Название": "structure",
    "Жанр": "category",
    "Дата выхода": ["yearFrom", "yearTo"],
    "Страна": "country"
    /*"Город": "city",*/

    /*"Высота": ["heightFrom", "heightTo"]*/
}

let dataFilter = (dataForm) => {
    let dictFilter = {};

    // Перебираем все элементы формы с фильтрами
    for (let j = 0; j < dataForm.elements.length; j++) {
        // Выделяем очередной элемент формы
        let item = dataForm.elements[j];

        // Получаем значение элемента
        let valInput = item.value;

        // Обработка текстовых полей
        if (item.type === "text") {
            valInput = valInput.toLowerCase(); // Приводим к нижнему регистру
        }

        // Обработка числовых полей
        if (item.type === "number") {
            if (valInput !== "") {
                valInput = Number(valInput); // Преобразуем значение в число
            } else {
                // Если поле пустое, обрабатываем его в зависимости от id
                if (item.id.includes("From")) {
                    valInput = -Infinity; // Для полей с "From" устанавливаем -бесконечность
                } else if (item.id.includes("To")) {
                    valInput = Infinity; // Для полей с "To" устанавливаем +бесконечность
                }
            }
        }

        // Формируем очередной элемент ассоциативного массива
        dictFilter[item.id] = valInput;
    }

    return dictFilter;
};

// Функция для фильтрации таблицы
let filterTable = (data, idTable, dataForm) => {
    // Получаем данные из полей формы
    let datafilter = dataFilter(dataForm);

    // Фильтруем данные
    let tableFilter = data.filter(item => {
        let result = true; // Переменная для накопления результатов сравнения

        // Перебираем ключи элемента массива
        for (let key in item) {
            let val = item[key];

            // Получаем соответствующий фильтр из объекта correspond
            let filterKey = correspond[key];

            // Если фильтр для данного ключа не найден, пропускаем
            if (!filterKey) continue;

            // Обработка текстовых полей
            if (typeof val === "string") {
                val = val.toLowerCase(); // Приводим к нижнему регистру
                let filterValue = datafilter[filterKey]; // Получаем значение фильтра
                if (filterValue !== undefined) {
                    result = result && val.includes(filterValue);
                }
            }

            // Обработка числовых полей
            if (typeof val === "number") {
                // Если фильтр представляет собой интервал (массив)
                if (Array.isArray(filterKey)) {
                    let filterFrom = datafilter[filterKey[0]]; // Получаем значение "от"
                    let filterTo = datafilter[filterKey[1]]; // Получаем значение "до"

                    // Проверяем, попадает ли значение в интервал
                    if (filterFrom !== undefined && filterTo !== undefined) {
                        result &&= val >= filterFrom && val <= filterTo;
                    }
                }
            }
        }

        return result; // Возвращаем результат фильтрации
    });
    currentData = [...tableFilter];
    // Очищаем таблицу перед отображением новых данных
    clearTable(idTable);

    // Показываем на странице таблицу с отфильтрованными строками
    createTable(tableFilter, idTable);
};

// Функция для очистки фильтров и вывода исходных данных
let clearFilter = (idTable, data, form) => {
    form.reset();

    currentData = [...films];

    clearTable(idTable);
    createTable(currentData, idTable);
};