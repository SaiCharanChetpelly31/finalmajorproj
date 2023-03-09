const { Event } = require("../models/event");
const Admin = require("../models/admin");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "InVITe event super secret key here...";

const postEvent = async (req, res) => {
  const Name = req.body.name;
  const Venue = req.body.venue;
  const Date = req.body.date;
  const Time = req.body.time;
  const Desc = req.body.description;
  const Price = req.body.price;
  const Profile = req.body.profile;
  const Cover = req.body.cover;
  const Organizer = req.body.organizer;

  const adminId = req.body.admin_id;
  console.log("Admin mil gaya: ", adminId);

  const secret = JWT_SECRET;
  const payload = {
    email: Name,
  };

  const token = await jwt.sign(payload, secret);

  const new_event = new Event({
    event_id: token,
    name: Name,
    venue: Venue,
    date: Date,
    time: Time,
    description: Desc,
    price: Price,
    profile: Profile,
    cover: Cover,
    organizer: Organizer,
  });
  
  try{
    new_event.save((error, success) => {
      if (error) console.log(error);
      else console.log("Saved::New Event::created.");
    });
  }
  catch(err) {
    console.log(err);
  }

  Admin.updateOne(
    { admin_id: adminId },
    {
      $push: {
        eventCreated: {
          event_id: token,
          name: Name,
          venue: Venue,
          date: Date,
          time: Time,
          description: Desc,
          price: Price,
          profile: Profile,
          cover: Cover,
          organizer: Organizer,
        },
      },
    },
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  res.status(200).send({ msg: "event created", event_id: token });
};

const allEvents = async (req, res) => {
  Event.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({ msg: "Error fetching data", error: err });
    });
};

const particularEvent = async (req, res) => {
  const eventId = req.body.event_id;
  Event.find({ event_id: eventId })
    .then((data) => {
      res.status(200).send(data[0]);
    })
    .catch((err) => {
      res.status(400).send({ msg: "Error fetching event", error: err });
    });
};

module.exports = {
  postEvent,
  allEvents,
  particularEvent,
};