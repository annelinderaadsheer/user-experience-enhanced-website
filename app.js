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
const fetchFromApi = (endpoint) => {
  return fetchJson(baseUrl + endpoint).then((response) => response.data);
};

// Data ophalen van de API
// fetchData().then((allAdvertisementsData) => {

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

// GET-routes

// GET-route voor de index homepagina
app.get("/", function (request, response) {
  response.render("homepage");
});

// GET-route voor contact pagina
app.get("/contact", function (request, response) {
  response.render("contact");
});

// GET-route voor about pagina
app.get("/about", function (request, response) {
  response.render("about");
});

// GET-route voor FAQ pagina
app.get("/faq", function (request, response) {
  response.render("faq");
});

// GET-route voor opdracht pagina
app.get("/opdracht", function (request, response) {
  response.render("opdracht");
});

// GET-route voor vraag-aanbod pagina, eigen data inladen 
app.get("/vraag-aanbod", function (request, response) {
  fetchJson("https://fdnd-agency.directus.app/items/dh_services").then(
    (apiData) => {
      {
        response.render("vraag-aanbod.ejs", { vraagaanbod: apiData.data });
      }
    }
  );
});

// GET-route voor vraag-aanbod/:detail pagina

// GET-route voor succes pagina
app.get("/succes", function (request, response) {
  response.render("succes");
});

// GET-route voor view pagina
app.get("/view", function (request, response) {
  response.render("view");
});

// POST-routes

// POST-route om form gegevens te verwerken voor opdracht
app.post("/opdracht", function (request, response) {
  const formData = request.body;

  const newAdvertisement = {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    contact: formData.contact,
    title: formData.title,
    short_description: formData.short_description,
    long_description: formData.long_description,
    location: formData.location,
    neighbourhood: formData.neighbourhood,
    start_date: formData.start_date,
    end_date: formData.end_date,
    start_time: formData.start_time,
    end_time: formData.end_time,
  };

  // Gegevens naar de API endpoint sturen
  fetchJson(baseUrl + "/items/dh_services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAdvertisement),
  }).then((responseFromAPI) => {
    console.log("Response from API:", responseFromAPI);

    // Bijwerken van de gegevens vanuit de API
    fetchData().then((updatedData) => {
      allAdvertisementsData = updatedData;
      response.redirect("/succes");
    }).catch((error) => {
      console.error("Error fetching data from API:", error);
      response.status(500).send("Internal Server Error");
    });
  }).catch((error) => {
    console.error("Error while posting data to API:", error);
    response.status(500).send("Internal Server Error");
  });
});

 // Poortnummer instellen waarop Express moet luisteren
app.set("port", process.env.PORT || 8000);

// Start express server op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
