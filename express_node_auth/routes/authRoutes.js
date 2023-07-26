const {Router}=require("express");
const{signup_get,signup_post,login_get,login_post,logout_get}=require("../controllers/authController.js");

const router=Router();

router.get("/signup",signup_get);
router.get("/login",login_get);
router.get("/logout",logout_get);
router.post("/signup",signup_post);
router.post("/login",login_post);



module.exports=router;

