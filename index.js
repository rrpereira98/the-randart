import express from "express";
import axios from "axios";
import { render } from "ejs";

const app = express();
const port = 3000;
const apiURL = "https://api.artic.edu/api/v1/artworks";

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    let response = await axios.get(`${apiURL}?limit=1`);
    let result = response.data;

    let randomPage = Math.floor(Math.random() * result.pagination.total_pages);

    result = (await axios.get(`${apiURL}?limit=1&page=${randomPage}`)).data;
    let artwork = result.data[0];
    let artworkImage = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
    console.log(artworkImage);
    res.render("index.ejs", { artwork: artwork, artworkImage: artworkImage });
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
