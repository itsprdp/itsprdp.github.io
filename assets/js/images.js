document.querySelectorAll('article img').forEach(function(img) {
  img.classList.add('rounded', 'border', 'shadow-sm');

  var figure = document.createElement('figure');
  img.parentNode.insertBefore(figure, img);
  figure.appendChild(img);

  if (img.alt) {
    var caption = document.createElement('figcaption');
    caption.textContent = img.alt;
    figure.appendChild(caption);
  }
});
