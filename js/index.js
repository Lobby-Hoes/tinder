let img;
let swiper;

function init() {
    loadSwiper();

    img = document.getElementById('image');

    if (img.complete) {
        allignElements();
    } else {
        img.addEventListener('load', allignElements);
    }

    window.addEventListener('resize', allignElements);
}

function allignElements() {
    var shadeDiv = document.getElementsByClassName('shade')[0];
    shadeDiv.style.top = document.getElementById('image').clientHeight - shadeDiv.clientHeight + 'px';

    var textDiv = document.getElementsByClassName('text')[0];
    textDiv.style.top = (document.getElementById('image').clientHeight - shadeDiv.clientHeight) + (shadeDiv.clientHeight / 8) + 'px';
}

function loadSwiper() {
    swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        cardsEffect: {
            perSlideOffset: 0
        }
    });

    swiper.slideTo(1, 0, true);

    swiper.on('slideChange', function() {
        onSwipe()
    });
}

function onSwipe() {
    swiper.allowTouchMove = false;

    if (swiper.activeIndex == 2) {
        console.log('left');
    } else if (swiper.activeIndex == 0) {
        console.log('right');
    }
    document.getElementById('slideMiddle').style.opacity = 0;

    //Loading and Reset
    var loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = 'border: 1px solid #f3f3f3;border-top: 1px solid #3498db;border-radius: 50%;width: 60px;height: 60px;margin: auto;animation: spin 2s linear infinite;margin-top: 10%;';
    document.getElementById('slider').insertBefore(loadingDiv, document.getElementById('nodeBefore'));

    window.scrollTo(0, 0);
}