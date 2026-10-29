// https://www.omdbapi.com/?i=tt3896198&apikey=e8b230c6

//http://www.omdbapi.com/?apikey=[yourkey]&

//http://img.omdbapi.com/?apikey=[yourkey]&
const API_KEY ='e8b230c6';
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const moviesGrid = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultsInfo');
const filterSelect = document.querySelector('#filterSelect');

let currentMovies = [];



searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

// Show skeleton loading cards 
function showSkeletons() {
const skeletons = Array(10).fill(0).map(() =>`
  <div class="movie__card-img movie__card--skeleton">
    <div class="movie__card-img movie__card-img--skeleton></div>
    <div class="movie__card-title movie__card-title--skeleton></div>
    <div class="movie__card-year movie__card-year--skeleton></div>
  </div>
  `).join('');

  moviesGrid.innerHTML = skeletons;
}

// Fetch movies from API
async function fetchMovies(searchTerm) {
  showSkeletons();

  const response = await fetch(`https://www.omdbapi.com//?apikey=${API_KEY}&s=${searchTerm}`);
  const data = await response.json();

  if (data.Response === 'True') {
    currentMovies =data.Search;
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    filterSelect.value = 'default';
    displayMovies(currentMovies);
  }
  else {
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    moviesGrid.innerHTML = '<p>No Movies found.</p>';
    currentMovies =[];
  }
}

//Display Movies

function displayMovies(movies) {
  const movieResults = movies.map((movie) => {
    const poster = movie.Poster !== 'N/A' ? movie.Poster : '';

    return `
    <div class="movie__card">
      ${poster ? `<img class="movie__card-img" src="${poster}" alt="${movie.Title}">` : `<div class="movie__card-poster--placeholder">Movie Poster <br>Not Available</div>`}
      <h2 class="movie__card-title">${movie.Title}</h2>
      <p class="movie__card-year">${movie.Year}</p>
    </div>
  `;
  }).join('');

  moviesGrid.innerHTML = movieResults;

  moviesGrid.querySelectorAll('movie__card-img').forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'movie__card-poster--placeholder';
      placeholder.innerHTML = 'Movie Poster<br>Not Available';
      img.replaceWith(placeholder);
    });
  });
}

//Sort Movies

filterSelect.addEventListener('change', (event) => {
  sortMovies(event.target.value);
});

function sortMovies (sortType) {
  let sortedMovies = [...currentMovies];
  
  if (sortType === 'a-z') {
    sortedMovies.sort((a, b) => a.Title.localCompare(b.Title));
  } 
  else if (sortType === 'z-a') {
    sortedMovies.sort((a, b) => b.Title.localCompare(a.Title));
  }
  else if (sortType === 'newest') {
    sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year)); 
  }
  else if (sortType === 'oldest') {
    sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
  }

  displayMovies(sortedMovies);
}