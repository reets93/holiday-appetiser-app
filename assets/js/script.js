// RITA's OPENTRIPMAP API
var apiKey = "5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329"
var radius = "15000" //15km radius 
var destination;

// persist local storage 
// if nothing in local storage, previously searched is hidden
if (localStorage.length == 0) {
    $('#searchHistory').addClass("hide") // check this code
}

// displays searched cities from previous sessions (won't update / populate straight away)
persistData()
function persistData() {
    for (i = 0; i < localStorage.length; i++) {
        var historyBtn = $('<button>').addClass("history-btn").addClass("btn").addClass("btn-outline-primary").css({ border: "#f6f6f6", margin: "5px", padding: "4px" })
        var histText = localStorage.getItem("destination" + [i])
        historyBtn.text(histText)
        $('#hist-buttons').append(historyBtn)
    }
}

// link search history button to search
$(".history-btn").on('click', function (e) {
    e.preventDefault()
    e.stopPropagation()
    var content = $(e.target).text()
    destination = content
    console.log("hist-btn:" + destination)
    destinationData()
})

// generate random city from list of cities
$('#random-btn').on('click', function (e) {
    e.preventDefault()
    e.stopPropagation()

    var citiesArr = ["Mexico City", "Belgrade", "Lisbon", "Buenos Aires", "Milan", "Shanghai", "Beijing", "Paris", "Cairo", "Beirut", "Manila", "Hong Kong", "Toronto", "Dakar", "Delhi", "Kyiv", "Warsaw", "Prague", "Dublin", "Hamburg", "Los Angeles"]
    var surpriseMe = function (arr) { //https://www.programiz.com/javascript/examples/get-random-item
        const randomIndex = Math.floor(Math.random() * arr.length)
        const randomCity = arr[randomIndex]
        return randomCity;
    }
    const surpriseCity = surpriseMe(citiesArr)
    console.log("Random city is: " + surpriseCity)

    destination = surpriseCity
    var destURL = "http://api.opentripmap.com/0.1/en/places/geoname?name=" + destination + "&apikey=" + "5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329"

    console.log(destination)
    destinationData()
    
})


// generate basic details for the city
$('#submit-btn').on('click', function (e) { //added id on submit button
    e.preventDefault()
    e.stopPropagation()

    destination = $('#searchInput').val().trim()
    destinationData()
    storeData()
})


// saving search input to local storage
function storeData() {
    localStorage.setItem("destination" + [i], destination)
    // persistData()
}


// repeating function to populate search results based on destination text input
function destinationData() {
    var destURL = "http://api.opentripmap.com/0.1/en/places/geoname?name=" + destination + "&apikey=" + "5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329"
    $('#destination-Info').removeClass("hide")

    $.ajax({
        url: destURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)

        //clears search input after submit
        $('#searchInput').val('')
        $('#chosen-city').empty()
        $('#flag').empty()
        $('.image').empty()
        $('.info').empty()

        // adds city to heading of results
        $('#chosen-city').append(destination.charAt(0).toUpperCase() + destination.slice(1))
        loadImg(destination)
        infos(destination)
        initialData(response)
        moreDetails(response)
        flag(response)
        // worldTime(destination)
        timezone()
        airport()
        displayForecast()
    })
}


// adds basic info to the page 
function initialData(response) {
    // add popuation
    $('#population').text("Population: " + response.population)


    //adds country
    $('#country').text("Country: " + response.country) // perhaps use openweather for more accuracy?
}

//Lissa Timezone
function timezone () {

$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/worldtime?city=' + destination,
    headers: { 'X-Api-Key': 'Y7LcVCBBcLzGCCiZNZ3Rhw==D3rdORUGMPG9L8OT'},
    contentType: 'application/json',
    success: function(result) {
        var time = result.datetime.split(" ")[1] 
        var day = result.day
        var month = result.month
        var year = result.year
        $("#date").text("It is now " + time + " on the " + day + "/" + month + "/" + year +".")
        $("#timezone").text("Timezone: " + result.timezone)

    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
    })
}

//Lissa Airport
function airport () {
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': 'e282bb636cmsh1e6a309997edbd9p185dc8jsnc44538e21ea7',
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
      }
  };
  
  fetch('https://travel-advisor.p.rapidapi.com/airports/search?query=' + destination, options)
      .then(response => {
          return response.json();
      })
      .then(function (result) {
          for (let i = 0; i < result.length; i++) {
              console.log(result)
              var airport = result[1].display_name
              console.log(airport)
              // var airport1 = result[2].display_name
              // console.log(airport1)
              // var airport2 = result[3].display_name
              // console.log(airport2)
              $("#airport").text("Airport: " + airport) 
          }
      })
  
  }

// timezone data  --> how can the results be modified to be more digestible?
function worldTime(destination) {
    var city = destination
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/worldtime?city=' + city,
        headers: { 'X-Api-Key': 'Y7LcVCBBcLzGCCiZNZ3Rhw==D3rdORUGMPG9L8OT' },
        contentType: 'application/json',
        success: function (result) {
            console.log("Time")
            console.log(result);
            // adds time and date to facts section 
            var time = result.hour + ":" + result.minute
            var date = result.day + "/" + result.month + "/" + result.year
            $('#date').text("It is now " + time + " on  " + date)

            //adds timezone
            $('#timezone').text("Time Zone: " + result.timezone)

        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText)
        }
    });
}


//Lissa Weather
function displayForecast() {
  var apiKey = "76dd56a7c869514402bbcfd7dbd7cbb7";
  var forecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + destination + "&units=metric&appid=" + apiKey;
  
  
  $.ajax({
      url: forecast,
      method: "GET",
      }).then(function(response) { 
         console.log(response)
         $('#days').empty()
         var weatherArray = response.list; 
         for (var i = 0; i <weatherArray.length; i++) {
          console.log(weatherArray[i]);
          if (weatherArray[i].dt_txt.split(' ')[1] === '12:00:00') {
               var cityMain = $('<div>');
               cityMain.addClass('col-lg-2 col-md-6 mb-2 forecast-card>');
               var date = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
               var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + weatherArray[i].weather[0].icon + '.png');
               var minTemp = $('<p>').text('Min Temperature: ' + weatherArray[i].main.temp_min + '°C');  
               var maxTemp = $('<p>').text('Max Temperature : ' + weatherArray[i].main.temp_max + '°C');                               
               cityMain.append(date).append(image).append(minTemp).append(maxTemp)
               
               $('#days').append(cityMain);
               
      }
   }

  });
};


// links flag to country code 
function flag(response) {
    var countryCode = response.country.toLowerCase()
    var flagURL = "https://flagcdn.com/h240/" + countryCode + ".png" // perhaps use openweather countrycode for more accuracy?
    var flag = $('<img>').attr("src", flagURL)
    $('#flag').append(flag)
}


// uses basic info + inputted radius to generate search results 
function moreDetails(response) {
    var lon = response.lon
    var lat = response.lat

    var filtersURL = "https://api.opentripmap.com/0.1/en/places/radius?radius=" + radius + "&lon=" + lon + "&lat=" + lat + "&rate=3&format=json&limit=6&apikey=" + apiKey

    $.ajax({
        url: filtersURL,
        method: "GET",
    }).then(function (filterResults) {
        console.log(filterResults)

        pointsOfInterest(filterResults)
    })
}

// points of interest start
// points of interest Div element
let poiEl = $("#top-attractions");

//function to create POI's objects by requests using xid's
function pointsOfInterest(filterResults) {
    poiEl.empty(); // remove previous POI's

    // function that created a url request for each xid
  for (let i = 0; i <= filterResults.length; i++) {
    let xid = filterResults[i].xid;
    var url =
      "http://api.opentripmap.com/0.1/en/places/xid/" +  xid + "?apikey=" +  apiKey;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)

    //creating dynamically HTML card and appendint it to the POI Div with the releveant data elements
        poiEl.append(
          $("<div>", {
            class: "col-sm-12 col-md-6 col-lg-4 attraction-card",
          }).append(
            $("<div>", { class: "card" }).append(
              $("<div>", { class: "card-body" }).append([
                $("<h5>")
                  .attr("class", "card-title")
                  .text(data.name),
                $("<img>").addClass("image").attr("src", data.preview.source),
                $("<p>")
                  .attr("class", "card-text")
                  .html(data.wikipedia_extracts.html),
                $("<p>")
                //opentripmap code example for 
                .attr("class", "card-text").innerHTML = `<p><a target="_blank" href="${data.otm}">Show more at OpenTripMap</a></p>`,
                // ($("<a>").attr("target",_blank).attr("href",wikipedia).text("See more at Wikipedia.com"))
                $("<p>")
                //opentripmap code example for 
                .attr("class", "card-text").innerHTML = `<p><a target="_blank" href="${data.wikipedia}">Full article at Wikipedia.com</a></p>`
                // ($("<a>").attr("target",_blank).attr("href",wikipedia).text("See more at Wikipedia.com"))
              ])
            )
          )
        );
      });
  }
}



// KAMEL UNSPLASH
// let destination = prompt("Where do you want to go?")
let unsplashKey = "ESyjXqRXwVskR1K0ur2j9_oBwjBORBDQ-nCOppV4ie0";
$("#welcome").text("Welcome to " + destination);
window.addEventListener("load", loadImg);
function loadImg() {
  const url =
    "https://api.unsplash.com/search/photos?query=" +
    destination +
    "&order_by=relevant&orientation=landscape&client_id=" +
    unsplashKey;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        $(".image").append(
          $("<img>")
            .attr("src", data.results[i].urls.small)
            .attr("alt", data.results[i].alt_description)
        );
      }
    });
}
//end unsplash

// KAMEL Wiki
function infos() {
  const url =
    "https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exchars=1000&exintro=true&explaintext=true&generator=search&gsrlimit=3&gsrsearch=" +
    destination;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let result = Object.values(data.query.pages);
      console.log(result[0].extract);
      $('#info-title').text("Get to know " + destination.charAt(0).toUpperCase() + destination.slice(1))
      $(".info").append($("<p>").text(result[0].extract));
    });
}
// end wiki


//translator start
//https://codepen.io/oussamasibari/pen/JjLLxxv
const countries = {
  "am-ET": "Amharic",
  "ar-SA": "Arabic",
  "be-BY": "Bielarus",
  "bem-ZM": "Bemba",
  "bi-VU": "Bislama",
  "bjs-BB": "Bajan",
  "bn-IN": "Bengali",
  "bo-CN": "Tibetan",
  "br-FR": "Breton",
  "bs-BA": "Bosnian",
  "ca-ES": "Catalan",
  "cop-EG": "Coptic",
  "cs-CZ": "Czech",
  "cy-GB": "Welsh",
  "da-DK": "Danish",
  "dz-BT": "Dzongkha",
  "de-DE": "German",
  "dv-MV": "Maldivian",
  "el-GR": "Greek",
  "en-GB": "English",
  "es-ES": "Spanish",
  "et-EE": "Estonian",
  "eu-ES": "Basque",
  "fa-IR": "Persian",
  "fi-FI": "Finnish",
  "fn-FNG": "Fanagalo",
  "fo-FO": "Faroese",
  "fr-FR": "French",
  "gl-ES": "Galician",
  "gu-IN": "Gujarati",
  "ha-NE": "Hausa",
  "he-IL": "Hebrew",
  "hi-IN": "Hindi",
  "hr-HR": "Croatian",
  "hu-HU": "Hungarian",
  "id-ID": "Indonesian",
  "is-IS": "Icelandic",
  "it-IT": "Italian",
  "ja-JP": "Japanese",
  "kk-KZ": "Kazakh",
  "km-KM": "Khmer",
  "kn-IN": "Kannada",
  "ko-KR": "Korean",
  "ku-TR": "Kurdish",
  "ky-KG": "Kyrgyz",
  "la-VA": "Latin",
  "lo-LA": "Lao",
  "lv-LV": "Latvian",
  "men-SL": "Mende",
  "mg-MG": "Malagasy",
  "mi-NZ": "Maori",
  "ms-MY": "Malay",
  "mt-MT": "Maltese",
  "my-MM": "Burmese",
  "ne-NP": "Nepali",
  "niu-NU": "Niuean",
  "nl-NL": "Dutch",
  "no-NO": "Norwegian",
  "ny-MW": "Nyanja",
  "ur-PK": "Pakistani",
  "pau-PW": "Palauan",
  "pa-IN": "Panjabi",
  "ps-PK": "Pashto",
  "pis-SB": "Pijin",
  "pl-PL": "Polish",
  "pt-PT": "Portuguese",
  "rn-BI": "Kirundi",
  "ro-RO": "Romanian",
  "ru-RU": "Russian",
  "sg-CF": "Sango",
  "si-LK": "Sinhala",
  "sk-SK": "Slovak",
  "sm-WS": "Samoan",
  "sn-ZW": "Shona",
  "so-SO": "Somali",
  "sq-AL": "Albanian",
  "sr-RS": "Serbian",
  "sv-SE": "Swedish",
  "sw-SZ": "Swahili",
  "ta-LK": "Tamil",
  "te-IN": "Telugu",
  "tet-TL": "Tetum",
  "tg-TJ": "Tajik",
  "th-TH": "Thai",
  "ti-TI": "Tigrinya",
  "tk-TM": "Turkmen",
  "tl-PH": "Tagalog",
  "tn-BW": "Tswana",
  "to-TO": "Tongan",
  "tr-TR": "Turkish",
  "uk-UA": "Ukrainian",
  "uz-UZ": "Uzbek",
  "vi-VN": "Vietnamese",
  "wo-SN": "Wolof",
  "xh-ZA": "Xhosa",
  "yi-YD": "Yiddish",
  "zu-ZA": "Zulu"
}

const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchageIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("#translateBtn"),

selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
      let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "es-ES" ? "selected" : "";
      let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
  }
});

exchageIcon.addEventListener("click", () => {
  let tempText = fromText.value,
  tempLang = selectTag[0].value;
  fromText.value = toText.innerText;
  toText.innerText = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if(!fromText.value) {
      toText.innerText = "";
  }
});

/****************************/
const options = {
method: 'POST',
headers: {
  'content-type': 'application/json',
  'X-RapidAPI-Key': 'c2432b444dmsh909f603234f0c69p1a0e09jsne64b3c285be3',
  'X-RapidAPI-Host': 'ultra-fast-translation.p.rapidapi.com'
},
body: '{"from":"auto","to":"ar","e":"","q":""'
};
/****************************/

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
  translateFrom = selectTag[0].value,
  translateTo = selectTag[1].value;
  if(!text) return;
  toText.setAttribute("placeholder", "Translating...");
  translateBtn.innerText = "Translating...";
  options.body =JSON.stringify(
    {
      "from":translateFrom,
      "to":translateTo,
      "e":"",
      "q":text.split('\n')
    }
  );
  let apiUrl = `https://ultra-fast-translation.p.rapidapi.com/t`;
  fetch(apiUrl, options).then(res => res.json()).then(data => {

      //console.log(options.body);
      //console.log(data);

      if(data.message){
        toText.style.color = "red";
        toText.innerHTML = data.message;
        return
      }else{
        toText.style.color = "black";
        toText.innerHTML = data.map(e => (e||e[0])).join('<br/>');
      }
      
      toText.setAttribute("placeholder", "Translation");
      translateBtn.innerText = "Translate Text";
  });
});



icons.forEach(icon => {
  icon.addEventListener("click", ({target}) => {
      if(!fromText.value || !toText.innerText) return;
      if(target.classList.contains("fa-copy")) {
          if(target.id == "from") {
              navigator.clipboard.writeText(fromText.value);
          } else {
              navigator.clipboard.writeText(toText.innerText);
          }
      } else {
          let utterance;
          if(target.id == "from") {
              utterance = new SpeechSynthesisUtterance(fromText.value);
              utterance.lang = selectTag[0].value;
          } else {
              utterance = new SpeechSynthesisUtterance(toText.innerText);
              utterance.lang = selectTag[1].value;
          }
          speechSynthesis.speak(utterance);
      }
  });
});
//translator end