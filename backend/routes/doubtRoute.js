import express from 'express';
const router = express.Router();
import doubtController from '../controllers/doubtController.js';
import sessionCheckMiddleware from "../middlewares/sessioncheck.js";
router.use(sessionCheckMiddleware);


router.get('/', doubtController.showDoubtsPrompt);
router.post('/', doubtController.fetchSummary);
router.get('/:doubt_id',doubtController.showSavedDoubtSummary);


export default router;
