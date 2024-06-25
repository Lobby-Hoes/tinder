function getCardHTML(profile) {

    //Age
    var ageDifMs = Date.now() - new Date(profile.birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var years = Math.abs(ageDate.getUTCFullYear() - 1970);

    console.log(profile);
    //Distance
    var meterDistance = profile.dist.calculated;
    var kilometerDistance = Math.round(meterDistance / 1000);

    return `
        <div class="card">
            <section class="splide" aria-label="Basic Structure Example">
              <div class="splide__track">
                <ul class="splide__list">
                  <li class="splide__slide">
                    <figure class="image is-4by3">
                        <img class="profile-image"
                                src="/resources/image.jpg"
                                alt="Placeholder image"
                                draggable="false"
                        />
                    </figure>
                  </li>
                  <li class="splide__slide">
                  <figure class="image is-4by3">
                        <img class="profile-image"
                                src="/resources/boyyy.jpg"
                                alt="Placeholder image"
                                draggable="false"
                        />
                    </figure>
                  </li>
                  <li class="splide__slide">
                  <figure class="image is-4by3">
                        <img class="profile-image"
                                src="/resources/ruru.jpg"
                                alt="Placeholder image"
                                draggable="false"
                        />
                    </figure>
                  </li>
                </ul>
              </div>
            </section>
            <div class="card-content pb-0">
                <div class="media">
                    <div class="media-content">
                        <b class="title is-4 mb-1">${profile.name}</b>
                        <b class="ml-1 subtitle">${years}</b>
                        <br>
                        <p id="username" class="is-size-6 is-lowercase has-text-weight-light">@${profile.username}</p>
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fas fa-home"></i>
                          </span>
                          <span>${profile.city} (<i>${kilometerDistance}km entfert</i>)</span>
                        </span>
                        <br>
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fa-solid fa-flag"></i>
                          </span>
                          <span>${profile.sexuality}</span>
                        </span>
                        <br>
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fa-solid fa-briefcase"></i>
                          </span>
                          <span>${profile.job}</span>
                        </span>
                    </div>
                    <div class="media-right">
                        <button class="button is-outlined is-large is-success">
                            <span class="icon is-small">
                                <i class="fa fa-heart"></i>
                            </span>
                        </button>
                        <button class="button is-outlined is-large is-danger">
                            <span class="icon is-small">
                                <i class="fa-solid fa-x"></i>
                            </span>
                        </button>
                    </div>
                </div>
    
                <div class="content">
                    ${profile.description}
                </div>
    
                <h1 class="title is-6 mb-1">Lieblingsfolge</h1>
                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/0TRbgtbwhNlsG6YnWWfxTY?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>`;
}

function getMatchBoxHTML(profile) {

    //Age
    var ageDifMs = Date.now() - new Date(profile.birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var years = Math.abs(ageDate.getUTCFullYear() - 1970);

    const htmlStr = `
    <hr>
    <div class="box">
            <div class="columns">
                <div class="column">
                    <figure class="image is-4by3">
                        <img
                                src="https://bulma.io/assets/images/placeholders/1280x960.png"
                                alt="Placeholder image"
                                draggable="false"
                        />
                    </figure>
                </div>
                <div class="column">
                    <b class="title is-4 mb-1">${profile.name}</b>
                        <b class="ml-1 subtitle">${years}</b>
                        <br>
                        <p id="username" class="is-size-6 is-lowercase has-text-weight-light">@${profile.username}</p>
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fas fa-home"></i>
                          </span>
                          <span>${profile.city}</span>
                        </span>
                        <br>
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fa-solid fa-flag"></i>
                          </span>
                          <span>${profile.sexuality}</span>
                        </span>
                        <br>
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fa-solid fa-briefcase"></i>
                          </span>
                          <span>${profile.job}</span>
                        </span>
                    <button onclick="showProfile('${profile._id}')" class="button is-success is-hobbylos is-uppercase is-family-hobbylos is-fullwidth is-rounded mt-3">
                        Profil ansehen
                    </button>
                </div>

                <div class="column">
                    <div class="buttons is-centered socials">
                    </div>
                </div>
            </div>
        </div>
    `;

    var doc = new DOMParser().parseFromString(htmlStr, 'text/html');

    for(let i in profile.socials) {
        const social = profile.socials[i];
        doc.querySelector('.socials').innerHTML += `
            <button class="p-3 button is-large is-ghost" onclick="window.open('${social.url}', '_blank')">
                <span class="icon is-large">
                    <i class="fa-brands fa-${social.name} fa-lg"></i>
                </span>
            </button>
        `;
    }

    return doc.body.innerHTML;
}

function showProfile(profile) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/profile?id=' + profile + "&relative=true", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            profile = JSON.parse(xhr.responseText);
            Swal.fire({
                html: getCardHTML(profile),
                title: "Profilansicht",
                width: 600
            });
        }
    }

    xhr.send();

}
