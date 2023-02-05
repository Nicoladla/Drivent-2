import hotelsRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError } from '@/errors';

async function checkIfEnrollmentAndTicketAreValid(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID') throw { name: 'paymentRequired' };
  if (!ticket.TicketType.includesHotel) throw { name: 'paymentRequired' };
}

async function fetchHotels() {
  const hotels = await hotelsRepository.fetchHotels();

  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function fetchHotelWithRooms(hotelId: number) {
  const hotelWithRooms = await hotelsRepository.fetchHotelWithRooms(hotelId);

  if (!hotelWithRooms) throw notFoundError();

  return hotelWithRooms;
}

const hotelsService = {
  fetchHotels,
  checkIfEnrollmentAndTicketAreValid,
  fetchHotelWithRooms,
};

export default hotelsService;
