import express from 'express';
import * as contacts from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(contacts.getAll));
router.post('/', ctrlWrapper(contacts.create));
router.get('/:contactId', ctrlWrapper(contacts.getById));
router.patch('/:contactId', ctrlWrapper(contacts.patch));
router.delete('/:contactId', ctrlWrapper(contacts.remove));

export default router;
