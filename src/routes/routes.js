import express from 'express';
import { cadastro } from '../controllers/cadastro.controller.js'
import { login } from '../controllers/login.controller.js';
import { transaction } from '../controllers/transaction.controller.js';
import { validateRegistrationData, validateLoginData, validateTransacValues, validateToken, insertTransacValues } from '../middlewares/middleware.js';


const router = express.Router();

router.post('/cadastro',validateRegistrationData , cadastro);
router.post('/login',validateLoginData , login);
router.post('/entrada', validateTransacValues, validateToken, insertTransacValues, transaction)
router.post('/saida', validateTransacValues, validateToken, insertTransacValues, transaction)

export default router;
