const express = require("express");

const profileController = require("../controllers/profile");

const router = express.Router();

// /profile/add => POST
router.post("/add", profileController.postAddProfile);

// /profile/all => GET
router.get("/all", profileController.getProfiles);

// /profile/details => GET
router.get("/details/:username", profileController.getProfileDetailsById);

// /profile/update => PUT
router.put("/update/:id", profileController.updateProfileDetailsById);

// /profile/delete => DELETE
router.delete("/delete/:id", profileController.deleteProfileById);

module.exports = router;
