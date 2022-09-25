import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import API from './fetchCountries';
import getRefs from './refs';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;

// Необходимо применить приём Debounce на 
// обработчике события и делать HTTP-запрос спустя 300мс
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {

  // Если пользователь полностью очищает поле поиска, 
  // то HTTP-запрос не выполняется, а разметка списка 
  // стран или информации о стране пропадает.
  refs.countryInfoEl.innerHTML = '';
  refs.countryList.innerHTML = '';

  // Выполни санитизацию введенной строки методом trim()
  const searchQuery = refs.input.value.trim();
  console.log('це onInput', searchQuery);
  if (searchQuery) {
    API.fetchCountries(searchQuery).then(renderCountryCard).catch(onFetchError);
    // .finally(() => form.reset());
  }
}

  function renderCountryCard(data) {
    
    // Если в ответе бэкенд вернул больше чем 10 стран, 
    // в интерфейсе пояляется уведомление о том, 
    // что имя должно быть более специфичным
    if (data.length > 10) {
      return Notiflix.Notify.warning(
        'Too many matches found. Please enter a more specific name.'
      );
    }

    data.forEach(country => {
      const {
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
      } = country;

      // Если результат запроса это массив с одной страной, 
      // в интерфейсе отображается разметка карточки с данными 
      // о стране: флаг, название, столица, население и языки.
      if (data.length === 1) {
        const markup = `<img src="${svg}" alt="flag"  width="60">
   <h2>${official}</h2>
   <b>Capital:</b>
   <p>${capital}</p>
   <b>Population:</b>
   <p>${population}</p>
   <b>Languages:</b>
   <p>${Object.values(languages).join(', ')}</p>`;
        refs.countryInfoEl.innerHTML = markup;
      }
      // Если бэкенд вернул от 2-х до 10-х стран, 
      // под тестовым полем отображается список найденных стран. 
      // Каждый элемент списка состоит из флага и имени страны.
      else {
        const markup = `<li>
        <img src="${svg}" width='20'></img>
        <b>${official}</b>
      </li>`;
        refs.countryList.insertAdjacentHTML('beforeend', markup);
      }
    });
  }
// сли пользователь ввёл имя страны которой не существует
// Добавь уведомление "Oops, there is no country with that name"
function onFetchError() {
  Notiflix.Notify.failure(`❌ "Oops, there is no country with that name"`);
}
