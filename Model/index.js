const mongoose = require("mongoose");

const DB_URL = process.env.DEV_DB_URL;

mongoose.connect(DB_URL)
  .then((data)=>{
    console.log("connected to Mongo Database");
  })
  .catch((err)=>{
    console.log(err);
  })
