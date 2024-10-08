import api from "../../utils/api";
import { useState, useEffect } from "react";
import React from "react";
import Style from "./Tempo.module.css"; // Verifique se o caminho está correto

function Tempo() {
    const [days, setDays] = useState([]);
    const [city, setCity] = useState([]);
    const [daysName, setDaysName] = useState([]);
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get();
                const { data } = response.data;
                const { city } = response.data;
                setCity(city);
                setDays(data);
                const names = data.map(day => {
                    const d = new Date(day.date);
                    return weekDay[d.getDay()];
                });
                setDaysName(names); 
            } catch (err) {
                // console.log("Erro: " + err)
            }
        };
        fetchData();
    }, []);
    
    if (days.length === 0 || daysName.length === 0) {
        return <div>Carregando</div>;
    }

    return (
      <div className={Style.container}>
          <span className={Style.city}><h1>{city}</h1></span>
          <div className={Style.current_day}>
              <h2>{daysName[0]}</h2>
              <img src={days[0].day.condition.icon} alt="Weather icon" />
              <h3>{days[0].day.avgtemp_c} ºC</h3>
          </div>

          <div>
              {days.length > 0 && days.slice(1).map((day, index) => (
                  <div className={Style.forecast_day} key={index}>
                      <h4>{daysName[index + 1]}</h4>
                      <p>{day.day.avgtemp_c}ºC</p>
                      <img src={day.day.condition.icon} alt="Weather icon" />
                  </div>
              ))}
          </div>
      </div>
  );
}

export default Tempo;
