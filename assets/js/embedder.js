function embed () {
  let iframe = `<iframe src="${window.location.href}"
  width="100%" height="500" 
  frameborder="0" allowfullscreen sandbox="allow-scripts">
  <p> <a href="${window.location.href}">
  Your browser does not support iframe. Follow link to see the page
  </a> </p>
  </iframe>`;

  let emb = document.getElementById('embed');
  emb.innerHTML = iframe;
  emb.style.display = 'block';
}