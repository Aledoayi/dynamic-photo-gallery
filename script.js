/*
 * Script principal pour la galerie photo dynamique.
 * Ce fichier charge les images définies dans un tableau, offre la
 * possibilité d’appliquer un filtre CSS aléatoire à l’ensemble des
 * images et de mélanger leur ordre d’affichage. Les fonctions sont
 * attachées à des boutons présents dans le fichier HTML.
 */

// Liste des chemins des images disponibles dans le dossier `images/`.
// Chemins d'images distants depuis Lorem Picsum. L'utilisation de liens
// distants permet de ne pas inclure les images dans le dépôt GitHub tout en
// conservant un rendu visuel riche. Chaque URL pointe vers une photo
// aléatoire mais stable basée sur un identifiant.
const imagePaths = [
  'https://picsum.photos/id/10/1200/800.jpg',
  'https://picsum.photos/id/20/1200/800.jpg',
  'https://picsum.photos/id/21/1200/800.jpg',
  'https://picsum.photos/id/24/1200/800.jpg',
  'https://picsum.photos/id/25/1200/800.jpg',
  'https://picsum.photos/id/29/1200/800.jpg'
];

// Tableau des filtres CSS possibles. Chaque filtre donne un rendu
// différent : certains modifient les couleurs, d'autres la luminosité,
// la saturation ou ajoutent un flou. Vous pouvez en ajouter ou en
// retirer librement.
const filters = [
  'none',
  'grayscale(100%)',
  'sepia(80%)',
  'invert(100%)',
  'brightness(1.2)',
  'contrast(1.5)',
  'hue-rotate(90deg)',
  'saturate(2)',
  'blur(2px)'
];

// Récupération des éléments du DOM.
const gallery = document.getElementById('gallery');
const filterBtn = document.getElementById('filterBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const scrollBtn = document.getElementById('scrollBtn');

// Indicateur et intervalle pour le défilement automatique
let autoScroll = false;
let scrollInterval = null;

/**
 * Fonction de création de la galerie. Elle parcourt le tableau
 * `imagePaths` et ajoute chaque image dans le conteneur.
 */
function renderGallery() {
  // Nettoie le conteneur actuel pour éviter de dupliquer les images
  gallery.innerHTML = '';
  imagePaths.forEach((src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Photo';
    gallery.appendChild(img);
  });
}

/**
 * Applique un filtre aléatoire à toutes les images visibles.
 */
function applyRandomFilter() {
  const randomFilter = filters[Math.floor(Math.random() * filters.length)];
  const imgs = gallery.querySelectorAll('img');
  imgs.forEach((img) => {
    img.style.filter = randomFilter;
  });
}

/**
 * Mélange le tableau `imagePaths` en place à l'aide de l'algorithme de
 * Fisher-Yates. Après le mélange, la galerie est rechargée pour
 * refléter le nouvel ordre.
 */
function shuffleImages() {
  for (let i = imagePaths.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imagePaths[i], imagePaths[j]] = [imagePaths[j], imagePaths[i]];
  }
  renderGallery();
}

/**
 * Démarre le défilement automatique du conteneur de la galerie.
 * Le conteneur est scrollé vers le bas par petits incréments à intervalles
 * réguliers. Lorsque le bas est atteint, le scroll repart du haut.
 */
function startAutoScroll() {
  if (scrollInterval) return;
  autoScroll = true;
  scrollBtn.textContent = 'Désactiver défilement';
  scrollInterval = setInterval(() => {
    // Avance progressivement le scroll
    gallery.scrollTop += 1;
    // Si on atteint le bas du contenu, on repart du haut
    if (gallery.scrollTop + gallery.clientHeight >= gallery.scrollHeight) {
      gallery.scrollTop = 0;
    }
  }, 20); // ajustez la vitesse de défilement en modifiant cette valeur (millisecondes)
}

/**
 * Stoppe le défilement automatique.
 */
function stopAutoScroll() {
  if (!scrollInterval) return;
  clearInterval(scrollInterval);
  scrollInterval = null;
  autoScroll = false;
  scrollBtn.textContent = 'Activer défilement';
}

/**
 * Bascule l'état du défilement automatique.
 */
function toggleAutoScroll() {
  if (autoScroll) {
    stopAutoScroll();
  } else {
    startAutoScroll();
  }
}

// Événements attachés aux boutons
filterBtn.addEventListener('click', applyRandomFilter);
shuffleBtn.addEventListener('click', shuffleImages);

// Événement pour activer/désactiver le défilement automatique
scrollBtn.addEventListener('click', toggleAutoScroll);

// Charge les images au chargement initial de la page
window.addEventListener('DOMContentLoaded', renderGallery);
