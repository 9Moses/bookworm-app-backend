import express from "express";
import { signin, signup } from "../../controller/auth.controller";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Bookworms API is live",
    status: "ok",
    version: "1.0.0",
    timeStamp: new Date().toISOString(),
  });
});
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
