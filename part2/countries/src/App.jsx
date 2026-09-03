import { useEffect, useState } from "react";
import countryService from "./services/countries";
import weatherService from "./services/weather";

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService.getWeather(country.capital[0]).then((response) => {
      setWeather(response.data);
    });
  }, [country]);

  const languages = Object.values(country.languages);

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>capital {country.capital[0]}</p>

      <p>area {country.area}</p>

      <h3>languages:</h3>

      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />

      <h3>Weather in {country.capital[0]}</h3>

      {weather ? (
        <div>
          <p>temperature {weather.main.temp} Celsius</p>

          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />

          <p>{weather.weather[0].description}</p>

          <p>wind {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

const CountryList = ({ countries, showCountry }) => {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.cca3}>
          {country.name.common} <button onClick={() => showCountry(country)}>show</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countryService.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedCountry(null);
  };

  const showCountry = (country) => {
    setSelectedCountry(country);
  };

  const countriesToShow = countries.filter((country) => country.name.common.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div>
        find countries: <input value={searchTerm} onChange={handleSearchChange} />
      </div>

      {selectedCountry && <Country country={selectedCountry} />}

      {!selectedCountry && countriesToShow.length > 10 && <p>Too many matches, specify another filter</p>}

      {!selectedCountry && countriesToShow.length > 1 && countriesToShow.length <= 10 && <CountryList countries={countriesToShow} showCountry={showCountry} />}

      {!selectedCountry && countriesToShow.length === 1 && <Country country={countriesToShow[0]} />}
    </div>
  );
};

export default App;
