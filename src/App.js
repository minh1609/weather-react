import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { InputGroup, Form, Button } from "react-bootstrap";

const api = {
  key: "38474f1345724bdebdc194137241402",
  base: "https://api.weatherapi.com/v1/",
};

const themes = [
  ["cold", "info"], //weather, bs color name
  ["nice", "success"],
  ["hot", "warning"],
];

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    //Runs only on the first render
    let cityName = localStorage.getItem("cityName");
    setSearch(cityName);
    fetchWeatherByCity(cityName);
  }, []);

  const fetchWeatherByCity = async (city) => {
    setErrMsg("");
    try {
      let response = await axios.get(
        `${api.base}forecast.json?q=${city}&days=4&key=${api.key}`
      );
      setWeather(response.data);
      localStorage.setItem("cityName", city);
      setTheme(getThemeByTemp(response.data.current.temp_c));
    } catch (e) {
      setErrMsg(e.response.data.error.message);
    }
  };

  const onThemeBtnClick = (theme) => {
    setTheme(theme);
  };

  const getThemeByTemp = (temp) => {
    if (temp < 10) return "info";
    else if (10 <= temp && temp <= 20) return "success";
    else return "warning";
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchWeatherByCity(search);
  };

  return (
    <div className={"container text-" + theme}>
      <h1 className={"my-2"}>Weather</h1>

      {/* Search Box */}
      <form onSubmit={handleFormSubmit}>
        <InputGroup className="mb-3">
          <Form.Control
            value={search}
            type="text"
            placeholder="Enter city, town"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant={"outline-" + theme} id="button-addon2" type="submit">
            Search
          </Button>
        </InputGroup>
      </form>
      {/* Error box */}
      {errMsg.length > 0 && (
        <div className="alert alert-danger my-2" role="alert">
          {errMsg}
        </div>
      )}

      {weather.location ? (
        <div>
          <div className="my-4 ">
            <h3>{weather.location.name}</h3>
            <p>
              Current temprature: {weather.current.temp_c}°C,{" "}
              {weather.current.condition.text}
            </p>
            <img src={weather.current.condition.icon} alt="icon"></img>
          </div>

          <table className={"table table-hover table-" + theme}>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Avg Temp</th>
                <th scope="col">Humidity</th>
                <th scope="col">UV</th>
              </tr>
            </thead>
            <tbody>
              {weather.forecast.forecastday.map((d, i) => {
                if (i >= 1) {
                  return (
                    <tr key={d.date}>
                      <td>{d.date}</td>
                      <td>{d.day.avgtemp_c}</td>
                      <td>{d.day.avghumidity}</td>
                      <td>{d.day.uv}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}

      <h4>Select theme</h4>
      <p>
        The theme is always defined by the current weather temperature and can
        be overwritten temporarily
      </p>

      {/* Theme select */}
      {themes.map((th) => {
        return (
          <button
            key={th[0]}
            className={"me-2 btn btn-" + th[1]}
            onClick={() => onThemeBtnClick(th[1])}
          >
            {th[0]}
          </button>
        );
      })}
    </div>
  );
}

export default App;
