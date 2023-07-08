import express from 'express';
import { cadastro } from '../controllers/cadastro.controller.js'
import { login } from '../controllers/login.controller.js';
import { entrada } from '../controllers/entrada.controller.js';
import { validateRegistrationData, validateLoginData } from '../middlewares/middleware.js';


const router = express.Router();

router.post('/cadastro',validateRegistrationData , cadastro);
router.post('/login',validateLoginData , login);
router.post('/entrada', entrada)

export default router;
