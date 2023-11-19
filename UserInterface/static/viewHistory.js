const token = localStorage.getItem('token');
const itemsPerPage = 4;

let currentPage = 1;

const tableBody = document.getElementById('data-table-body');

function showPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    tableBody.innerHTML = '';

    fetch('/get_history?id=0',{headers: {
        Authorization: `Token ${token}`
      }})
        .then(response => response.json())
        .then(data => {
            const reversedData = [...data].reverse();

            for (let i = startIndex; i < endIndex && i < reversedData.length; i++) {
                const item = reversedData[i];
                let row = tableBody.insertRow();
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);
                cell1.textContent = item.plant_id;
                cell2.textContent = item.plant_name;
                cell3.textContent = item.status;
                cell4.textContent = item.description;
            }
        })
        .catch(error => {
            console.error("Data error: " + error);
        });
}

showPage(currentPage);

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    fetch('/get_history?id=0', {headers: {
        Authorization: `Token ${token}`
      }})
        .then(response => response.json())
        .then(data => {
            if (data.length > currentPage * itemsPerPage) {
                currentPage++;
                showPage(currentPage);
            }
        })
        .catch(error => {
            console.error("Data error: " + error);
        });
});
