import express from 'express';
import path from 'path';
import fs from 'fs';
import Menu from '../models/menuModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/checkRole.js';
import Busboy from 'busboy';
import { fileTypeFromBuffer } from 'file-type';
import { validImageExtensions, validMimeTypes } from '../config.js';
import { broadcast } from '../websocket.js';

const router = express.Router();

const handleFileUpload = async (fileBuffer, menuItemId) => {
  const fileType = await fileTypeFromBuffer(Buffer.concat(fileBuffer));
  if (!fileType || !fileType.mime in validMimeTypes) {
    throw new Error('Invalid file type');
  }
  if (!validImageExtensions.includes(fileType.ext)) {
    throw new Error('Invalid file extension');
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

const getImageBase64 = (menuItemId, extension) => {
  const filePath = path.join('uploads', `${menuItemId}${extension}`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'base64');
  }
  return null;
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
      await handleFileUpload(fileBuffer, menuItem._id.toString());
      // menuItem.itemPicture = `${menuItem._id}${extension}`;
      await menuItem.save();
    }
    // Broadcast the new menu item to all connected clients
    broadcast({ type: 'ITEM_ADDED', item: menuItem });
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
      await handleFileUpload(fileBuffer, id);
      menuItem.itemPicture = `${id}${extension}`;
    }

    const updatedMenuItem = await menuItem.save();

    // Broadcast the updated menu item to all connected clients
    broadcast({ type: 'ITEM_UPDATED', item: updatedMenuItem });

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all menu items with images
// res.body.image is base64 encoded image
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

router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const menuItems = await Menu.find({ ownerId: restaurantId });
    res.status(200).json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    if (menuItem.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to view this menu item' });

    const imagePath = path.join('uploads', `${id}${path.extname(menuItem.itemPicture)}`);
    if (fs.existsSync(imagePath)) {
      menuItem.imageData = fs.readFileSync(imagePath, 'base64');
    }
    res.status(200).json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, checkRole('owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    if (menuItem.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to delete this menu item' });

    const imagePath = path.join('uploads', `${id}${path.extname(menuItem.itemPicture)}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Broadcast the deletion to all connected clients
    broadcast({ type: 'ITEM_DELETED', itemId: id });

    await Menu.deleteOne({ _id: id });
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
