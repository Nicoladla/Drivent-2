import { getHotels, getRoomsByHotel } from '@/controllers';
import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter
    .all("/*")
    .get("/", getHotels)
    .get("/:hotelId", getRoomsByHotel)

export { hotelsRouter };
