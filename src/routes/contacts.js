import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema} from "../validation/contacts.js";
import { getContactsController, getContactByIdController, addContactController, updateContactController, deleteContactController} from "../controllers/contacts.js";

const router = express.Router();
router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));
router.post("/", validateBody(createContactSchema), ctrlWrapper(addContactController));
router.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete("/:contactId", isValidId,ctrlWrapper(deleteContactController));

export default router;
