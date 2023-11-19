const fetchDataButton = document.getElementById('getHistoryData');
const autoConfigButton = document.getElementById('autoConfig');
// const ctx = document.getElementById('tempHumidityChart').getContext('2d');
const humidityChartCtx = document.getElementById('humidityChart').getContext('2d');
const temperatureChartCtx = document.getElementById('temperatureChart').getContext('2d');
const getAllAlertBtn = document.getElementById('show-all-alerts');
//const getThresholdBtn = document.getElementById('show-all-threshold');
const temperatureData = [];
const humidityData = [];
const labels = [];

//let chart; 
let humidityChart;
let temperatureChart;
// let temperatureGauge;
// let humidityGauge

const token = localStorage.getItem("token");

if (token) {
    
    console.log("Token:", token);
} else {
    
    console.log("Token not found");
}

const headers = {
    'Authorization': `Token ${token}`
};

const viewHistroyBtn = document.getElementById("view-plant-history");
viewHistroyBtn.addEventListener('click', function() {
    
    window.location.href = "/get_history_page";
});

const changeStateBtn = document.getElementById("change-plant-state");
changeStateBtn.addEventListener('click', function() {
    
    window.location.href = "/change_plant_state";
});

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = '/'; 
    });

// const goWaterPBtn = document.getElementById("goWaterPump");
// goWaterPBtn.addEventListener("click", function () {
//         window.location.href = '/water_pump'; 
//     });




// function getLast3Alert() {
//     let alertList = document.getElementById('alert-list');
//     let details = document.getElementById('details');
//     let detailContent = document.getElementById('detail-content');
//     let closeDetails = document.getElementById('close-details');
//     let alerts = [

//     ];
//     alertList.innerHTML = '';
//     fetch("getalertslast3?plant_id=1")
//     .then(response=>{
//         return response.json();  
//     })
//     .then(data=>{
//         console.log(data);
//         if (data.unknown && data.unknown === "alert not found") {
//                 alertList.innerHTML = "No alert exist";
//                 return;
//             }
//         alerts = data;
//         alerts.slice(0, 3).forEach(alert => {
//             let listItem = document.createElement('li');
//             listItem.textContent = alert.alert_type;
//             listItem.addEventListener('click', () => {
//                 detailContent.innerHTML = alert.timestamp+"<br>"+alert.content;
//                 details.style.display = 'block';
//             });
//             alertList.appendChild(listItem);
//         });
//     })
//     .catch()

//     closeDetails.addEventListener('click', () => {
//         details.style.display = 'none';
//     });
// }
// getLast3Alert();
// setInterval(getLast3Alert, 30000);

let alerts = []; 
let currentPage = 1; 
function displayAlerts(page) {
    
    let alertsPerPage = 8; 
    let startIndex = (page - 1) * alertsPerPage;
    let endIndex = startIndex + alertsPerPage;
    if (alerts.length === 0) {
        alertListAll.innerHTML = "No alert exist";
        return;
    }
    alerts.textContent = alerts.length;
    if (startIndex < 0) {
        currentPage = 1; 
        startIndex = 0;
        endIndex = alertsPerPage;
    }

    if (startIndex >= alerts.length) {
        currentPage = Math.ceil(alerts.length / alertsPerPage);
        startIndex = (currentPage - 1) * alertsPerPage;
        endIndex = alerts.length;
    }


    const displayedAlerts = alerts.slice(startIndex, endIndex);
    let alertListAll = document.getElementById('alert-list-all')
    alertListAll.innerHTML = '';

    // displayedAlerts.forEach(alert => {
    //     let listItem = document.createElement('li');
    //     listItem.textContent = `Alert Type: ${alert.alert_type}, Timestamp: ${alert.timestamp}, Content: ${alert.content}`;
    //     alertListAll.appendChild(listItem);
    // });

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.margin = '30px';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Alert Type', 'Timestamp', 'Content'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    displayedAlerts.forEach(alert => {
        const row = document.createElement('tr');

        ['alert_type', 'timestamp', 'content'].forEach(prop => {
            const cell = document.createElement('td');
            cell.textContent = alert[prop];
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    alertListAll.appendChild(table);

    const totalPages = Math.ceil(alerts.length / alertsPerPage);
    const totalPageElement = document.getElementById('totalPage');
    const currentPageElement = document.getElementById('currentPage');
    totalPageElement.textContent = totalPages;
    currentPageElement.textContent = currentPage;

}

getAllAlertBtn.addEventListener('click', getAllAlert);
function getAllAlert(){
    let popAllAlerts = document.getElementById('pop-all-alerts');
    let alertListAll = document.getElementById('alert-list-all')
    let closeAllAlerts = document.getElementById('close-all-alerts');
    let clearAllAlerts = document.getElementById('clear-all-alerts');
    //let alerts = [];
    popAllAlerts.style.display = 'block';
    //alertListAll.innerHTML = '';
    
    fetch("getalertslast3?plant_id=1", {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);

        if (data.unknown && data.unknown === "alert not found") {
                alertListAll.innerHTML = "No alert exist";
                return;
            }
        alerts = data;
        currentPage = 1;
        displayAlerts(currentPage);
    })
    .catch();

    closeAllAlerts.addEventListener('click', () => {
        popAllAlerts.style.display = 'none';
    });

    let nextPageButton = document.getElementById('nextPageButton');
    let prevPageButton = document.getElementById('prevPageButton');

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        displayAlerts(currentPage);
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayAlerts(currentPage);
        }
    });

}


function getAlertsNumber(){
    let alertsNumber = document.getElementById('alerts-number');
    alertsNumber.style.fontWeight = 'bold';
    alertsNumber.style.fontSize ='50px';
    alertsNumber.style.padding = '63px';


    fetch("getalertslast3?plant_id=1", {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        //console.log(data);
        if (data.unknown && data.unknown === "alert not found") {
            alertsNumber.textContent = '0';
            alertsNumber.style.color = 'green';
            return;
            }
        alerts = data;
        console.log(alerts.length);
        alertsNumber.textContent = alerts.length;
        
        if (alerts.length < 3) {
            alertsNumber.style.color = 'green';
        }else if(alerts.length < 6){
            alertsNumber.style.color = '#FFA500';
        }else {
            alertsNumber.style.color = 'red';
        }
    })
    .catch();

    
}
getAlertsNumber();
setInterval(getAlertsNumber, 10000);

function clearAlert() {
    fetch("clear_alert?id=1", {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (response.status === 200) {
            return response.text(); 
        } else {
            console.error("Failed to clear alert. Status: " + response.status);
        }
    })
    .then(data => {
        console.log("Alert cleared successfully: " + data);
        location.reload();
    })
    .catch(error => {
        console.error("API request failed: " + error);

    });;
}

let clearButton = document.getElementById('clear-all-alerts');
clearButton.addEventListener('click', clearAlert);


// getThresholdBtn.addEventListener('click', setThreshold);
// function setThreshold(){
    
//     let popAllThreshold = document.getElementById('pop-all-threshold');
//     const cancelThresholdSettingBtn = document.getElementById('cancel-threshold-setting')
//     popAllThreshold.style.display = 'block';

//     cancelThresholdSettingBtn.addEventListener('click', () => {
//         popAllThreshold.style.display = 'none';
//     });
// }

const temperatureGauge = new JustGage({
    id: 'temperatureGauge',
    //data: temperatures[lastindex],
    value: 0,
    min: -10,
    max: 50,
    title: 'Current Temperature (°C)',
    label: 'Current Temperature'
});


const humidityGauge = new JustGage({
    id: 'humidityGauge',
    //data: humidities[lastindex],
    value: 0,
    min: 0,
    max: 100,
    title: 'Current Humidity (%)',
    label: 'Current Humidity'
});

function updateData() {
    fetch("/latest?plant_id=1", {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        return response.json();

    })
    .then(data => {
        console.log(data);
        //const timestamps = data.map(d => d.timestamp);  
        let latest_temp = data.temperature;
        let latest_hum = data.humidity;

        temperatureGauge.refresh(latest_temp);
        humidityGauge.refresh(latest_hum)

    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });    
}
setInterval(updateData, 10000); // update every 10 seconds
updateData();


fetchDataButton.addEventListener('click', fetchData);
function fetchData() {
    fetch("/environment?id=1", {
        method: 'GET',
        headers: headers, 
    })
    .then(response => {
        return response.json();  
    })
    .then(data => {
        console.log(data);
        const timestamps = data.map(d => d.timestamp);  
        const temperatures = data.map(d => d.temperature);
        const humidities = data.map(d => d.humidity);

        // if (chart) chart.destroy(); 
        if (humidityChart) humidityChart.destroy();
        if (temperatureChart) temperatureChart.destroy();
        

        humidityChart = new Chart(humidityChartCtx, {
          type: 'line',
          data: {
            labels: timestamps,
            datasets: [{
              label: 'Humidity (%)',
              data: humidities,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false
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


        temperatureChart = new Chart(temperatureChartCtx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
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

    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}


const autofillObject = document.getElementById('autofillObject');
autoConfigButton.addEventListener('click', checkAutofill);
function checkAutofill(){
    let input = autofillObject
    if (input.value.trim() === '') {
        alert('empty object!');
    }else{
        autoConfig(input.value);
    }
}


function autoConfig(input){
    console.log("/autoconfig?plant_name="+input);
    autoConfigButton.style.backgroundColor = 'purple';
    autoConfigButton.innerHTML = 'Pending...';
    fetch("/autoconfig?plant_name="+input, {
        method: 'GET',
        headers: headers, 
    })
    .then(response => {
        return response.json();  
    })
    .then(data => {
        console.log(data);
        let temp = data.temperature;
        let temps = temp.match(/\d+/g);
        //console.log(temps[0], temps[1])
        let hum = data.humidity;
        let hums = hum.match(/\d+/g);
        let suggestion = data.suggestion;

        let inputPlantName = input
        let high_comfttemp = document.getElementById('high_temp');
        let low_comfttemp = document.getElementById('low_temp');
        let high_comfthumidity = document.getElementById('high_humidity');
        let low_comfthumidity = document.getElementById('low_humidity');
        let description = document.getElementById('description');
        
        high_comfttemp.value = Math.max(temps[0], temps[1]);
        low_comfttemp.value = Math.min(temps[0], temps[1]);
        high_comfthumidity.value = Math.max(hums[0], hums[1]);
        low_comfthumidity.value = Math.min(hums[0], hums[1]);

        description.value = suggestion;
        autoConfigButton.style.backgroundColor = 'green';
        autoConfigButton.innerHTML = 'Auto Config';
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        autoConfigButton.style.backgroundColor = 'red';
        autoConfigButton.innerHTML = 'Fail loading';
    });

}

const configApplybtn = document.getElementById('configApplybtn');

function applyConfig(){
    let inputPlantName = document.getElementById('autofillObject');
    console.log(inputPlantName.value);
    let high_comfttemp = document.getElementById('high_temp');
    let low_comfttemp = document.getElementById('low_temp');
    let high_comfthumidity = document.getElementById('high_humidity');
    let low_comfthumidity = document.getElementById('low_humidity');
    let description = document.getElementById('description');
    let request = "/applyconfig?plant_id=1&product_id=0&plant_name=";
    let newrequest = request+inputPlantName.value+"&humidity_low="+low_comfthumidity.value+"&humidity_high="+high_comfthumidity.value+"&temperature_low="+low_comfttemp.value+"&temperature_high="+high_comfttemp.value+"&description="+description.value;
    fetch(newrequest, {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.text();
        })
    .then(data => {
        console.log(data);
        alert("update plant successful! Page will refresh in 5 Seconds");
        setTimeout(function() { location.reload(); }, 5000);
        loadPlantImage(inputPlantName.value);
        })
    .catch(error => {

        console.error("Error fetching data:", error);
    });
}
configApplybtn.addEventListener('click', applyConfig);

function loadPlantImage(name){
    let plantimage = document.getElementById('myImage');
    plantimage.src="static/image/"+name+".png";
    plantimage.alt = name;
}

window.onload = function() {
    let hint = document.getElementById('hint')
    let myimageb = document.getElementById('myImageb')
    fetch("getplantinfo?plant_id=1", {
        method: 'GET',
        headers: headers,
    })
    .then(response=>{
        return response.json();  
    })
    .then(data=>{
        console.log(data);

        if (data.unknown === 'product is empty') {
            hint.style.display = 'block';
            myimageb.style.display='none';
            
            changeStateBtn.style.backgroundColor='#808080';
            changeStateBtn.disabled = true
        }else{
            changeStateBtn.style.backgroundColor='#007BFF';
            hint.style.display = 'none';
            myimageb.style.display='block';
        }
        

        let inputPlantName = document.getElementById('autofillObject')
        let high_comfttemp = document.getElementById('high_temp');
        let low_comfttemp = document.getElementById('low_temp');
        let high_comfthumidity = document.getElementById('high_humidity');
        let low_comfthumidity = document.getElementById('low_humidity');
        let description = document.getElementById('description');


        inputPlantName.value = data.plant_name;
        low_comfttemp.value = data.temperature_low;
        high_comfttemp.value = data.temperature_high;
        low_comfthumidity.value = data.humidity_low;
        high_comfthumidity.value = data.humidity_high;
        description.value = data.description; 
        loadPlantImage(inputPlantName.value)
    })
    .catch()
};
