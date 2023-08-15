weatherInfo = {"tempF":100, "tempC":35};


// eventListeners
document.getElementById("units").addEventListener("click", toggleTemp);
document.getElementById("zip-input").addEventListener("change", updateLocation);

// call Lambda through API Gateway to get weather information
// input: ZIP code
// output: weather info dictionary with keys: tempF, tempC, city, iconLink, humidity, UV, windSpeed, windDir
function getInfo(zip){

}

// callback function for when the location is changed. Need to call API and update the weather info
function updateLocation(){
    // verify input
    let zip = document.getElementById("zip-input").value;
    if(!verifyZip(zip)){
        alert("Invalid ZIP code");
        return;
    }

    // call API
    vals = getInfo(zip);

    // set maxes on values (wind speed and UV index)
    vals.UV > 11 ? (vals.UV = 11) : vals.UV;
    vals.windSpeed > 73 ? (vals.windSpeed = 73) : vals.windSpeed;

    // update the weather info
    setBars(vals);
    document.getElementById("city").value = vals.city;
    document.getElementById("temp").value = tempUnit == 'F' ? vals.tempF : vals.tempC;
    document.getElementById("icon").src = vals.iconLink;

}

// input: dictionary of weather info with keys humidity, UV, windSpeed, windDir
function setBars(vals){
    // get each element to update
    let hum_bar = document.getElementById("humidity-fill");
    let hum_val = document.getElementById("humidity");
    let UV_bar = document.getElementById("UV-fill");
    let UV_val = document.getElementById("UV");
    let wind_bar = document.getElementById("wind-fill");
    let wind_dir = document.getElementById("wind_direction");
    let wind_val = document.getElementById("wind_speed");

    // update vals
    hum_val.innerHTML = vals["humidity"];
    UV_val.innerHTML = vals["UV"];
    wind_dir.innerHTML = vals["windDir"];
    wind_val.innerHTML = vals["windSpeed"];

    // update bars
    hum_bar.style.width = vals["humidity"] + "%";
    UV_bar.style.width = (vals["UV"]/11)*100 + "%";
    wind_bar.style.width = (vals["windSpeed"]/73)*100 + "%";
}

function verifyZip(zip){
    // simple regex to check if the zip code is correct format
    let regex = /^\d{5}$/;
    return regex.test(zip);
}

// toggle between Fahrenheit and Celsius
let tempUnit = "F";
function toggleTemp(){
    tempUnit = tempUnit == "F" ? "C" : "F";
    let deg = "&deg;"

    // change the text of the button
    document.getElementById("units").innerHTML = deg + tempUnit;
    // change the temperature
    document.getElementById("temp").innerHTML = weatherInfo[`temp${tempUnit}`] + deg;
}