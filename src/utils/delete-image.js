require("dotenv").config();
const { cloudinary } = require("../configs/upload-config");
async function deleteFileImageCloudinary(path) {
  try {
    const publib_id = `${process.env.CLOUD_FOLDER_NAME}/${
      path.split("/").pop().split(".")[0]
    }`;
    await cloudinary.uploader.destroy(publib_id);
  } catch (error) {}
}

module.exports = {
  deleteFileImageCloudinary,
};
