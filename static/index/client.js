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
        if(typeof e !== 'undefined') {
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
        this.topCard.style.transform = `translateX(${posX}px) translateY(${posY}px) rotate(${deg}deg) rotateY(0deg) scale(1)`;

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
                posX = - (this.board.clientWidth + this.topCard.clientWidth);
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

        if(direction === Hammer.DIRECTION_LEFT) {
            console.log("Dislike");
        } else if(direction === Hammer.DIRECTION_RIGHT) {
            console.log("Like");
        }
    }
}

var board = document.querySelector('#board');

var carousel = new Carousel(board);