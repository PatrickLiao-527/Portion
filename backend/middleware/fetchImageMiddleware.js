import fs from 'fs';
import path from 'path';
import { validImageExtensions } from '../config.js';

const fetchImageMiddleware = (uploadDir) => {
  return (req, res, next) => {
    const { _id } = req.params;
    const filePath = path.join(uploadDir, `${_id}`);

    const extension = validImageExtensions.find(ext => fs.existsSync(`${filePath}.${ext}`));
    if (extension) {
      req.imagePath = `${filePath}.${extension}`;
      req.imageBase64 = fs.readFileSync(req.imagePath, 'base64');
      req.imageExtension = extension;
      next();
    } else {
      req.imagePath = null;
      next();
    }
  };
};

export default fetchImageMiddleware;
