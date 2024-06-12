import express from 'express';
import path from 'path';
import fs from 'fs';
import Menu from '../models/menuModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/checkRole.js';
import Busboy from 'busboy';
import { fileTypeFromBuffer } from 'file-type';
import { validImageExtensions, validMimeTypes } from '../config.js';

const router = express.Router();

router.post('/', authMiddleware, checkRole('owner'), async (req, res) => {
  try {
    const busboy = Busboy({ headers: req.headers });
    let formData = {};
    let fileBuffer = [];
    let extension = '';
    // let fileMimeType = '';
    let detectedMimeType = '';

    busboy.on('field', (fieldname, val) => {
      formData[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      file.on('data', (data) => {
        fileBuffer.push(data);
      });

      file.on('end', async () => {
        // console.log(`File [${fieldname}] Finished`);
        const completeFileBuffer = Buffer.concat(fileBuffer);
        const fileType = await fileTypeFromBuffer(completeFileBuffer);
        if (fileType) {
          detectedMimeType = fileType.mime;
          extension = fileType.ext ? `.${fileType.ext}` : '';
          console.log(`Detected file type: ${detectedMimeType}, extension: ${extension}`);
        } else {
          console.error('Unable to detect file type');
          return res.status(400).json({ message: 'Invalid file type' });
        }
      });
    });

    busboy.on('finish', async () => {
      // console.log('Received fields:', formData);
      // console.log('Received file:', fileName);

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
      // console.log(JSON.stringify(newMenuItem));  // debug

      const menuItem = await Menu.create(newMenuItem);  // save to db except image

      const completeFileBuffer = Buffer.concat(fileBuffer);
      // console.log(`Complete File Buffer: ${completeFileBuffer.length} bytes`);
      
      const saveTo = path.join('uploads', menuItem._id + extension);
      fs.writeFile(saveTo, completeFileBuffer, (err) => {
        if (err) {
          console.error('Error saving file:', err);
          return res.status(500).json({ message: 'Error saving item image' });
        }
        res.status(201).json(menuItem);  // Move this inside the writeFile callback to ensure response is sent after file is saved
      });
    });

    req.pipe(busboy);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all menu items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const menuItems = await Menu.find({ ownerId: req.user._id });
    return res.status(200).json({ length: menuItems.length, data: menuItems });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get menu item by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    if (menuItem.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to view this menu item' });
    return res.status(200).json({ data: menuItem });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
});

// Update menu item by ID
router.put('/:id', authMiddleware, checkRole('owner'), async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const updateData = {};
  let menuItemId = req.params.id;

  busboy.on('field', (fieldname, val) => {
    updateData[fieldname] = val;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const saveTo = path.join('uploads', menuItemId + path.extname(filename));
    const writeStream = fs.createWriteStream(saveTo);
    file.pipe(writeStream);
    writeStream.on('close', async () => {
      try {
        await Menu.findByIdAndUpdate(menuItemId, { itemPicture: menuItemId + path.extname(filename) });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
  });

  busboy.on('finish', async () => {
    try {
      const menuItem = await Menu.findById(menuItemId);
      if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
      if (menuItem.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to update this menu item' });
      Object.assign(menuItem, updateData);
      const updatedMenuItem = await menuItem.save();
      res.status(200).json(updatedMenuItem);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  req.pipe(busboy);
});

// Delete menu item by ID
router.delete('/:id', authMiddleware, checkRole('owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    if (menuItem.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    await Menu.deleteOne({ _id: id });
    return res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
