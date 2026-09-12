import express from 'express';
import {
  getSavedListings,
  saveListing,
  removeSavedListing
} from '../controllers/savedController.js';

const router = express.Router();

router.get('/', getSavedListings);
router.post('/', saveListing);
router.delete('/:id', removeSavedListing);

export default router;