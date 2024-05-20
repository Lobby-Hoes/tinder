function login() {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                location.href = '/';
            } else {
                console.error(xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    }));


}

function register() {
    location.href = '/register?username=' + document.getElementById('username').value;
}