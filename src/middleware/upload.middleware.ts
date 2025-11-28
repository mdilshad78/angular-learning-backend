// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "upload/users");
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         cb(null, Date.now() + ext)
//     }
// });

// export const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// })

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary"; // make sure your Cloudinary config is correct

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "users",
        format: file.mimetype.split("/")[1],
        public_id: `${Date.now()}-${file.originalname}`,
    }),
});

export const upload = multer({ storage });


