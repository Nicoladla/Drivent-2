import hotelsRepository from '@/repositories/hotels-repository';

async function fetchHotels() {
  const hotels = await hotelsRepository.fetchHotels();

  return hotels;
}

const hotelsService = {fetchHotels};

export default hotelsService;
