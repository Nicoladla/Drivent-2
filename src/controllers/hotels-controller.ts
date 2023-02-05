import hotelsService from '@/services/hotels-service';
import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const userId: number = req.userId;

  try {
    await hotelsService.checkIfEnrollmentAndTicketAreValid(userId);

    const hotels = await hotelsService.fetchHotels();

    res.status(200).send(hotels);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(httpStatus.NOT_FOUND).send(err.message);
    }

    if (err.name === 'paymentRequired') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

export async function getRoomsByHotel(req: AuthenticatedRequest, res: Response) {
  const userId: number = req.userId;
  const hotelId = Number(req.params.hotelId);

  if (isNaN(hotelId)) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    await hotelsService.checkIfEnrollmentAndTicketAreValid(userId);

    const hotelWithRooms = await hotelsService.fetchHotelWithRooms(hotelId);

    res.status(200).send(hotelWithRooms);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(httpStatus.NOT_FOUND).send(err.message);
    }

    if (err.name === 'paymentRequired') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}
