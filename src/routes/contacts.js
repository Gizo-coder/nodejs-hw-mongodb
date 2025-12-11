import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema} from "../validation/contacts.js";
import { getContactsController, getContactByIdController, addContactController, updateContactController, deleteContactController} from "../controllers/contacts.js";

const router = express.Router();

// GET /contacts  (pagination + sorting + filtering)
router.get("/", ctrlWrapper(getContactsController));

// GET /contacts/:contactId
router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

// POST /contacts
router.post("/", validateBody(createContactSchema), ctrlWrapper(addContactController));

// PATCH /contacts/:contactId
router.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

// DELETE /contacts/:contactId
router.delete("/:contactId", isValidId,ctrlWrapper(deleteContactController));

export default router;
