/*формируем массив для сортировки по уровням вида 
  (в нашем случае в форме два уровня сортировки):
   [
    {column: номер столбца, по которому осуществляется сортировка, 
     order: порядок сортировки (true по убыванию, false по возрастанию)
    },
    {column: номер столбца, 
     order: порядок сортировки
    }
   ]
*/
let createSortArr = (data) => {
    let sortArr = [];

    let sortSelects = data.getElementsByTagName('select');

    for (let i = 0; i < sortSelects.length; i++) {
        // получаем номер выбранной опции
        let keySort = sortSelects[i].value;
        // в случае, если выбрана опция Нет, заканчиваем формировать массив
        if (keySort == 0) {
            break;
        }
        // получаем номер значение флажка для порядка сортировки
        // имя флажка сформировано как имя поля SELECT и слова Desc
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push(
            {
                column: keySort - 1,
                order: desc
            }
        );
    }
    return sortArr;
};

let sortTable = (idTable, data) => {
    let sortArr = createSortArr(data);

    if (sortArr.length === 0) {
        return false;
    }

    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);

    // Удаляем строку заголовков
    let header = rowData.shift();

    // Сортируем данные с учетом порядка (по возрастанию или убыванию)
    rowData.sort((first, second) => {
        for (let i = 0; i < sortArr.length; i++) {
            let key = sortArr[i].column;
            let order = sortArr[i].order ? -1 : 1;

            let val1 = first.cells[key].innerHTML.trim();
            let val2 = second.cells[key].innerHTML.trim();

            let num1 = parseFloat(val1);
            let num2 = parseFloat(val2);

            if (!isNaN(num1) && !isNaN(num2)) {
                val1 = num1;
                val2 = num2;
            }

            if (val1 > val2) {
                return 1 * order;
            } else if (val1 < val2) {
                return -1 * order;
            }
        }
        return 0;
    });

    // Сохраняем состояние таблицы в переменной
    originalTableHTML = table.innerHTML;

    // Выводим отсортированную таблицу на страницу
    table.innerHTML = "";
    table.append(header);
    rowData.forEach(row => table.append(row));
};


// Переменная для хранения исходного состояния таблицы
let originalTableHTML = "";

// Функция сброса сортировки
let resetSort = (idTable, dataForm) => {
    let table = document.getElementById(idTable);

    // Восстанавливаем таблицу в исходное состояние
    if (originalTableHTML) {
        table.innerHTML = originalTableHTML;
    }

    // Находим все SELECT в форме сортировки и очищаем их
    let sortSelects = dataForm.getElementsByTagName("select");
    for (let select of sortSelects) {
        select.selectedIndex = 0; // Возвращаем к первой опции "Нет"
        select.disabled = select.id !== "fieldsFirst"; // Только первый SELECT остается доступным
    }

    // Сбрасываем чекбоксы сортировки
    let checkboxes = dataForm.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = false);
};
