const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const itineraryRoutes = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

let Itinerary = require('./itinerary.model');

mongoose.connect('mongodb://127.0.0.1:27017/eItinierary', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use('/travelocity', itineraryRoutes);

itineraryRoutes.route('/').get((req, res) => {
    Itinerary.find((err, itineraries) => {
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        } else {
            res.json(itineraries);
        }
    });
});

itineraryRoutes.route('/:id').get((req, res) => {
    let id = req.params.id;
    Itinerary.findById(id, (err, itinerary) => {
        res.json(itinerary);
    });
});

itineraryRoutes.route('/update/:id').post((req, res) => {
    let id = req.params.id;
    Itinerary.findById(id, (err, itinerary) => {
        if (!itinerary) {
            res.status(404).send("data is not found");
        }         
        else {
            itinerary.itinerary_name = req.body.itinerary_name;
            itinerary.itinerary_country = req.body.itinerary_country;
            itinerary.itinerary_description = req.body.itinerary_description;
            itinerary.submitted_by = req.body.submitted_by;
            itinerary.rating = req.body.rating;
            itinerary.activities = req.body.activities;
            
            itinerary.save().then(() => {
                res.status(200).send('Itinerary updated!');
            })
            .catch(err => {
                res.status(500).send("Update not possible");
            });
        }        
    });
});

itineraryRoutes.route('/delete/:id').delete((req, res) => {
    let id = req.params.id;
    Itinerary.findById(id, (err, itinerary) => {
        if (!itinerary) {
            res.status(404).send("data is not found");
        } 
        else {
            Itinerary.deleteOne(itinerary, (err, result) => {
                if (err) {
                    res.status(500).send("Delete not possible");
                } 
                else {
                    res.status(200).send(result);
                }
            })
        }

    });
});

itineraryRoutes.route('/add').post((req, res) => {
    let itinerary = new Itinerary(req.body);
    console.log(req.body);
    itinerary.save().then(() => {
        res.status(200).json({'itinerary': 'itinerary added successfully'});
    }).catch(err => {
        res.status(400).send('adding new todo failed');
    })
});


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});