const Projects = require("../model/Projects");
const { cloudinary } = require("../utils/cloudinary");
const { uploadProfile } = require("../utils/upload");
const fs = require("fs/promises");
const path = require("path");

exports.addProject = async (req, res) => {
  // console.log(req);
  // all input not valid will be show error
  try {
    // if (!req.body.name || !req.body.desc || !req.body.hero || !req.file) {
    //   return res.status(500).json({ message: "Fill all the information " });
    // }
    uploadProfile(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: err.message || "Unable to upload image" });
      }

      let imageUrl = "";
      if (req.file && req.file.path) {
        imageUrl = req.file.path; // Cloudinary gives the uploaded image URL here
      }

      await Projects.create({
        ...req.body,
        hero: imageUrl, // Save the Cloudinary URL instead of filename
      });

      res.status(201).json({ message: "Project Added Successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

exports.getProject = async (req, res) => {
  try {
    const result = await Projects.find();
    res.status(200).json({ message: "Project Get Success", result });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something is Wrong" });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Projects.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "Project Update Success" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something is Wrong" });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Projects.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.hero) {
      const imageUrl = project.hero; // example: https://res.cloudinary.com/<cloud>/image/upload/v1620000000/projects/abcxyz.jpg

      // 1) parse pathname from the URL
      try {
        const urlObj = new URL(imageUrl);
        // pathname: "/<account>/image/upload/v1620000000/projects/abcxyz.jpg"
        let pathname = urlObj.pathname;

        // 2) remove leading slash and everything before "upload/"
        // find 'upload' segment index, then take everything after it
        const parts = pathname.split("/");
        const uploadIndex = parts.findIndex((p) => p === "upload");
        if (uploadIndex === -1) {
          throw new Error("Cannot find 'upload' in Cloudinary URL");
        }

        // join everything after 'upload'
        let publicIdWithMaybeVersion = parts.slice(uploadIndex + 1).join("/"); // e.g. "v1620000000/projects/abcxyz.jpg" or "projects/abcxyz.jpg"

        // 3) remove version if present (v123456789/)
        publicIdWithMaybeVersion = publicIdWithMaybeVersion.replace(
          /^v\d+\//,
          ""
        ); // e.g. "projects/abcxyz.jpg"

        // 4) remove extension
        const publicId = publicIdWithMaybeVersion.replace(/\.[^/.]+$/, ""); // e.g. "projects/abcxyz"

        // 5) call destroy with invalidate:true to purge CDN cache
        const destroyRes = await cloudinary.uploader.destroy(publicId, {
          invalidate: true,
          resource_type: "image",
        });

        // log the response for debugging
        console.log("cloudinary destroy response:", destroyRes);

        // check result
        if (destroyRes.result !== "ok" && destroyRes.result !== "not found") {
          // not ok — but continue to delete DB or return an error if you prefer
          console.warn("Cloudinary destroy result:", destroyRes);
        }
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err.message);
        // optionally continue to delete DB entry, or respond with error
        // return res.status(500).json({ message: "Failed to delete image from Cloudinary", error: err.message });
      }
    }

    await Projects.findByIdAndDelete(id);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Something went wrong while deleting project",
    });
  }
};
