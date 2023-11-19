const abortBtn = document.getElementById('abort-btn');
const finishBtn = document.getElementById('finish-btn');

const token = localStorage.getItem("token");

if (token) {
    
    console.log("Token:", token);
} else {
    
    console.log("Token not found");
}

const headers = {
    'Authorization': `Token ${token}`
};

function changeStateToTerminate() {
    fetch("/terminate?id=1", {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (response.status === 200) {
            console.log("Terminate request successful");
            alert("Terminate request successful! Please click back button to main page.");
            //window.location.href = 'get_history_page';
        } else {
            console.error("Terminate request failed. Status: " + response.status);
            alert("Terminate request failed. Status: " + response.status);
        }
    })
    .catch(error => {
        console.error("API request failed: " + error);
        alert("API request failed: " + error);
    });
}

function changeStateToAbort() {
    fetch("/abort?id=1", {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (response.status === 200) {
            console.log("Abort request successful! Please click back button to main page.");
            alert("Abort request successful");
            //window.location.href = 'get_history_page';
        } else {
            console.error("Abort request failed. Status: " + response.status);
            alert("Abort request failed. Status: " + response.status);
        }
    })
    .catch(error => {
        console.error("API request failed: " + error);
        alert("API request failed: " + error);
    });
}

abortBtn.addEventListener('click', changeStateToAbort);
finishBtn.addEventListener('click', changeStateToTerminate);
