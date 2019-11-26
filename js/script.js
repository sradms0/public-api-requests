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
 * Create  modal windo to display detailed employee-data
 * @param {object} employee - The employee to be displayed
 * @param {string} employee.name - The name of the employee
 * @param {object} employee.location - The location of the employee
 * @param {string} employee.email - The name of the employee
 * @param {object} employee.picture - An array of pictures of the employee
 * @param {string} employee.phone - The phone number of the employee
 * @param {object} employee.dob - The employee's date of birth
 * @param {int} id - An id for the id attribute of the div card
 * @return {string}
*/
function createModalDiv({name, location, email, picture, phone, dob}, id) {
  // use medium img to avoid high-quality img lagging during fetch time
  const {first, last} = name,
        {city, state, street, postcode} = location,
        {medium} = picture,
        {date} = dob;

  return `
    <div class="modal" id=${id}>
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${medium}" alt="profile picture">
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
  let input = e.target;

  if (e.target.tagName === 'FORM') input = e.target.firstElementChild;

  hideAllEmployees();
  document.querySelectorAll('.card').forEach(i => {
    if (i.textContent.toLowerCase().includes(input.value.toLowerCase())) {
      i.style.display = '';
    }
  })
}

/**
 * Activate modal window of selected employee 
 * @param {object} e - The event triggered
*/
function modalizeEmployee(e) {

  const addListeners = modalDivContainer => {
    let id = parseInt(modalDivContainer.firstElementChild.id);

    // replace medium img with large (high-quality) img once loaded
    modalDivContainer.querySelector('.modal-img')
      .addEventListener('load', e => e.target.src = employees[id].picture.large);

    // allow modal to close
    modalDivContainer.querySelector('#modal-close-btn')
      .addEventListener('click', e => document.body.removeChild(modalDivContainer));

    // allow modal to navigate
    modalDivContainer.querySelector('.modal-btn-container')
      .addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
          const {className} = e.target;

          // enable 'circular navigation'
          if (className === 'modal-next btn') {
            if (id === employees.length-1) id = 0;
            else id++;
          } else if(className === 'modal-prev btn') {
            if (id === 0) id = employees.length-1;
            else id--;
          }
            
          // load next employee and add listeners (account for innerHTML side effect)
          modalDivContainer.innerHTML = createModalDiv(employees[id], id);
          return addListeners(modalDivContainer);
        }
      });
  }

  const employeeDivCard = e.target.closest('.card')
  // check if the card or any elements in the card were selected
  if (employeeDivCard) {
    const {id} = employeeDivCard;
    // get employee object from 'employees' array
    const employeeData = employees[id];

    // create modal and pass all data to it

    const modalDivContainer = document.createElement('div');
    modalDivContainer.className = 'modal-container';
    modalDivContainer.innerHTML = createModalDiv(employeeData, id);

    addListeners(modalDivContainer);
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
