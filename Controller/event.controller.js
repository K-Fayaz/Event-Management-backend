const hDate   = require("human-date");
const hTime   = require("hour-convert");
const Event   = require("../Model/eventSchema");


const get_events = async(req,res)=>{
  try{
    let events = await Event.find({});
    console.log(events);
    res.json(events);
  }
  catch(err)
  {
    console.log(err);
    res.send(err);
  }
};


const post_event = async(req,res)=>{
  try{
    let { name , description , venue , date , time , type , phone } = req.body;

    let hour = time.split(":");

    if(parseInt(hour[0]) > 12)
    {
      time = parseInt(hour[0])-12 + ":" + parseInt(hour[1]) + " pm";
    }else{
      time += " am";
    }

    console.log(time);

    let newEvent = new Event;

    newEvent.name        = name;
    newEvent.date        = hDate.prettyPrint(date);
    newEvent.time        = time;
    newEvent.venue       = venue;
    newEvent.eventType   = type;
    newEvent.contactNum  = phone;
    newEvent.description = description;


    await newEvent.save();

    res.status(201).json(newEvent);

  }
  catch(err)
  {
    console.log(err);
    res.status(401).send(err);
  }
};

module.exports = {
  get_events,
  post_event,
}
