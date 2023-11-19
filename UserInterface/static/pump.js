const token = localStorage.getItem("token");

let ctx = document.getElementById('waterChart').getContext('2d');
let waterChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Water Volume (mL)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

let totalWater = 0;
let totalWaterLabel = document.getElementById('totalWater');
totalWaterLabel.textContent = totalWater;

fetch('get_irrigation?id=1',{headers: {
        Authorization: `Token ${token}`
      }})
    .then(response => response.json())
    .then(apiData => {
        console.log(apiData);
        updateChartWithAPIData(apiData);

    })
    .catch(error => {
        console.error('Failed to fetch data from API:', error);
    });


function updateChartWithAPIData(apiData) {
    const waterData = apiData.map(item => item.volume);
    const timestamps = apiData.map(item => item.timestamp);

    const totalWater = waterData.reduce((total, currentValue) => total + currentValue, 0);

    document.getElementById('totalWater').textContent = totalWater;

    waterChart.data.labels = timestamps;
    waterChart.data.datasets[0].data = waterData;

    waterChart.update();
}
// let waterButton = document.getElementById('waterButton');
// waterButton.addEventListener('click', function() {
//     let waterAmount = Math.floor(Math.random() * 10) + 1;
//     totalWater += waterAmount;
//     totalWaterLabel.textContent = totalWater;
    
//     waterChart.data.labels.push(new Date().toLocaleTimeString());
//     waterChart.data.datasets[0].data.push(waterAmount);
//     waterChart.update();
// });

let returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', function() {
});
