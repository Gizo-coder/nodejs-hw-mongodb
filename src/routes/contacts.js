import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema,} from '../validation/contacts.js';
import { getContactsController, getContactByIdController, addContactController, updateContactController, deleteContactController,} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();


router.get('/', authenticate, ctrlWrapper(getContactsController));
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactByIdController));
router.post('/', authenticate, upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(addContactController));
router.patch('/:contactId', authenticate, isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContactController));

export default router;
