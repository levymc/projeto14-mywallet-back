import express from 'express';
import { cadastrarParticipante } from './controllers/participanteController.js';

const router = express.Router();

router.post('/cadastro', cadastrarParticipante);

export default router;
