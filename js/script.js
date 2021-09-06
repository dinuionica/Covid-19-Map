"use strict";

/* acces token used to connect the mapbox service */
const accessToken =
  "pk.eyJ1IjoiZGludWlvbmljYSIsImEiOiJja3Q4YTNkbnoxMDRqMm9xbG1oZjE5Z2MwIn0.eI67dDjPdROFjGp6kF6gEQ";
mapboxgl.accessToken = accessToken;

/* dom connections */
const searchArea = document.querySelector("#input-area");
const searchButton = document.querySelector("#btn-search");
const infoInfections = document.querySelector("#number-infections");
const infoDeads = document.querySelector("#number-deads");

let totalNumberInfections = 0;
let totalNumberDeads = 0;

/* displaying map with last results */
const changeColorAfterInfections = (number_infections) => {
  if (number_infections > 100) {
    return "red";
  } else if (number_infections > 10) {
    return "green";
  } else {
    return "blue";
  }
};
/* attributes of the map */
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 1,
  center: [0, 20],
});
/* fetch api and take a response */
fetch("api_data.json")
  .then((response) => response.json())
  .then((data) => {
    /* acces places and reports of the api */
    const { places, reports } = data;
    reports.forEach((report) => {
      /* acces the number of infections and placesid */
      const { infected, placeId } = report;

      /* calculate total number of infections */
      while (totalNumberInfections < 1000000) {
        totalNumberInfections += Number(infected);
      }

      /* calculate total number of deads */
      while (totalNumberDeads < 1000000) {
        totalNumberDeads += Number(report.dead);
      }

      /* update info tag */
      infoInfections.textContent = `${totalNumberInfections}`;
      infoDeads.textContent = `${totalNumberDeads}`;
      /* create an object of one country and mark it on the map */
      const currentPlace = places.find((place) => place.id === placeId);
      new mapboxgl.Marker({
        color: changeColorAfterInfections(report.infected),
      })
        .setLngLat([currentPlace.longitude, currentPlace.latitude])
        .addTo(map);
    });
  });

/* search login */
searchButton.addEventListener("click", function () {
  fetch("api_data.json")
    .then((response) => response.json())
    .then((data) => {
      const { places, reports } = data;
      /* acces the country with the desired id */
      let desiredId = "";
      places.forEach((place) => {
        if (place.name === searchArea.value) {
          desiredId = place.id;
        }
      });

      /* update info tag */
      reports.forEach((report) => {
        if (report.placeId === desiredId) {
          infoInfections.textContent = `${report.infected}`;
          infoDeads.textContent = `${report.dead}`;
        }
      });
    });
});
