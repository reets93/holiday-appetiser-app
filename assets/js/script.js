
// const settings = {
// 	async: true,
// 	crossDomain: true,
// 	url: "https://booking-com.p.rapidapi.com/v1/metadata/exchange-rates?locale=en-gb&currency=AED",
// 	method: "GET",
// 	headers: {
// 		"X-RapidAPI-Key": "e282bb636cmsh1e6a309997edbd9p185dc8jsnc44538e21ea7",
// 		"X-RapidAPI-Host": "booking-com.p.rapidapi.com"
// 	}
// };

// $.ajax(settings).done(function (response) {
// 	console.log(response);
// });

// const settings = {
// 	async: true,
// 	crossDomain: true,
// 	url: "https://hotels-com-provider.p.rapidapi.com/v2/hotels/details?domain=AE&locale=en_GB&hotel_id=1105156",
// 	method: "GET",
// 	headers: {
// 		"X-RapidAPI-Key": "e282bb636cmsh1e6a309997edbd9p185dc8jsnc44538e21ea7",
// 		"X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
// 	}
// };

// $.ajax(settings).done(function (response) {
// 	console.log(response);
// });





    // $.ajax({
    //     url: "https://api.opentripmap.com/0.1/en/places/?apikey=5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329",
    //     method: "GET",
    //     }).then(function(response) {  // We store all of the retrieved data inside of an object called "response"
    //        console.log(current)
    //        console.log("GOt current weather api response")
    //        console.log(response)
    //     })

    // const apiKey = "5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329";

    // function apiGet(method, query) {
    //   return new Promise(function(resolve, reject) {
    //     var otmAPI =
    //       "https://api.opentripmap.com/0.1/en/places/" +
    //       method +
    //       "?apikey=" +
    //       apiKey;
    //     if (query !== undefined) {
    //       otmAPI += "&" + query;
    //     }
    //     fetch(otmAPI)
    //       .then(response => response.json())
    //       .then(data => resolve(data))
    //       .catch(function(err) {
    //         console.log("Fetch Error :-S", err);
    //       });
    //   });
    // }
    // apiGet("Get", "Barcelona")

    $.ajax({
        url: "https://api.opentripmap.com/0.1/en/places/radius?radius=1000&lon=37.61556&lat=55.75222&format=json&limit=5&apikey=5ae2e3f221c38a28845f05b6b0c68e4cbb10ed5f2dbed753f3070329",
        method: "GET",
        }).then(function(response) {  // We store all of the retrieved data inside of an object called "response"
           console.log(response)
        })

        // const settings = {
        //     async: true,
        //     crossDomain: true,
        //     url: "https://opentripmap-places-v1.p.rapidapi.com/%7Blang%7D/places/geoname?name=London",
        //     method: "GET",
        //     headers: {
        //         "X-RapidAPI-Key": "e282bb636cmsh1e6a309997edbd9p185dc8jsnc44538e21ea7",
        //         "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com"
        //     }
        // };
        
        // $.ajax(settings).done(function (response) {
        //     console.log(response);
        // });