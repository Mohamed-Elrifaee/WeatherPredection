import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const weatherAppKey = ""; // write your Key here you can get it from the openweathermap by signing up and they will email you the key to be used 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/", (req,res)=>{
    res.render("index.ejs");
})

app.post("/save-location", async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log(latitude + " , " + longitude);
    const weatherResult = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAppKey}`);
    const weather = weatherResult.data.weather[0].description;
    const weathericon = weatherResult.data.weather[0].icon;
    console.log(weather, weathericon);
  
    res.json({ weather, weathericon }); // Send the weather data as JSON response
  });
app.listen(3000,()=>{
    console.log("server is on");
})

