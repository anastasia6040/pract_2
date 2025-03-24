/*��������� ������ ��� ���������� �� ������� ���� 
  (� ����� ������ � ����� ��� ������ ����������):
   [
    {column: ����� �������, �� �������� �������������� ����������, 
     order: ������� ���������� (true �� ��������, false �� �����������)
    },
    {column: ����� �������, 
     order: ������� ����������
    }
   ]
*/
let createSortArr = (data) => {
    let sortArr = [];

    let sortSelects = data.getElementsByTagName('select');

    for (let i = 0; i < sortSelects.length; i++) {
        // �������� ����� ��������� �����
        let keySort = sortSelects[i].value;
        // � ������, ���� ������� ����� ���, ����������� ����������� ������
        if (keySort == 0) {
            break;
        }
        // �������� ����� �������� ������ ��� ������� ����������
        // ��� ������ ������������ ��� ��� ���� SELECT � ����� Desc
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

    // ������� ������ ����������
    let header = rowData.shift();

    // ��������� ������ � ������ ������� (�� ����������� ��� ��������)
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

    // ��������� ��������� ������� � ����������
    originalTableHTML = table.innerHTML;

    // ������� ��������������� ������� �� ��������
    table.innerHTML = "";
    table.append(header);
    rowData.forEach(row => table.append(row));
};


// ���������� ��� �������� ��������� ��������� �������
let originalTableHTML = "";

// ������� ������ ����������
let resetSort = (idTable, dataForm) => {
    let table = document.getElementById(idTable);

    // ��������������� ������� � �������� ���������
    if (originalTableHTML) {
        table.innerHTML = originalTableHTML;
    }

    // ������� ��� SELECT � ����� ���������� � ������� ��
    let sortSelects = dataForm.getElementsByTagName("select");
    for (let select of sortSelects) {
        select.selectedIndex = 0; // ���������� � ������ ����� "���"
        select.disabled = select.id !== "fieldsFirst"; // ������ ������ SELECT �������� ���������
    }

    // ���������� �������� ����������
    let checkboxes = dataForm.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = false);
};
