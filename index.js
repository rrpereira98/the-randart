import express from "express";
import axios from "axios";
import { render } from "ejs";

const app = express();
const port = 3000;
const apiURL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    //get a object with the total amount of artworks and the id from european paintings department
    let response = await axios.get(`${apiURL}?departmentIds=11`);
    let result = response.data

    // from all the artworks choose a random one and get its details
    let randomArtId = result.objectIDs[Math.floor(Math.random() * result.total)]
    let randomArt = (await axios.get(`${apiURL}/${randomArtId}`)).data;

    // if the random artwork does not have a picture, get another random one until it does have a picture
    let hasImage = false
    while (!hasImage) {
      if(randomArt.primaryImage === "") {
        randomArtId = result.objectIDs[Math.floor(Math.random() * result.total)]
        randomArt = (await axios.get(`${apiURL}/${randomArtId}`)).data;
      } else {
        hasImage = true
      }
    }

    res.render("index.ejs", { artwork: randomArt });

  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.send("Something went wrong, try refreshing the page")
  }
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
