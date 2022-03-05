import { Dynamo } from "./Dynamo.js"
import { Loader } from 'google-maps';
var dotenv = require("dotenv");
dotenv.config();

var docClient = null;
var productID = [];
var cost = [];
var product = [];
var productType = [];
var sellerName = [];
var userID = [];
var locationArray = [];

window.onload = function() {
	let scanButton = document.getElementById("scanData");
  let mapButton = document.getElementById("mapHi");

  scanButton.addEventListener("click", dynamoScan, false);
  mapButton.addEventListener("click", initMap, false);

  docClient = new Dynamo();
}

async function dynamoScan() {
  const response = await docClient.scanTable("ProductCatalog");
  for (let i =0; i < response.Items.length; i++) {
      productID.push(response.Items[i].ProductID);
      cost.push(response.Items[i].Cost);
      product.push(response.Items[i].Product);
      productType.push(response.Items[i].ProductType);
      sellerName.push(response.Items[i].SellerName);
      userID.push(response.Items[i].UserID);
      locationArray.push(response.Items[i].Location);
  }
}

async function initMap() {
  const loader = new Loader(process.env.MAPS_KEY);
  var latitude = [];
  var longitude = [];
  var myLatLng = [];
  var contentString = [];
  var infowindow = [];
  var marker = [];
  var correctLAT = [];
  var correctLONG = [];
  const google = await loader.load();

  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 34.064070, lng: -118.441020 },
  });
  
  var geocoder = new google.maps.Geocoder();
  for(let i = 0; i < productID.length; i++) {
    geocoder.geocode({ 'address': locationArray[i]}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        latitude[i] = results[0].geometry.location.lat();
        longitude[i] = results[0].geometry.location.lng();
      }

      myLatLng[i] = {lat: latitude[i], lng: longitude[i]};

      correctLAT.push(latitude[i]);
      correctLONG.push(longitude[i]);

      contentString[i] = productType[i] + ' ' + product[i] + '. Cost: ' + cost[i] + '. Seller Name: ' + sellerName[i] +
                        '<p>Post Page: <a href=/postdes.html?productid=' + productID[i] +'>Link</a></p>';

      infowindow[i] = new google.maps.InfoWindow({
        content: contentString[i],
      });
      
      marker[i] = new google.maps.Marker({ position: myLatLng[i], map, title: "Free and For Sale Map" });
    
      marker[i].addListener("click", () => {
        infowindow[i].open({ anchor: marker[i], map, shouldFocus: false });
      });
    });
  }
}