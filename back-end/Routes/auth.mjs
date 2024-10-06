import express from 'express';
import { signupSession, loginSession ,AreIamAuthenticated,logout} from '../db/Controlers/authController.mjs';
import {verification} from  '../db/Controlers/vertactionController.mjs';
const router = express.Router();

router.post('/signup', signupSession);
router.post('/login', loginSession);
router.post('/AreIamAuthenticated', AreIamAuthenticated);
router.post('/logout',logout);
router.post("/verification",verification)
export default router;