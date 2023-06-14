import express from 'express'
import { getGeoLocation } from '../middleware/location.js'
import { logger } from './controller.js'
const router = express.Router()

router.post('/log', getGeoLocation, logger)


export default router