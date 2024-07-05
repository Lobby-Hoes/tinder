var stage = 1;
var totalStages = 4;

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    document.querySelector('#username').value = params.get('username');

    // City handler
    //On focus
    document.querySelector('#city').addEventListener('focus', function () {
        document.querySelector('.input-autocomplete').classList.remove('is-hidden');
    });
    //On blur
    document.querySelector('#city').addEventListener('blur', function () {
        setTimeout(function () {
            document.querySelector('.input-autocomplete').classList.add('is-hidden');
        }, 100);
    });
    //On Input
    var timeout;
    document.querySelector('#city').addEventListener('input', function () {
        clearTimeout(timeout);

        timeout = setTimeout(async function () {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=name%2C%20coordinates%2C%20country_code%2C%20admin3_code%2C%20admin1_code&where=search(name%2C%20%22' + document.querySelector('#city').value + '%22)&limit=5&refine=cou_name_en%3A%22Germany%22&refine=cou_name_en%3A%22Austria%22&refine=cou_name_en%3A%22Switzerland%22', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        document.querySelector('.input-autocomplete').innerHTML = '';
                        for (city of data.results) {
                            document.querySelector('.input-autocomplete').classList.remove('is-hidden');
                            document.querySelector('.input-autocomplete').innerHTML = document.querySelector('.input-autocomplete').innerHTML + ` 
                            <button class="button city-button is-fullwidth" onclick="selectCity('${city.name}, ' + getState('${city.admin1_code}', '${city.admin3_code}', '${city.country_code}'), ${city.coordinates.lon}, ${city.coordinates.lat})">
                                <span class="fi fi-${city.country_code.toLowerCase()}"></span>
                                <span class="text-wrap">${city.name}, ${getState(city.admin1_code, city.admin3_code, city.country_code)}</span>
                            </button>
                            <hr class="city-line">
                            `;
                        }
                    }
                }
            }
            xhr.send();
        }, 500);
    });
}

function selectCity(cityname, lon, lat) {
    document.querySelector('#city').value = cityname;
    document.querySelector('#city').setAttribute('lon', lon);
    document.querySelector('#city').setAttribute('lat', lat);
}

function getState(code1, code3, country) {
    if (country === 'DE') {
        code3 = code3.substring(0, 2);
        switch (code3) {
            case '01':
                return 'Schleswig-Holstein';
            case '02':
                return 'Hamburg';
            case '03':
                return 'Niedersachsen';
            case '04':
                return 'Bremen';
            case '05':
                return 'Nordrhein-Westfalen';
            case '06':
                return 'Hessen';
            case '07':
                return 'Rheinland-Pfalz';
            case '08':
                return 'Baden-Württemberg';
            case '09':
                return 'Bayern';
            case '10':
                return 'Saarland';
            case '11':
                return 'Berlin';
            case '12':
                return 'Brandenburg';
            case '13':
                return 'Mecklenburg-Vorpommern';
            case '14':
                return 'Sachsen';
            case '15':
                return 'Sachsen-Anhalt';
            case '16':
                return 'Thüringen';
        }
    } else if (country === 'AT') {
        code3 = code3.substring(0, 1);
        switch (code3) {
            case '1':
                return 'Burgenland';
            case '2':
                return 'Kärnten';
            case '3':
                return 'Niederösterreich';
            case '4':
                return 'Oberösterreich';
            case '5':
                return 'Salzburg';
            case '6':
                return 'Steiermark';
            case '7':
                return 'Tirol';
            case '8':
                return 'Vorarlberg';
            case '9':
                return 'Wien';
        }
    } else if (country === 'CH') {
        switch (code1) {
            case 'AG':
                return 'Aargau';
            case 'AI':
                return 'Appenzell Innerrhoden';
            case 'AR':
                return 'Appenzell Ausserrhoden';
            case 'BE':
                return 'Bern';
            case 'BL':
                return 'Basel-Landschaft';
            case 'BS':
                return 'Basel-Stadt';
            case 'FR':
                return 'Freiburg';
            case 'GE':
                return 'Genf';
            case 'GL':
                return 'Glarus';
            case 'GR':
                return 'Graubünden';
            case 'JU':
                return 'Jura';
            case 'LU':
                return 'Luzern';
            case 'NE':
                return 'Neuenburg';
            case 'NW':
                return 'Nidwalden';
            case 'OW':
                return 'Obwalden';
            case 'SG':
                return 'St. Gallen';
            case 'SH':
                return 'Schaffhausen';
            case 'SO':
                return 'Solothurn';
            case 'SZ':
                return 'Schwyz';
            case 'TG':
                return 'Thurgau';
            case 'TI':
                return 'Tessin';
            case 'UR':
                return 'Uri';
            case 'VD':
                return 'Waadt';
            case 'VS':
                return 'Wallis';
            case 'ZG':
                return 'Zug';
            case 'ZH':
                return 'Zürich';
        }
    }
}

function nextStage() {
    setStage(stage, ++stage);
}

function previousStage() {
    setStage(stage, --stage);
}

function setStage(oldStage, newStage) {

    if (newStage > totalStages) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    //Cookies.set('session', xhr.responseText, {expires: 1});
                    console.log('Cookies set');
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
            location: {
                type: 'Point',
                coordinates: [parseFloat(document.querySelector('#city').getAttribute('lon')), parseFloat(document.querySelector('#city').getAttribute('lat'))]
            },
            job: document.querySelector('#job').value,
            sex: document.querySelector('#sex').value,
            pronouns: document.querySelector('#pronouns').value,
            sexuality: document.querySelector('#sexuality').value,
            description: '',
            preferences: [],
            socials: [],
            images: []
        }));


        return;
    }

    document.querySelectorAll('.stage-' + oldStage).forEach((el) => {
        el.classList.add('is-hidden');
    });

    document.querySelectorAll('.stage-' + newStage).forEach((el) => {
        el.classList.remove('is-hidden');
    });

    if (stage > 1) {
        document.querySelector('.previous-stage').classList.remove('is-hidden');
    } else {
        document.querySelector('.previous-stage').classList.add('is-hidden');
    }
}