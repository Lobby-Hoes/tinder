var stage = 1;
var totalStages = 4;

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    document.querySelector('#username').value = params.get('username');
}

function nextStage() {
    setStage(stage, ++stage);
}

function previousStage() {
    setStage(stage, --stage);
}

function setStage(oldStage, newStage) {

    if(newStage > totalStages) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    window.location.href = '/';
                } else {
                    console.error(xhr.responseText);
                }
            }
        }
        xhr.send(JSON.stringify({
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value,
            name: document.querySelector('#name').value,
            birthday: document.querySelector('#birthday').value,
            city: document.querySelector('#city').value,
            job: document.querySelector('#job').value,
            sex: document.querySelector('#sex').value,
            pronouns: document.querySelector('#pronouns').value,
            sexuality: document.querySelector('#sexuality').value,
            romantic: document.querySelector('#romantic').value,
        }));


        return;
    }

    document.querySelectorAll('.stage-' + oldStage).forEach((el) => {
       el.classList.add('is-hidden');
    });

    document.querySelectorAll('.stage-' + newStage).forEach((el) => {
       el.classList.remove('is-hidden');
    });

    if(stage > 1) {
        document.querySelector('.previous-stage').classList.remove('is-hidden');
    } else {
        document.querySelector('.previous-stage').classList.add('is-hidden');
    }
}