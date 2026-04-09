const { Router } = require('express');
const { getTasks, createTask, deleteTask, toggleTask, editTask } = require('../controllers/task.controller');

const router = Router();

router.get('/',             getTasks);
router.post('/',            createTask);
router.delete('/:id',       deleteTask);
router.patch('/:id/toggle', toggleTask);
router.patch('/:id',        editTask);

module.exports = router;