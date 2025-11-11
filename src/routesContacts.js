import express from 'express';
import {
    getAllContactsController,
    getContactByIdController
} from '../src/controllersContacts.js';

const router = express.Router();

router.get('/', getAllContactsController);
router.get('/:contactId', getContactByIdController);

export default router;
