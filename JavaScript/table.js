let createTable = (data, idTable) => {
    // Находим таблицу
    let table = document.getElementById(idTable);
    if (!table) {
        console.error("Таблица с id " + idTable + " не найдена.");
        return;
    }

    // Очищаем таблицу перед добавлением данных
    table.innerHTML = "";

    // Проверяем, есть ли данные
    if (data.length === 0) {
        console.warn("Передан пустой массив данных.");
        return;
    }

    // Формируем заголовочную строку из ключей первого объекта массива
    let tr = document.createElement("tr");
    for (let key in data[0]) {
        let th = document.createElement("th");
        th.innerHTML = key;
        tr.append(th);
    }
    table.append(tr);

    // Создаем строки таблицы на основе массива data
    data.forEach(item => {
        let tr = document.createElement("tr"); // Создаем новую строку

        for (let key in item) {
            let td = document.createElement("td"); // Создаем ячейку
            td.innerHTML = item[key]; // Вставляем значение
            tr.append(td); // Добавляем ячейку в строку
        }

        table.append(tr); // Добавляем строку в таблицу
    });
};

// Функция для очистки таблицы
let clearTable = (idTable) => {
    // Находим таблицу по id
    let table = document.getElementById(idTable);

    // Проверяем, существует ли таблица
    if (table) {
        // Очищаем содержимое таблицы (удаляем все строки)
        table.innerHTML = '';
    } else {
        console.error(`Таблица с id "${idTable}" не найдена.`);
    }
};