import { prisma } from '@/config';

async function fetchHotels() {
  const hotels = await prisma.hotel.findMany();

  return hotels;
}

const hotelsRepository = { fetchHotels };

export default hotelsRepository;
