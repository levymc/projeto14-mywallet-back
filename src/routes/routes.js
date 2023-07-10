import express from 'express';
import { cadastro } from '../controllers/cadastro.controller.js'
import { login } from '../controllers/login.controller.js';
import { transaction, controllerGetTrans } from '../controllers/transaction.controller.js';
import { validateRegistrationData, validateLoginData, validateTransacValues, validateToken, insertTransacValues, getTransactions } from '../middlewares/middleware.js';


const router = express.Router();

router.post('/cadastro',validateRegistrationData , cadastro);
router.post('/login',validateLoginData , login);
router.post('/transactions', validateTransacValues, validateToken, insertTransacValues, transaction)
router.get('/transactions',validateToken, getTransactions, controllerGetTrans)

export default router;
