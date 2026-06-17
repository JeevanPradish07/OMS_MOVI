import { Router } from 'express';
import { getReportTypes, runReport, exportReport } from '../../controllers/admin/reports.controller.js';
import { protect } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';

const router = Router();
router.use(protect);

router.get('/',          requirePermission('Reports', 'read'),   getReportTypes);
router.post('/run',      requirePermission('Reports', 'read'),   runReport);
router.get('/:type/export', requirePermission('Reports', 'read'), exportReport);

export default router;
