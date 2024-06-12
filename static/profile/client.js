var map;
var circle;

window.onload = function () {

    //Set tab according to url
    var hash = window.location.hash;
    if (hash) {
        switchTab(hash.substring(1));
    }

    //Load data on load
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/user', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                document.querySelector('#username').value = data.username;
                document.querySelector('#creation-date').innerText = new Date(data.creationDate).toLocaleDateString();
                document.querySelector('#name').value = data.name;
                document.querySelector('#birthday').value = new Date(data.birthday).toISOString().split('T')[0];
                document.querySelector('#city').value = data.city;
                document.querySelector('#city').setAttribute('lon', data.location.coordinates[0]);
                document.querySelector('#city').setAttribute('lat', data.location.coordinates[1]);
                document.querySelector('#job').value = data.job;
                document.querySelector('#sex').value = data.sex;
                document.querySelector('#pronouns').value = data.pronouns;
                document.querySelector('#sexuality').value = data.sexuality;
                document.querySelector('#distance').setAttribute('distance', data.distance);
                document.querySelector('#id').innerHTML = data._id;

                document.querySelectorAll('.is-skeleton').forEach(element => {
                    element.classList.remove('is-skeleton');
                });
            }
        }
    }
    xhr.send();


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
            xhr.open('GET', 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=name%2C%20coordinates%2C%20country_code%2C%20admin3_code%2C%20admin1_code&where=search(name%2C%20%22' + document.querySelector('#city').value + '%22)&limit=5&refine=cou_name_en%3A%22Germany%22&refine=cou_name_en%3A%22Austria%22&refine=cou_name_en%3A%22Switzerland%22&refine=cou_name_en%3A%22Liechtenstein%22', true);
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
    } else if (country === 'LI') {
        return 'Liechtenstein';
    }
}

function showMap() {
    var distance = document.querySelector('#distance').getAttribute('distance');
    Swal.fire({
        title: 'Suchradius auswählen',
        html: `
        <div id="map"></div>
        <p class="is-size-5 mt-2 has-text-centered">Suchradius</p>
        <div class="field is-grouped">
            <div class="control is-expanded">
                <input class="slider has-output" step="5" min="10" max="250" value="${distance / 1000}" type="range" oninput="setRadius(this.value)">
            </div>
            <div class="control">
                <input class="input mt-3 is-small" id="radius" value="${distance / 1000}" type="number" min="1" max="250" oninput="setRadius(this.value)">km
            </div>
        </div>
       `,
        showCancelButton: false,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonColor: 'rgb(76, 201, 255)',
        confirmButtonText: 'Speichern',
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('#distance').setAttribute('distance', document.querySelector('#radius').value * 1000);
        }
    });

    var lon = document.querySelector('#city').getAttribute('lon');
    var lat = document.querySelector('#city').getAttribute('lat');

    map = L.map('map').setView([lat, lon], 12);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    //Get Countriy Geometry
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/resources/countries.geojson`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                for (country of data.features) {
                    console.log(country);
                    if (country.properties.ISO_A2 === 'DE' || country.properties.ISO_A2 === 'AT' || country.properties.ISO_A2 === 'CH' || country.properties.ISO_A2 === 'LI') {
                        console.log("Added");
                        L.geoJSON(country, {
                            style: {
                                fillColor: 'rgb(76, 201, 255)',
                                weight: 2,
                                opacity: 1,
                                color: 'black',
                                fillOpacity: 0.1
                            }
                        }).addTo(map);
                    }
                }
            }
        }
    }
    xhr.send();

    circle = L.circle([lat, lon], {
        color: 'rgb(76, 201, 255)',
        fillColor: 'rgb(76, 201, 255)',
        fillOpacity: 0.5,
        radius: distance
    }).addTo(map);
    map.fitBounds(circle.getBounds());
}

function setRadius(radius) {
    if (radius < 1) radius = 1;
    if (radius > 250) radius = 250;
    document.querySelector('#radius').value = radius;
    document.querySelector('.slider').value = radius;
    circle.setRadius(radius * 1000);
    map.fitBounds(circle.getBounds());
}

function switchTab(tab) {
    var oldTab = document.querySelector('.tab:not(.is-hidden)');
    oldTab.classList.add('is-hidden');
    document.querySelector(`.${tab}`).classList.remove('is-hidden');

    var oldButton = document.querySelector('.is-active');
    oldButton.classList.remove('is-active');
    document.querySelector(`.tab-${tab}`).classList.add('is-active');
}

function save(button, tab) {

    button.classList.add('is-loading');
    button.classList.add('is-warning');

    let updateJson = {};
    switch (tab) {
        case 'profile':
            var name = document.querySelector('#name');
            var birthday = document.querySelector('#birthday');
            var city = document.querySelector('#city');
            var job = document.querySelector('#job');
            var distance = document.querySelector('#distance');

            name.value !== '' ? name.classList.remove('is-danger') : name.classList.add('is-danger');
            birthday.value !== '' ? birthday.classList.remove('is-danger') : birthday.classList.add('is-danger');
            city.value !== '' ? city.classList.remove('is-danger') : city.classList.add('is-danger');
            job.value !== '' ? job.classList.remove('is-danger') : job.classList.add('is-danger');

            if (name.value === '' || birthday.value === '' || city.value === '' || job.value === '') {
                button.classList.remove('is-loading');
                button.classList.remove('is-warning');
                return;
            }

            updateJson = {
                name: name.value,
                birthday: birthday.value,
                city: city.value,
                job: job.value,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(city.getAttribute('lon')), parseFloat(city.getAttribute('lat'))]
                },
                distance: parseInt(distance.getAttribute('distance'))
            }

            break;

        case 'account':
            var username = document.querySelector('#username');

            if (username.value === '') {
                username.classList.add('is-danger');
                button.classList.remove('is-loading');
                button.classList.remove('is-warning');
                return;
            }

            updateJson = {
                username: username.value
            }
            break;

        case "preference":
            var pronouns = document.querySelector('#pronouns');

            if (pronouns.value === '') {
                pronouns.classList.add('is-danger');
                button.classList.remove('is-loading');
                button.classList.remove('is-warning');
                return;
            }

            var gender = document.querySelector('#sex').value;
            var sexuality = document.querySelector('#sexuality').value;

            const preferences = getPossibleMatches(gender, sexuality);

            updateJson = {
                pronouns: pronouns.value,
                preferences: preferences
            }
            break;

    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/user/update', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                Swal.fire({
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 1500,
                    icon: 'success',
                    title: 'Erfolgreich gespeichert',
                });
                button.classList.remove('is-loading');
                button.classList.remove('is-warning');
            } else {
                Swal.fire({
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 1500,
                    icon: 'error',
                    title: 'Fehler beim speichern'
                });
                button.classList.remove('is-loading');
                button.classList.remove('is-warning');

            }
        }
    }
    xhr.send(JSON.stringify(updateJson));
}