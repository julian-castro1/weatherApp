weatherInfo = {"tempF":100, "tempC":35};


// eventListeners
document.getElementById("units").addEventListener("click", toggleTemp);
document.getElementById("zip-input").addEventListener("change", updateLocation);


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

// call Lambda through API Gateway to get weather information
// input: ZIP code
// output: weather info dictionary with keys: tempF, tempC, city, iconLink, humidity, UV, windSpeed, windDir
function getInfo(zip) {
  let apiKey = "5c05c4b0a91f4e15a6351712231208";
  let location = zip;
  let url = `http://api.weatherapi.com/v1/current.json?q=${location}&key=${apiKey}`;
  return fetch(url, {
    method: "GET",
    headers: {},
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      return data;
    })
    .catch((error) => {
      console.log(
        "There was a problem with the fetch operation:",
        error.message
      );
    });
}


// callback function for when the location is changed. Need to call API and update the weather info
async function updateLocation(){
    event.preventDefault();
    // verify input
    let zip = document.getElementById("zip-input").value;
    if(!verifyZip(zip)){
        alert("Invalid ZIP code");
        return;
    }

    // call API
    let response = await getInfo(zip);
    console.log(response);
    let vals = response.current;
    let loc = response.location;

    // set maxes on values (wind speed and UV index)
    vals.uv > 11 ? (vals.uv = 11) : vals.uv;
    vals.wind_mph > 73 ? (vals.wind_mph = 73) : vals.wind_mph;

    // update the weather info
    setBars(vals);
    document.getElementById("city").innerHTML = loc.name;
    document.getElementById("temp").innerHTML = tempUnit == 'F' ? vals.temp_f : vals.temp_c;
    document.getElementById("icon").src = vals.condition.icon;

}

// input: dictionary of weather info with keys humidity, UV, wind_mph, windDir
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
    UV_val.innerHTML = vals["uv"];
    wind_dir.innerHTML = vals["wind_dir"];
    wind_val.innerHTML = vals["wind_mph"];

    // update bars
    hum_bar.style.width = vals["humidity"] + "%";
    UV_bar.style.width = (vals["iv"]/11)*100 + "%";
    wind_bar.style.width = (vals["wind_mph"] / 73) * 100 + "%";
}

function verifyZip(zip){
    // simple regex to check if the zip code is correct format
    let regex = /^\d{5}$/;
    return regex.test(zip);
}