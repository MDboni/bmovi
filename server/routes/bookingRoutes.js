import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js"
import express from 'express'

const bookingRouter = express.Router()


bookingRouter.post('/create',createBooking)
bookingRouter.get('/seats/:showId', getOccupiedSeats )

export default bookingRouter