const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Contact = require('../models/Contact');

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private
router.get('/', protect, async (req, res) => {
    let query = { user_id: req.user.id };

    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        query.$or = [
            { name: searchRegex },
            { email: searchRegex }
        ];
    }

    try {
        const contacts = await Contact.find(query).sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Set contact
// @route   POST /api/contacts
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, phone, email, company, tags, notes, isFavorite } = req.body;

    if (!name || !phone || !email) {
        return res.status(400).json({ message: 'Please add name, phone and email' });
    }

    try {
        const contact = await Contact.create({
            user_id: req.user.id,
            name,
            phone,
            email,
            company,
            tags,
            notes,
            isFavorite
        });

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        // Check for user
        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }

        // Make sure the logged in user matches the contact user
        if (contact.user_id.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        // Check for user
        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }

        // Make sure the logged in user matches the contact user
        if (contact.user_id.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await contact.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
