import hotelsService from '@/services/hotels-service';
import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const hotels = await hotelsService.fetchHotels();

  res.status(200).send(hotels);
}

export async function getRoomsByHotel() {}
