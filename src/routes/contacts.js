import express from 'express';
import * as contacts from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(contacts.getAllContacts));
router.post('/', ctrlWrapper(contacts.createContact));
router.get('/:contactId', ctrlWrapper(contacts.getContactById));
router.patch('/:contactId', ctrlWrapper(contacts.updateContact));
router.delete('/:contactId', ctrlWrapper(contacts.deleteContact));

export default router;
