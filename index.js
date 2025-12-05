const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Configurer EJS comme moteur de templates
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

// Connexion MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "testdb";

async function main() {
  await client.connect();
  console.log("✅ Connecté à MongoDB !");
  const db = client.db(dbName);
  const collection = db.collection("utilisateurs");

  // Route principale
  app.get("/", async (req, res) => {
    // Récupérer tous les utilisateurs
    const users = await collection.find({}).toArray();
    res.render("index", { users });
  });


  // Route POST : ajouter un utilisateur
  app.post("/add", async (req, res) => {
    const { name, age } = req.body;
    await collection.insertOne({ name, age: parseInt(age) });
    res.redirect("/"); // retour à la liste
  });

  // Démarrer serveur
  app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${port}`); 
  });
}

main().catch(console.error);
   
