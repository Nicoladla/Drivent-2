import { prisma } from '@/config';

async function fetchHotels() {
  const hotels = await prisma.hotel.findMany();

  return hotels;
}

async function fetchHotelWithRooms(hotelId: number) {
  const hotelWithRooms = await prisma.hotel.findFirst({
    where: { id: hotelId },
    include: { Rooms: true },
  });

  return hotelWithRooms;
}

const hotelsRepository = { fetchHotels, fetchHotelWithRooms };

export default hotelsRepository;
