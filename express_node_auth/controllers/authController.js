const User=require("../models/User.js");
const jwt=require("jsonwebtoken");


const handleError=(err)=>
{

  let errors={email:"",password:""};

  if(err.message.includes("Incorrect Email"))
  {
    errors.email="Incorrect Email";
    return errors;
  };
  if(err.message.includes("Incorrect password"))
  {
    errors.password="Incorrect password";
    return errors;
  };

  //Duplicate email error
  if(err.code===11000)
  {
    errors.email="This email is already existed";
    return errors;
  }

  //validation error

  if(err.message.includes("user validation failed"))
  {
    Object.values(err.errors).forEach(({properties})=>
    {
      errors[properties.path]=properties.message;
    })
  };
  return errors;

  

}

module.exports.signup_get=(req,res)=>
{
 res.render("signup");
};
module.exports.login_get=(req,res)=>
{
    res.render("login");
};
const maxAge =  24 * 60 * 60;
const createToken=(id)=>
{
  const token=jwt.sign({id},process.env.SECRET,{expiresIn:maxAge});
  return token;

}
module.exports.signup_post=async(req,res)=>
{
    const{email,password}=req.body;
    
    try{
    const user=await User.create({email,password});
    
    const token=createToken(user._id);
    res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge * 1000});
    res.json({user:user});
    
    }
    catch(err){
      const errors=handleError(err)
      console.log(errors)
      res.json({errors:errors});
    }

    
};
module.exports.login_post=async(req,res)=>
{
  const{email,password}=req.body;
  try{
  const user=await User.login(email,password);
  const token=createToken(user._id);
  res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge * 1000});
  res.json({user:user});
  }
  catch(err)
  {
    
    const errors=handleError(err);
    
    res.json({errors:errors});
    
  }
};

module.exports.logout_get=(req,res)=>
{
  res.cookie("jwt","",{maxAge:1 });
  res.redirect("/");
}