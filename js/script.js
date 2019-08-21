// store api url and query parameters
const apiBase = 'https://randomuser.me/api',
      nat = 'us',
      results = '12';

/** 
 * Wrap any async function in try-catch block.
 * @param {function} cb - async function
 * @return {function} 
*/
async function asyncWrapper(cb) {
  return async _ => {
    try {
      await cb();
    } catch(err) {
      console.log(err)
    }
  }
}

/** 
 * Fetch random user data from api
 * @return {object}
*/
async function getEmployeeData() {
  const res = await fetch(`${apiBase}/?nat=${nat}&results=${results}`);
  const json = await res.json();
  return json.results;
}

/**
 * Create div-string with employee-data
 * @param {object} employee - The employee to be displayed
 * @param {string} employee.name - The name of the employee
 * @param {object} employee.location - The location of the employee
 * @param {string} employee.email - The name of the employee
 * @param {string} employee.picture - An array of pictures of the employee
 * @return {string} 
*/
function createDivCard({name, location, email, picture}) {
  const {first, last} = name,
        {city, state, postcode} = location,
        {medium} = picture;
  return `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${first} ${last}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${city}, ${state}</p>
        </div>
    </div>
  `;
}

/** 
 * Create a search form for finding employees
 * @return {string}
*/
function createSearchForm() {
  return `
  <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
  </form>
  `
}

/**
 * Hide all employee cards
*/
function hideAllEmployees() {
  document.querySelectorAll('.card').forEach(i => i.style.display = 'none');
}

/**
 * Search employees by text content of cards
*/
function searchEmployees(e) {
  hideAllEmployees();
  document.querySelectorAll('.card').forEach(i => {
    if (i.textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
      i.style.display = '';
    }
  })
}

/** Create employee directory*/
function main() {
  const divCardContainer = document.querySelector('#gallery');
  const searchContainer = document.querySelector('.search-container');

  asyncWrapper(
    (async () => {
      const data = await getEmployeeData();
      // concat new employee div-card to container
      data.forEach(i => {
        divCardContainer.innerHTML += createDivCard(i);
      })
    })()
  );

  // add search form
  searchContainer.innerHTML += createSearchForm();
  const searchForm = searchContainer.firstElementChild;
  searchForm.addEventListener('keyup', searchEmployees);
  searchForm.addEventListener('submit', searchEmployees);
}

main();
