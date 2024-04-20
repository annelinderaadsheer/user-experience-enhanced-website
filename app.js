/*** Express setup & start ***/

// Importeer het npm pakket express uit de node_modules map
import express from "express";

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from "./helpers/fetch-json.js";

// Importeer slugify voor leesbare URLs met slug
// import slugify from "slugify";

// Declare de base URL van de directus API
const baseUrl = "https://fdnd-agency.directus.app";

// Maak een nieuwe express app aan
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stel ejs in als template engine
app.set("view engine", "ejs");

// Stel de map met ejs templates in
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static("public"));

// Fetch de data van de API

// Data ophalen van de API


// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

// Als iemand mijn route pagina bezoekt, dan rendert de homepage
app.get("/", function (request, response) {
  response.render("homepage");
});

// Get-route voor Contact pagina
app.get("/contact", function (request, response) {
  response.render("contact");
});

// Get-route voor About pagina
app.get("/about", function (request, response) {
  response.render("about");
});

// Get-route voor FAQ pagina
app.get("/faq", function (request, response) {
  response.render("faq");
});

// Get-route voor Opdracht pagina
app.get("/opdracht", function (request, response) {
  response.render("opdracht");
});

// Get-route voor Vraag-aanbod pagina, eigen data inladen 
app.get("/vraag-aanbod", function (request, response) {
  fetchJson("https://fdnd-agency.directus.app/items/dh_services").then(
    (apiData) => {
      {
        response.render("vraag-aanbod.ejs", { vraagaanbod: apiData.data });
      }
    }
  );
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
