import { v4 as uuid } from 'uuid';

export default [
  {
    id: uuid(),
    name: 'image.jpg',
    type: 'image/jpeg',
    size: 132,
    tags: ['banana', 'apple'],
    createdAt: '2011-10-05T14:48:00.000Z',
    owner: {
      username: 'root',
    },
    views: 300,
    visibility: 'Private',
  },
  {
    id: uuid(),
    name: 'image.jpg',
    type: 'image/jpeg',
    size: 135862,
    tags: ['banana', 'apple'],
    createdAt: '2011-10-05T14:48:00.000Z',
    owner: {
      username: 'root',
    },
    views: 212,
    visibility: 'Private',
  },
  {
    id: uuid(),
    name: 'scheda-parte-superiore-fitprime.pdf',
    type: 'image/jpeg',
    size: 1320000000000,
    tags: ['banana', 'apple'],
    createdAt: '2011-10-05T14:48:00.000Z',
    owner: {
      username: 'root',
    },
    views: 424,
    visibility: 'Public',
  },
];
