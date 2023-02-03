
//* * * * for Surprise Me city --> need to create an array of random cities to be randomly generated on button click
// RITA's OPENTRIPMAP API
var apiKey = "5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329"
var radius = "5000" //5km radius 
var destination;

// generate basic details for the city
$('#submit-btn').on('click', function (e) { //added id on submit button
    e.preventDefault()
    e.stopPropagation()

    destination = $('#exampleInputEmail1').val().trim()
    var destURL = "http://api.opentripmap.com/0.1/en/places/geoname?name=" + destination + "&apikey=" + "5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329"

    $.ajax({
        url: destURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        //clears search input after submit
        $('#exampleInputEmail1').val('')
        $('#chosen-city').empty() // clear header (CHECK THIS!)
        $('.image').empty()
        $('.info').empty()
        
        // adds city to heading of results
        $('#chosen-city').append(destination.charAt(0).toUpperCase() + destination.slice(1))
        loadImg(destination)
        infos(destination)
        initialData(response)
        moreDetails(response)
    })

})

// adds basic info to the page 
function initialData(response) {
    //adds timezone to facts
    // var timezone = "Time Zone: " + response.timezone //added response li and changed class to id
    // $('#timezone').text(timezone)

    // var time = moment().tz(timezone).format("h:mma"); //need to link to city input timezone
    // var date = moment().tz(timezone).format("Do MMM YYYY") ///need to link to city input timezone
    // $('#date').text("It is now   " + time + " on the  " + date)

}


// uses basic info + inputted radius to generate search results 
function moreDetails(response) {
    var lon = response.lon
    var lat = response.lat

    var filtersURL = "https://api.opentripmap.com/0.1/en/places/radius?radius=" + radius + "&lon=" + lon + "&lat=" + lat + "&format=json&limit=4&apikey=" + apiKey

    $.ajax({
        url: filtersURL,
        method: "GET",
    }).then(function (filterResults) {
        console.log(filterResults)

        topAttractions(filterResults)
    })
}

function topAttractions(filterResults) { //links not properly working?
    $('#attraction-1').text(filterResults[0].name)
    $('#btn-1').attr("href", "https://www.wikidata.org/wiki/"+filterResults[0].xid)
    $('#attraction-2').text(filterResults[1].name)
    $('#btn-1').attr("href", "https://www.wikidata.org/wiki/"+filterResults[1].xid)
    $('#attraction-3').text(filterResults[2].name)
    $('#btn-1').attr("href", "https://www.wikidata.org/wiki/"+filterResults[2].xid)
    $('#attraction-4').text(filterResults[3].name)
    $('#btn-1').attr("href", "https://www.wikidata.org/wiki/"+filterResults[3].xid)


}


// KAMEL UNSPLASH 
// let destination = prompt("Where do you want to go?")
let unsplashKey = "ESyjXqRXwVskR1K0ur2j9_oBwjBORBDQ-nCOppV4ie0";
$("#welcome").text("Welcome to " + destination);
window.addEventListener('load', loadImg);
function loadImg() {
  const url = "https://api.unsplash.com/search/photos?query="+ destination +"&order_by=relevant&orientation=landscape&client_id="+ unsplashKey;
  const imageDiv = document.querySelector('.image');
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
                for (let i = 0; i < data.results.length; i++) {
                        $(".image").append($("<img>")
                        .attr("src",data.results[i].urls.thumb)
                        .attr("alt",data.results[i].alt_description)
                )}
            });
}
//end unsplash

// KAMEL Wiki
window.addEventListener('load', infos);
function infos() {
  const url = "https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exchars=1000&exintro=true&explaintext=true&generator=search&gsrlimit=3&gsrsearch="+ destination ;
  const infoDiv = document.querySelector('.info');
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
                let result = Object.values(data.query.pages);
                console.log(result[0].extract);
                $(".info").append($("<p>").text(result[0].extract));
        });
}
// end wiki