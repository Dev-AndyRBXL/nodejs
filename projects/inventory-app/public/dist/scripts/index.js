'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('.user-itms-list');
  items.forEach(function (itm) {
    var displayImg = itm.querySelector('.display-img');
    var prevImgsContainer = itm.querySelector('.prev-imgs-container');
    var prevImgs = prevImgsContainer.querySelectorAll('.prev-img');
    prevImgs.forEach(function (img) {
      img.addEventListener('mouseover', function (ev) {
        if (displayImg.src !== ev.target.src) {
          displayImg.src = ev.target.src;
        }
      });
    });
  });
});