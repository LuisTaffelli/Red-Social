const router = require("express").Router();
const Challenge_utils = require("./Challengeutils.js");
const {Sandbox} = require("../controllers/Sandbox.js")


router.post("/", async (req, res, next) => {

  const BlackList = ["require", "import", "express", "sequelize"]

  try {
    const { code } = req.body;
    const forbid = null
    BlackList.forEach((name)=> code.includes(name) ? forbid = true : null)
    if(forbid){
      return res.status(200).send({msg: "Test cant be runned", error: "Forbidden keywords used"})
    }
    try {
      Sandbox(code)
      .then((data)=>{
        return res.status(200).send({ data });
      })
      .catch((err)=> new Error(err))
    } catch (e) {
      res.status(200).send({ error: "Non iterable function", err_msg:e.toString() });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "There's a problem with your code", e });
  }
});

module.exports = router;
