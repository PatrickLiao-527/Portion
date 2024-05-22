import express from 'express';
import Transaction from '../models/transactionModel.js';

const router = express.Router();

// Create a new transaction
router.post('/', async (req, res) => {
    try {
        // Check required fields
        const schemaPaths = Transaction.schema.paths;
        const columnNames = Object.keys(schemaPaths).filter(
            col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
        );

        for (const col_name of columnNames) {
            if (!req.body.hasOwnProperty(col_name)) {
                return res.status(400).json({
                    message: `Error: Send all required fields, missing ${col_name}`
                });
            }
        }
        
        // Create and add to database
        const newTransaction = { ...req.body };
        const transaction = await Transaction.create(newTransaction);
        
        return res.status(201).json(transaction);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        return res.status(200).json({
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const queryTransaction = await Transaction.findById(id);
        if (!queryTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(200).json({
            data: queryTransaction
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update transaction by ID
router.put('/:id', async (req, res) => {
    try {
        // Check required fields
        const schemaPaths = Transaction.schema.paths;
        const columnNames = Object.keys(schemaPaths).filter(
            col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
        );

        for (const col_name of columnNames) {
            if (!req.body.hasOwnProperty(col_name)) {
                return res.status(400).json({
                    message: `Error: Send all required fields, missing ${col_name}`
                });
            }
        }

        const { id } = req.params;
        const result = await Transaction.findByIdAndUpdate(id, req.body, { new: true });

        if (!result) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        return res.status(200).json(result);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Delete transaction by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Transaction.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;
