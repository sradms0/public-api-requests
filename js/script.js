// store api url and query parameters
const apiBase = 'https://randomuser.me/api',
      nat = 'us',
      results = '12';

const employees = [];

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
 * @param {object} employee.picture - An array of pictures of the employee
 * @param {int} id - An id for the id attribute of the div card
 * @return {string} 
*/
function createDivCard({name, location, email, picture}, id) {
  const {first, last} = name,
        {city, state, postcode} = location,
        {medium} = picture;
  return `
    <div class="card" id="${id}">
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
 * Create  modal container to display detailed employee-data
 * @param {object} employee - The employee to be displayed
 * @param {string} employee.name - The name of the employee
 * @param {object} employee.location - The location of the employee
 * @param {string} employee.email - The name of the employee
 * @param {object} employee.picture - An array of pictures of the employee
 * @param {string} employee.phone - The phone number of the employee
 * @param {object} employee.dob - The employee's date of birth
 * @return {string}
*/
function createModalDivContainer({name, location, email, picture, phone, dob}) {
  const {first, last} = name,
        {city, state, street, postcode} = location,
        {large} = picture,
        {date} = dob;


  return `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${first} ${last}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${street}, ${city}, ${state} ${postcode}</p>
                <p class="modal-text">Birthday: ${new Date(date).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
  `;
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

/**
 * Activate modal window of selected employee 
 * @param {object} e - The event triggered
*/
function modalizeEmployee(e) {
    const employeeDivCard = e.target.closest('.card')
    // check if the card or any elements in the card were selected
    if (employeeDivCard) {
      // get employee object from 'employees' array
      const employeeData = employees[employeeDivCard.id]

      // create modal and pass all data to it
      const modalDivContainer = document.createElement('div');
      modalDivContainer.innerHTML = createModalDivContainer(employeeData);

      // allow modal to close
      modalDivContainer.querySelector('#modal-close-btn')
        .addEventListener('click', e => document.body.removeChild(modalDivContainer));

      // add modal to display
      document.body.append(modalDivContainer);
    }
}

/** Create employee directory*/
function main() {
  const divCardContainer = document.querySelector('#gallery');
  const searchContainer = document.querySelector('.search-container');

  asyncWrapper(
    (async () => {
      const data = await getEmployeeData();
      // concat new employee div-card to container
      data.forEach((dat, i) => {
        employees.push(dat);
        divCardContainer.innerHTML += createDivCard(dat, i);
      })
    })()
  );

  // add search form
  searchContainer.innerHTML += createSearchForm();
  const searchForm = searchContainer.firstElementChild;
  searchForm.addEventListener('keyup', searchEmployees);
  searchForm.addEventListener('submit', searchEmployees);

  // add modal div
  document.body.addEventListener('click', modalizeEmployee);
}

main();
