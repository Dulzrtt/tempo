import express from "express";
import expressIp from "express-ip";
import cors from "cors";
import requestIp from "request-ip"
import geoip from "geoip-lite";
import axios from "axios";

const app = express();
//app.use(expressIp().getIpInfoMiddleware);
app.use(cors());
app.use(requestIp.mw())

//API
const API_KEY = '1bf7cf085e0b47d9bcd210414243009';
const BASE_URL = 'https://api.weatherapi.com/v1';
//get weather
async function getWeather(location){
    try{
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: API_KEY,
                q: location,
                days: 5
            }
        });
        
        const weatherData = response.data.forecast.forecastday;
        const filteredForecast = weatherData.map(day => ({
            date: day.date,
            day: {
                maxtemp_c: day.day.maxtemp_c,
                mintemp_c: day.day.mintemp_c,
                avgtemp_c: day.day.avgtemp_c,
                maxwind_kph: day.day.maxwind_kph,
                totalprecip_mm: day.day.totalprecip_mm,
                condition: day.day.condition
            }
            
        }));
        return filteredForecast;
    
    
    }catch(err){
        console.log(err);
    }
}



app.get('/', async (req, res) =>{
    const ip = req.clientIp
    let city = ""
    if(ip === "::1"){
        city = "Chapecó";
    }else{
        const geo = geoip.lookup(ip);
        city = geo.city;
    }
    const data = await getWeather(city);
    //res.status(200).json(`A temperatura atual em ${data.location.name} é ${data.current.temp_c}°C`);
    //res.status(200).json({"city" : data.location.name,"temp": data.current.temp_c})
    res.status(200).json({city: city ,data,})
    console.log(data[1]);
    

})




app.listen(5000, async () =>{
    console.log("Rodando na porta 5000");
    
})
