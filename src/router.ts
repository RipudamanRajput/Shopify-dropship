import { Router } from 'express';
import { SyncProducts, editProduct, fetchproduct, getTotalCount, getaProduct, getproducts } from './handlers/Maketplace /shopify';
import { handleInputErrors } from './module/Middleware/expressValidation';
import { Confidsetup, Configupdate } from './handlers/Configsetup';
import { ConfigEtsy } from './handlers/Maketplace /Etsy';


const router = Router();

/**  for shopify store apis **/
router.get('/fetchproducts', fetchproduct)
router.get('/getproducts', getproducts)
router.get('/getTotalCount', getTotalCount)
router.get('/getaProduct/:id', getaProduct)
router.put('/updateaProduct/:id', handleInputErrors, editProduct)
router.put('/SyncProducts/:id', handleInputErrors, SyncProducts)

/**  for creating config  **/
router.get('/getConfig', (req, res) => { })
router.post('/setConfig', Confidsetup)
router.put('/updateConfig/:id', Configupdate)

/** for etsy marketplace config  **/
router.get('/ping', ConfigEtsy)

/**  router for BigCommerce  **/
router.get('/bigcommerce/fetchproducts', (req, res) => { })
router.get('/bigcommerce/getproducts', (req, res) => { })
router.get('/bigcommerce/getaProduct/:id', (req, res) => { })
router.put('/bigcommerce/updateaProduct/:id', (req, res) => { })
router.put('/bigcommerce/SyncProducts/:id', (req, res) => { })


export default router;