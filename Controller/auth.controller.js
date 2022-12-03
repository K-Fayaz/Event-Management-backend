const bcrypt      = require("bcryptjs");
const MINT_SECRET = process.env.MINT_SECRET;
const jwt         = require("jsonwebtoken");
const sendgrid    = require('@sendgrid/mail');
const User        = require("../Model/userSchema");
const sendEmail   = require("../helpers/sendEmail");


// set sendgrid api
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const confirm_email = async(req,res)=>{
  try {

    let { email } = req.body;
    console.log(email);

    // checl if the user already exists with the email
    const user = await User.findOne({ email: email });
    console.log(user);
    if(user)
    {
      throw "User already exists";
    }

    const resp = await sendEmail(email);
    console.log(resp);

    req.session.email = email;

    res.status(200).json({
      message:"Email has been sent!"
    });

  } catch (e) {
    console.log(e);
    res.status(400).json({
      message:"User Already exists",
    })
  }
}

const get_confirmation_cookie = async(req,res)=>{
  try{
    let email_session = req.session.email;
    console.log(email_session);


    if(email_session)
    {
      res.json({
        email_session,
        isConfirmed: true
      })
    }else{
      res.json({
        isConfirmed: false,
      })
    }

  }
  catch(err)
  {
    console.log(err);
    res.status(400).json({
      message: "something went wrong!",
    })
  }
}


const register_user = async(req,res)=>{
  try {

    let { user , email , password } = req.body;
    console.log(req.body);

    // check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if(existingUser)
    {
      throw "User already exists";
    }

    let hashedPassword = await bcrypt.hash(password,8);
    console.log(hashedPassword);


    let newUser = new User;
    newUser.username = user;
    newUser.email = email;
    newUser.password = hashedPassword;

    await newUser.save();

    console.log(newUser);

    let payload = {
      id: newUser.id,
      email: newUser.email
    };

    let token = await jwt.sign(payload,MINT_SECRET,{
      expiresIn:'1d',
    });
    console.log(token);

    // create a session with token and session with user details
    req.session.curr_user = newUser;
    req.session.curr_user_token = token;

    // delete the previous session
    req.session.email = null;

    res.status(200).json({
      user: newUser,
      token: token
    });

  } catch (e) {
    console.log(e);
    res.status(400).send("something went wrong!");
  }
}


module.exports = {
  confirm_email,
  register_user,
  get_confirmation_cookie,
}
