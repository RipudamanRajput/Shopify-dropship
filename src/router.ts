import { Router } from 'express';
import { SyncProducts, editProduct, fetchproduct, getTotalCount, getaProduct, getproducts } from './handlers/Product';
import { handleInputErrors } from './module/Middleware/expressValidation';


const router = Router();

/**  for shopify store apis **/
router.get('/fetchproducts', fetchproduct)
router.get('/getproducts', getproducts)
router.get('/getTotalCount', getTotalCount)
router.get('/getaProduct/:id', getaProduct)
router.put('/getaProduct/:id', handleInputErrors, editProduct)
router.put('/SyncProducts/:id', handleInputErrors, SyncProducts)




export default router;