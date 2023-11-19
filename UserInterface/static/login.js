const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", function () {
    let productCode;
    const productCodeInput = document.getElementById("product-code");
    productCode = productCodeInput.value;         
    localStorage.setItem("token", productCode);
    if (productCode !== 'null') {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        checkToken(productCode);
    }
});

function checkToken(tok) {
    fetch('/token/check', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${tok}`
        }
    })
    .then(response => { 
        return response.json(); })
    .then(data => {
        if (data.status === "success"){
            window.location.href = '/index';
        }else{
            alert("Invalid token");
        }
        
    })
    .catch(error => {
        alert("Invalid Device Identity Code");
        console.error('Error:', error);
    });
}
