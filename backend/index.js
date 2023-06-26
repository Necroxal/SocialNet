const db =  require('./config/connectDB');
//Environment Variables
const dotenv = require('dotenv');
dotenv.config();

const router = require('./routes/routes');
const express = require('express');
const cors = require('cors');



//Connect to db
db(process.env.URL);

const app = express();
const PORT = process.env.PORT;


//Cors
app.use(cors());
// Configurar cabeceras y cors

//body dates to json
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.use(`/backend/public`, express.static(`public`));
router(app);


//listen
app.listen(PORT,  ()=>{
    console.log(`The server is listen on port: ${PORT}`);
});