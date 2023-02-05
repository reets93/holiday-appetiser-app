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
        historyBtn.text(histText.charAt(0).toUpperCase() + histText.slice(1))
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
        worldTime(destination)
    })
}


// adds basic info to the page 
function initialData(response) {
    // add popuation
    $('#population').text("Population: " + response.population)


    //adds country
    $('#country').text("Country: " + response.country) // perhaps use openweather for more accuracy?
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

    var filtersURL = "https://api.opentripmap.com/0.1/en/places/radius?radius=" + radius + "&lon=" + lon + "&lat=" + lat + "&rate=3&format=json&limit=4&apikey=" + apiKey

    $.ajax({
        url: filtersURL,
        method: "GET",
    }).then(function (filterResults) {
        console.log(filterResults)

        topAttractions(filterResults)
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
                .attr("class", "card-text").innerHTML = `<p><a target="_blank" href="${data.wikipedia}">Show more at Wikipedia</a></p>`
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
window.addEventListener("load", infos);
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
