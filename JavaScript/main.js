document.addEventListener("DOMContentLoaded", function () {
    
    createTable(films, 'list');

    // По умолчанию показываем максимальные значения по странам (как в оригинале)
    drawGraph(currentData, "Страна", false, true, "scatter");


    const plotBtn = document.getElementById('plotGraph');
    if (plotBtn) {
        plotBtn.addEventListener('click', function () {
            const xAxis = document.querySelector('input[name="xAxis"]:checked').value;
            const showMin = document.getElementById('showMin').checked;
            const showMax = document.getElementById('showMax').checked;
            const chartType = document.getElementById('chartType').value;

            // Находим именно текст чекбоксов (span или текст внутри label)
            const minText = document.querySelector('#showMin').parentElement;
            const maxText = document.querySelector('#showMax').parentElement;


            // Сбрасываем стили ошибок
            resetErrorStyles(minText, maxText);


            if (!showMin && !showMax) {
                // Подсвечиваем label красным
                minText.classList.add('error-label');
                maxText.classList.add('error-label');
                return;
            }

            drawGraph(currentData, xAxis, showMin, showMax, chartType);
        });
    }

    // Функция для сброса стилей ошибок
    function resetErrorStyles(...labels) {
        labels.forEach(label => {
            if (label) {
                label.classList.remove('error-label');
            }
        });
    }

    // Добавляем обработчики для сброса ошибки при выборе
    document.getElementById('showMin').addEventListener('change', function () {
        resetErrorStyles(
            document.querySelector('label[for="showMin"]'),
            document.querySelector('label[for="showMax"]')
        );
    });

    document.getElementById('showMax').addEventListener('change', function () {
        resetErrorStyles(
            document.querySelector('label[for="showMin"]'),
            document.querySelector('label[for="showMax"]')
        );
    });

    //////////////////

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

    document.getElementById("fieldsSecond").addEventListener("change", function () {
        changeNextSelect("fieldsThird", this);
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
    nextSelect.innerHTML = curSelect.innerHTML; // Копируем все опции

    // Удаляем в следующем SELECT уже выбранную в текущем опцию (если она не "Нет")
    if (curSelect.value != "0") {
        let selectedOption = nextSelect.querySelector(`option[value="${curSelect.value}"]`);
        if (selectedOption) {
            selectedOption.remove();
        }
    } else {
        nextSelect.disabled = true;
    }
};