const router = require("express").Router();
const Challenge_utils = require("./Challengeutils.js");



router.post("/", async (req, res) => {

  const BlackList = ["require", "import", "express", "sequelize"]

  try {
    const { code } = req.body;
    const forbid = null
    const stringedcode = JSON.stringify(code)
    BlackList.forEach((name)=> stringedcode.includes(name) ? forbid = true : null)
    if(forbid){
      return res.status(200).send({msg: "Test cant be runned", error: "Forbidden keywords used"})
    }
    try {
      const tested = eval(code);
      const tested2 = (new Function(`return ${code}`)())
      res.status(200).send({ tested2, tested });
    } catch (e) {
      res.status(200).send({ error: "Non iterable function", e });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "There's a problem with your code", e });
  }
});

module.exports = router;
