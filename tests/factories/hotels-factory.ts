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

export function createRooms(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.firstName(),
      capacity: faker.datatype.number({ max: 10 }),
      hotelId,
    },
  });
}
