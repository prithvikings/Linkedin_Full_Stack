import multer from "multer";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public"); // folder where files are saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // avoid filename collisions
  },
});

const upload = multer({ storage });

export default upload;
