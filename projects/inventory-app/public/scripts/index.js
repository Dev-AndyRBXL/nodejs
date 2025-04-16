'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.user-itms-list');
  items.forEach(function (itm) {
    const displayImg = itm.querySelector('.display-img');
    const prevImgsContainer = itm.querySelector('.prev-imgs-container');
    const prevImgs = prevImgsContainer.querySelectorAll('.prev-img');

    prevImgs.forEach(function (img) {
      img.addEventListener('mouseover', function (ev) {
        if (displayImg.src !== ev.target.src) {
          displayImg.src = ev.target.src;
        }
      });
    });
  });
});
