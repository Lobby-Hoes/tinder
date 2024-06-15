class Carousel {
    constructor(element) {
        this.board = element;

        // handle gestures
        this.handle();
    }

    handle() {
        // list all cards
        this.cards = this.board.querySelectorAll('.card');

        // get top card
        this.topCard = this.cards[this.cards.length - 1];
        // get next card
        this.nextCard = this.cards[this.cards.length - 2];

        if (this.cards.length > 0) {
            // set default top card position and scale
            //this.topCard.style.transform =
            //    'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)';

            // destroy previous Hammer instance, if present
            if (this.hammer) this.hammer.destroy();

            // listen for pan gesture on top card
            this.hammer = new Hammer(this.topCard);
            this.hammer.add(
                new Hammer.Pan({
                    position: Hammer.position_ALL,
                    threshold: 0
                })
            );

            // pass event data to custom callbacks
            this.hammer.on('tap', e => this.onTap(e));
            this.hammer.on("pan", e => this.onPan(e));
        }
    }

    onTap() {

        //Check if the user has tapped the card or is holding it
        if (typeof e !== 'undefined') {
            // get finger position on top card
            let propX = (e.center.x - e.target.getBoundingClientRect().left) / e.target.clientWidth;

            // get degree of Y rotation (+/-15 degrees)
            let rotateY = 15 * (propX < 0.05 ? -1 : 1);

            // change the transition property
            this.topCard.style.transition = 'transform 100ms ease-out';

            // rotate
            this.topCard.style.transform =
                `translateX(0%) translateY(0%) rotate(0deg) rotateY(${rotateY}deg) scale(1)`;

            // wait transition end
            setTimeout(() => {
                // reset transform properties
                this.topCard.style.transform =
                    'translateX(0%) translateY(0%) rotate(0deg) rotateY(0deg) scale(1)';
            }, 100);
        }
    }

    onPan(e) {
        if (!this.isPanning) {
            this.isPanning = true;

            // remove transition property
            this.topCard.style.transition = null;

            // get starting coordinates
            let style = window.getComputedStyle(this.topCard);
            let mx = style.transform.match(/^matrix\((.+)\)$/);
            this.startPosX = mx ? parseFloat(mx[1].split(', ')[4]) : 0;
            this.startPosY = mx ? parseFloat(mx[1].split(', ')[5]) : 0;

            // get card bounds
            let bounds = this.topCard.getBoundingClientRect();

            // get finger position, top (1) or bottom (-1) of the card
            this.isDraggingFrom = (e.center.y - bounds.top) > this.topCard.clientHeight / 2 ? -1 : 1;
        }

        // calculate new coordinates
        let posX = e.deltaX + this.startPosX;
        let posY = e.deltaY + this.startPosX;

        // get ratio between swiped pixels and the axes
        let propX = e.deltaX / this.board.clientWidth;
        let propY = e.deltaY / this.board.clientHeight;

        // get swipe direction, left (-1) or right (1)
        let dirX = e.deltaX < 0 ? -1 : 1;

        // get degrees of rotation between 0 and +/- 45
        let deg = this.isDraggingFrom * dirX * Math.abs(propX) * 45;

        // calculate scale ratio, between 95 and 100 %
        let scale = (95 + 5 * Math.abs(propX)) / 100;

        // move top card
        this.topCard.style.transform = `translateX(${posX}px) translateY(0px) rotate(${deg}deg) rotateY(0deg) scale(1)`;

        // scale next card
        if (this.nextCard) {
            this.nextCard.style.transform = `translateX(0%) translateY(0%) rotate(0deg) scale(${scale})`;
        }

        if (e.isFinal) {
            this.isPanning = false;
            let successful = false;

            // set back transition property
            this.topCard.style.transition = 'transform 200ms ease-out';
            if (this.nextCard)
                this.nextCard.style.transition = 'transform 100ms linear';

            // check threshold
            if (propX > 0.25 && e.direction === Hammer.DIRECTION_RIGHT) {
                successful = true;
                // get right border position
                posX = this.board.clientWidth;
            } else if (propX < -0.25 && e.direction === Hammer.DIRECTION_LEFT) {
                successful = true;
                posX = -(this.board.clientWidth + this.topCard.clientWidth);
            }

            if (successful) {
                // throw card in the chosen direction
                this.topCard.style.transform = `translateX(${posX}px) translateY(${posY}px) rotate(${deg}deg)`;

                // wait transition end
                setTimeout(() => {
                    this.board.removeChild(this.topCard);
                    this.push(e.direction);
                    this.handle();
                }, 200);
            } else {
                // reset card position
                this.topCard.style.transform = 'translateX(0%) translateY(0%)';
                if (this.nextCard)
                    this.nextCard.style.transform =
                        'translateX(0%) translateY(0%) rotate(0deg) rotateY(0deg) scale(0.95)';
            }
        }
    }

    push(direction) {
        console.log("Moved to " + direction);

        var xhr = new XMLHttpRequest();

        if (direction === Hammer.DIRECTION_LEFT) {
            xhr.open('POST', '/api/dislike?user=' + this.topCard.querySelector('#username').innerText.replace('@', ''), true);
            console.log("Disliked " + this.topCard.querySelector('#username').innerText.replace('@', ''));
        } else if (direction === Hammer.DIRECTION_RIGHT) {
            xhr.open('POST', '/api/like?user=' + this.topCard.querySelector('#username').innerText.replace('@', ''), true);
            console.log("Liked " + this.topCard.querySelector('#username').innerText.replace('@', ''));
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var match = JSON.parse(xhr.responseText.toLowerCase());
                if(match) {
                    Swal.fire({
                        title: "It's a match!",
                        imageUrl: "https://i.pinimg.com/originals/3f/c3/e0/3fc3e09dafd7ae54c542f6696f157d22.gif",
                        imageAlt: "Julien Bam mit einer Rose im Mund, dreht sich zu einem hin",
                        imageHeight: 400,
                        confirmButtonText: 'Zu deinen Matches!'
                    });

                    const confetti = window.confetti;

                    var count = 300;
                    var defaults = {
                        origin: { y: 0.5 }
                    };

                    function fire(particleRatio, opts) {
                        confetti({
                            ...defaults,
                            ...opts,
                            particleCount: Math.floor(count * particleRatio)
                        });
                    }

                    fire(0.25, {
                        spread: 60,
                        startVelocity: 55,
                    });
                    fire(0.2, {
                        spread: 60,
                    });
                    fire(0.35, {
                        spread: 100,
                        decay: 0.91,
                        scalar: 0.8
                    });
                    fire(0.1, {
                        spread: 120,
                        startVelocity: 25,
                        decay: 0.92,
                        scalar: 1.2
                    });
                    fire(0.1, {
                        spread: 120,
                        startVelocity: 45,
                    });
                }
                nextCard();
            }
        }

        xhr.send();
    }
}

var board = document.querySelector('#board');
var carousel = new Carousel(board);

window.onload = function () {
    //Initial load
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/new-profile?size=5', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var profiles = JSON.parse(xhr.responseText);
            if(profiles.length === 0) {
                document.querySelector('#board').innerHTML += getNoMoreProfilesCardHTML();
                return;
            }
            profiles.forEach(profile => {
                document.querySelector('#board').innerHTML += getCardHTML(profile);
            });
            console.log("Loaded 5 profiles");
            console.log(board);

            carousel = new Carousel(board);
        }
    }

    xhr.send();
}

function nextCard() {

    const cards = document.querySelectorAll('.card');

    console.log(cards.length);

    if (cards.length === 0) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/new-profile?size=5', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var profiles = JSON.parse(xhr.responseText);
                if(profiles.length === 0) {
                    document.querySelector('#board').innerHTML += getNoMoreProfilesCardHTML();
                    return;
                }
                profiles.forEach(profile => {
                    document.querySelector('#board').innerHTML += getCardHTML(profile);
                });
                console.log("Loaded 5 profiles");
                console.log(board);

                carousel = new Carousel(board);
            }
        }

        xhr.send();
    }

}


function getNoMoreProfilesCardHTML() {
    return `
    <div class="card">
        <div class="card-image">
            <figure class="image is-4by3">
                <img
                        src="https://64.media.tumblr.com/ee071d98db96475427f316823711b9df/2f0d027b23ed83b7-41/s1280x1920/dc962718392bfc3c1416b03bb7333efe298e1d3a.gifv"
                        alt="Julien Bam im Raumschiffanzug mit fragendem Gesichtsausdruck"
                        draggable="false"
                        class="no-scale"
                />
            </figure>
        </div>
        <div class="card-content pb-0">
            <div class="media">
                <div class="media-content">
                    <h1 class="title is-4 has-text-centered is-family-hobbylos is-uppercase">Herzlichen Glückwunsch</h1>
                    <p class="subtitle is-6 has-text-centered is-family-hobbylos">Du bist alle Profile durchgegangen</p>
                    <p class="is-size-6 has-text-weight-medium has-text-centered mt-3 mb-4">Erhöhe deinen Suchradius oder schaue später nochmal vorbei!</p>
                </div>
            </div>
        </div>
    </div>
    `;
}