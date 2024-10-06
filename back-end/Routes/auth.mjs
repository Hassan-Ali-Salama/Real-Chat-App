import express from 'express';
import { signupSession, loginSession ,AreIamAuthenticated,logout} from '../db/Controlers/authController.mjs';

const router = express.Router();

router.post('/signup', signupSession);
router.post('/login', loginSession);
router.post('/AreIamAuthenticated', AreIamAuthenticated);
router.post('/logout',logout);
export default router;