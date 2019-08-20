// store api url and query parameters
const apiBase = 'https://randomuser.me/api',
      nat = 'us',
      results = '12';

/** 
 * Wrap any async function in try-catch block.
 * @param {function} cb - async function
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

/** Create employee directory*/
function main() {
  asyncWrapper(
    (async () => {
      const data = await getEmployeeData();
      data.forEach(i => {
        document.body.append(JSON.stringify(i));

      });
    })()
  );
}

main();
