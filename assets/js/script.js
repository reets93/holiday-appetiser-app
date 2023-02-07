// RITA's OPENTRIPMAP API
var apiKey = "5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329"
var radius = "15000" //15km radius 
var destination;


// persist local storage 
// if nothing in local storage, previously searched is hidden
if (localStorage.length == 0) {
  $('#searchHistory').addClass("hide")
}

// displays searched cities from previous sessions (won't update / populate straight away)
persistData()
function persistData() {
  for (i = 0; i < localStorage.length; i++) {
    var historyBtn = $('<button>').addClass("history-btn").addClass("btn").addClass("btn-sm").addClass("btn-outline-primary").css({ border: "#f6f6f6", margin: "5px" })
    var histText = localStorage.getItem("destination" + [i])
    historyBtn.text(histText).addClass("text-capitalize")
    $('#hist-buttons').append(historyBtn)
  }
}

$('#clear-search').on('click', function (e) { //clears the whole page/refreshes... 
  localStorage.clear()
  e.stopPropagation()  
  e.preventDefault()
  $('#hist-buttons').empty()
  $('#searchHistory').addClass('hide')
})

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

  var citiesArr = ["Mexico City", "Belgrade", "Lisbon", "Buenos Aires", "Milan", "Paris", "Beirut", "Manila", "Toronto", "Kyiv", "Prague", "Dublin", "Hamburg", "Los Angeles"]
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
});


// generate basic details for the city
$('#submit-btn').on('click', function (e) { //added id on submit button
  //button clicked is working - just not bringing up modal

  e.preventDefault()
  e.stopPropagation()

  destination = $('#searchInput').val().trim()
  // $('#submit-btn').click(function(){
  console.log("Button clicked")
  if (!destination) {// check the user entered a destination
    // alert("You need to enter a city or press the Surprise Me button")
    $('#myModal').modal('show')
  } else {
    destinationData()
    storeData()
  }
})

// saving search input to local storage
function storeData() {
  localStorage.setItem("destination"+[i], destination)
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
    if (response.partial_match || response.status === "NOT_FOUND") {
      // destination not found or partially matched
      // alert("destination " + destination + " not found");
      $('#myModal2').modal('show')
    } else {
      //clears search input after submit
      $('#searchInput').val('')
      $('#chosen-city').empty()
      $('#flag').empty()
      $('.image').empty()
      $('.info').empty()
      $('#glimpse').empty()
      // adds city to heading of results
      // $('#chosen-city').append(destination.charAt(0).toUpperCase() + destination.slice(1))
      $('#chosen-city').append(destination).addClass("text-capitalize")
      $('#glimpse').append("A glimpse of " + destination).addClass("text-capitalize")

      // add popuation
      $('#population').text("Population: " + response.population)

      //adds country
      $('#country').text("Country: " + response.country)

      loadImg(destination)
      infos(destination)
      moreDetails(response)
      flag(response)
      timezone()
      airport()
      displayForecast()

    }
  })
}


//Lissa Timezone function 
function timezone() {
  $.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/worldtime?city=' + destination,
    headers: { 'X-Api-Key': 'Y7LcVCBBcLzGCCiZNZ3Rhw==D3rdORUGMPG9L8OT' },
    contentType: 'application/json',
    success: function (result) {
      var time = result.datetime.split(" ")[1]
      var day = result.day
      var month = result.month
      var year = result.year
      $("#date").text("It is now " + time + " on the " + day + "/" + month + "/" + year + ".")
      $("#timezone").text("Timezone: " + result.timezone)

    },
    error: function ajaxError(jqXHR) {
      // console.error('Error: ', jqXHR.responseText);
    }
  })
}

//Lissa Airport
function airport() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e282bb636cmsh1e6a309997edbd9p185dc8jsnc44538e21ea7",
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
    },
  };

  fetch(
    "https://travel-advisor.p.rapidapi.com/airports/search?query=" +
    destination,
    options
  )
    .then((response) => {
      return response.json();
    })
    .then(function (result) {
      console.log(result);

      if (result.length === 1) {
        var allAirports = result[0].display_name;
        console.log("City only has one airport: " + allAirports);
        $("#airport").text("Airport: " + allAirports)
        return allAirports;
      } else {
        var displayName = result[1].display_name;
        console.log("City's main airport is: " + displayName);
        $("#airport").text("Airport: " + displayName)
        return displayName;
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
  }).then(function (response) {
    console.log(response)
    $('#days').empty()
    var weatherArray = response.list;
    for (var i = 0; i < weatherArray.length; i++) {
      delete weatherArray[35]; // should remove last 5 results 
      console.log(weatherArray[i]);
      if (weatherArray[i].dt_txt.split(' ')[1] === '12:00:00') {
        var cityMain = $('<div>');
        cityMain.addClass('col-lg-3 col-md-6 mb-2 forecast-card');
        var date = $("<h6>").text(response.list[i].dt_txt.split(" ")[0]);
        var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + weatherArray[i].weather[0].icon + '.png');
        var minTemp = $('<p>').text('Min Temperature: ' + Math.floor(weatherArray[i].main.temp_min) + '°C');
        var maxTemp = $('<p>').text('Temp: ' + Math.floor(weatherArray[i].main.temp_max) + '°C');
        var dayOfWeek = moment(response.list[i].dt_txt.split(" ")[0]).format("dddd")
        // cityMain.append(image).append(dayOfWeek).append(date).append(maxTemp)
        cityMain.append(image).append(dayOfWeek).append(maxTemp)

        $('#days').append(cityMain);

      }
    }

  });
};


// links flag to country code 
function flag(response) {
  var countryCode = response.country.toLowerCase()
  var flagURL = "https://flagcdn.com/w320/" + countryCode + ".png" // perhaps use openweather countrycode for more accuracy?
  var flag = $('<img>').attr("src", flagURL).css({ border: ".05px solid #333333" }).addClass("flagImg")
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
      "http://api.opentripmap.com/0.1/en/places/xid/" + xid + "?apikey=" + apiKey;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)

        //creating dynamically HTML card and appendint it to the POI Div with the releveant data elements
        poiEl.append(
          $("<div>", {
            class: "col-sm-12 col-md-6 col-lg-4 attraction-card",
          }).append(
            $("<div>", { class: "poi-card" }).append(
              $("<div>", { class: "card-body" }).append([
                $("<h5>").attr("class", "card-title").text(data.name),
                $("<img>").addClass("card-img-top").attr("src", data.preview.source),
                $("<p>")
                  .attr("class", "card-text")
                  .html(data.wikipedia_extracts.html.substring(0, 200) + `<a target="_blank" href="${data.wikipedia}"> ...Read more at Wikipedia.org</a>`
                  ),
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
    "&order_by=relevant&orientation=landscape&per_page=3&client_id=" +
    unsplashKey;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        $('.image').append(
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
      $('#info-title').text("Get to know " + destination).addClass("text-capitalize")
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
  if (!fromText.value) {
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
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  translateBtn.innerText = "Translating...";
  options.body = JSON.stringify(
    {
      "from": translateFrom,
      "to": translateTo,
      "e": "",
      "q": text.split('\n')
    }
  );
  let apiUrl = `https://ultra-fast-translation.p.rapidapi.com/t`;
  fetch(apiUrl, options).then(res => res.json()).then(data => {

    //console.log(options.body);
    //console.log(data);

    if (data.message) {
      toText.style.color = "red";
      toText.innerHTML = data.message;
      return
    } else {
      toText.style.color = "black";
      toText.innerHTML = data.map(e => (e || e[0])).join('<br/>');
    }

    toText.setAttribute("placeholder", "Translation");
    translateBtn.innerText = "Translate Text";
  });
});


icons.forEach(icon => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.innerText) return;
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.innerText);
      }
    } else {
      let utterance;
      if (target.id == "from") {
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