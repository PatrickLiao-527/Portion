import express from 'express';
import path from 'path';
import fs from 'fs';
import Menu from '../models/menuModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/checkRole.js';
import Busboy from 'busboy';
import { fileTypeFromBuffer } from 'file-type';
import { validImageExtensions, validMimeTypes } from '../config.js';
import fetchImageMiddleware from '../middleware/fetchImageMiddleware.js';

const router = express.Router();

const handleFileUpload = async (fileBuffer, menuItemId) => {
  const fileType = await fileTypeFromBuffer(Buffer.concat(fileBuffer));
  if (!fileType || !(fileType.mime in validMimeTypes)) {
    throw new Error('Invalid file type');
  }
  const extension = fileType.ext ? `.${fileType.ext}` : '';
  const saveTo = path.join('uploads', menuItemId + extension);
  fs.writeFileSync(saveTo, Buffer.concat(fileBuffer));
  return extension;
};

const handleBusboy = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  const formData = {};
  const fileBuffer = [];
  let fileFieldName = '';

  busboy.on('field', (fieldname, val) => {
    formData[fieldname] = val;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    fileFieldName = fieldname;
    file.on('data', (data) => {
      fileBuffer.push(data);
    });
  });

  busboy.on('finish', async () => {
    req.formData = formData;
    req.fileBuffer = fileBuffer;
    req.fileFieldName = fileFieldName;
    next();
  });

  req.pipe(busboy);
};

router.post('/', authMiddleware, checkRole('owner'), handleBusboy, async (req, res) => {
  try {
    const { formData, fileBuffer } = req;

    const schemaPaths = Menu.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
      col_name => col_name !== '_id' && col_name !== '__v' && col_name !== 'ownerId' && schemaPaths[col_name].isRequired
    );

    for (const col_name of columnNames) {
      if (!Object.prototype.hasOwnProperty.call(formData, col_name)) {
        return res.status(400).json({
          message: `Error: Send all required fields, missing ${col_name}`
        });
      }
    }

    const newMenuItem = {
      ...formData,
      ownerId: req.user._id
    };

    const menuItem = await Menu.create(newMenuItem);

    if (fileBuffer.length > 0) {
      const extension = await handleFileUpload(fileBuffer, menuItem._id.toString());
      menuItem.itemPicture = `${menuItem._id}${extension}`;
      await menuItem.save();
    }

    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, checkRole('owner'), handleBusboy, async (req, res) => {
  try {
    const { id } = req.params;
    const { formData, fileBuffer } = req;

    const menuItem = await Menu.findById(id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    if (menuItem.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to update this menu item' });

    Object.assign(menuItem, formData);

    if (fileBuffer.length > 0) {
      const extension = await handleFileUpload(fileBuffer, id);
      menuItem.itemPicture = `${id}${extension}`;
    }

    const updatedMenuItem = await menuItem.save();
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const menuItems = await Menu.find({ ownerId: req.user._id });

    const menuItemsWithImages = menuItems.map(menuItem => {
      const extension = validImageExtensions.find(ext => fs.existsSync(path.join('uploads', `${menuItem._id}.${ext}`)));
      const imageBase64 = extension ? getImageBase64(menuItem._id, `.${extension}`) : null;
      return {
        ...menuItem.toObject(),
        image: imageBase64,
        imageExtension: extension
      };
    });

    return res.status(200).json({ length: menuItemsWithImages.length, data: menuItemsWithImages });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

const getImageBase64 = (id, extension) => {
  const filePath = path.join('uploads', `${id}${extension}`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'base64');
  }
  return null;
};

router.get('/image/:_id', fetchImageMiddleware('uploads'), (req, res) => {
  if (req.imageBase64 && req.imageExtension) {
    console.log(`Image fetched for menu item: ${req.imagePath}`);
    res.status(200).json({
      image: req.imageBase64,
      extension: req.imageExtension,
    });
  } else {
    console.log(`Image not found for menu item: ${req.params._id}`);
    res.status(404).json({ message: 'Image not found' });
  }
});

export default router;
