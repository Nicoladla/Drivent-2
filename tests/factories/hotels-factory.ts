import { prisma } from '@/config';
import faker from '@faker-js/faker';

export function createHotels() {
  return prisma.hotel.create({
    data: {
      name: faker.name.firstName(),
      image: 'https://www.HotelFoda',
    },
  });
}
