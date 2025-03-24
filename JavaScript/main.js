document.addEventListener("DOMContentLoaded", function () {
    createTable(films, 'list');

    // Добавляем обработчик для кнопки "Найти"
    document.getElementById("findButton").addEventListener("click", function () {
        let form = document.getElementById("filter");
        // Сброс сортировки перед фильтрацией
        resetSort("list", document.getElementById("sort"));
        filterTable(films, "list", form);
    });

    // Добавляем обработчик для кнопки "Очистить фильтры"
    document.querySelector("input[value='Очистить фильтры']").addEventListener("click", function () {
        let form = document.getElementById("filter");
        // Сброс сортировки перед очисткой фильтров
        resetSort("list", document.getElementById("sort"));
        clearFilter("list", films, form);
    });

    // Вызов функции для заполнения полей сортировки
    setSortSelects(films[0], document.getElementById("sort"));

    // Добавляем обработчик для первого уровня сортировки
    document.getElementById("fieldsFirst").addEventListener("change", function () {
        changeNextSelect("fieldsSecond", this);
    });

    document.querySelector("input[value='Сортировать']").addEventListener("click", function () {
        sortTable("list", document.getElementById("sort"));
    });

    document.querySelector("input[value='Сбросить сортировку']").addEventListener("click", function () {
        resetSort("list", document.getElementById("sort"));
    });
});

// формирование полей элемента списка с заданным текстом и значением

let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

// формирование поля со списком 
// параметры – массив со значениями элементов списка и элемент select

let setSortSelect = (arr, sortSelect) => {

    // создаем OPTION Нет и добавляем ее в SELECT
    sortSelect.append(createOption('Нет', 0));

    // перебираем все ключи переданного элемента массива данных
    for (let i in arr) {
        // создаем OPTION из очередного ключа и добавляем в SELECT
        // значение атрибута VAL увеличиваем на 1, так как значение 0 имеет опция Нет
        sortSelect.append(createOption(arr[i], Number(i) + 1));
    }
}

// Функция для формирования полей со списком для двух уровней сортировки
let setSortSelects = (data, dataForm) => {
    // Выделяем ключи из первого элемента массива films
    let head = Object.keys(data);

    // Находим все SELECT в форме
    let allSelect = dataForm.getElementsByTagName('select');

    // Перебираем все SELECT
    for (let j = 0; j < allSelect.length; j++) {
        // Формируем очередной SELECT
        setSortSelect(head, allSelect[j]);

        // Все SELECT, кроме первого, делаем неизменяемыми
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }
};

// настраиваем поле для следующего уровня сортировки
let changeNextSelect = (nextSelectId, curSelect) => {

    let nextSelect = document.getElementById(nextSelectId);

    nextSelect.disabled = false;

    // в следующем SELECT выводим те же option, что и в текущем
    nextSelect.innerHTML = curSelect.innerHTML;

    // удаляем в следующем SELECT уже выбранную в текущем опцию
    // если это не первая опция - отсутствие сортировки
    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
    }
};