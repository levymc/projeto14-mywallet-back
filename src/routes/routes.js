import express from 'express';
import { cadastro } from '../controllers/cadastro.controller.js'
import { login } from '../controllers/login.controller.js';
import { transaction, controllerGetTrans, deleteTransac } from '../controllers/transaction.controller.js';
import { deleteSessao } from '../controllers/deleteSessao.controller.js';
import { validateRegistrationData, validateLoginData, validateTransacValues, validateToken, insertTransacValues, getTransactions, getTotalTransaction } from '../middlewares/middleware.js';


const router = express.Router();

router.post('/cadastro',validateRegistrationData , cadastro);
router.post('/login',validateLoginData , login);
router.post('/transactions', validateTransacValues, validateToken, insertTransacValues, transaction)
router.get('/transactions',validateToken, getTransactions, getTotalTransaction, controllerGetTrans)
router.delete('/transactions', deleteTransac)
router.delete('/sessao', deleteSessao)

export default router;
