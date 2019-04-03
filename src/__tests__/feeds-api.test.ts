import { sample } from 'lodash';
import request from 'supertest';
import log from '../lib/log';
import Feed from '../models/feed';
import { server } from './api-helper';

let sampleUser: any = {
  email: 'feed@sample.com',
  password: 'thisiswoodongdang',
  name: '산책왕',
  // token: string
};

let sampleDog: any = {
  name: sample(['단비', '설이', '일구', '팔육', '초롱이']),
  breed: '푸들',
  gender: 'M',
  // _id: Schema.Types.ObjectId
  // user: Schema.Types.ObjectId
};

let sampleFeed: any = {
  pins: '[{latitude:127.00,longitude:36.0}]',
  seconds: Math.floor(Math.random() * 180),
  distance: Math.random() * 3,
  steps: Math.floor(Math.random() * 5000),
  pees: Math.floor(Math.random() * 10),
  poos: Math.floor(Math.random() * 10),
  memo: '여기 자주 갈 것 같아요~',
  images: [
    'https://picsum.photos/800/800/?random',
    'https://picsum.photos/800/800/?random',
  ],
};

beforeAll(async () => {
  if (await Feed.collection.drop()) {
    log.info('Dropped Feed Collection', { scope: 'mongoose' });
  }
});

describe('POST /feeds', () => {
  it('should create sample user', async () => {
    const res = await request(server.getInstance())
      .post('/signup')
      .send(sampleUser);
    expect(res.body).toEqual(
      expect.objectContaining({
        email: sampleUser.email,
        name: sampleUser.name,
      })
    );
    expect(res.status).toBe(201);
    sampleUser = res.body;
  });

  it('should add dog successfully', async () => {
    const resDog = await request(server.getInstance())
      .post('/dogs')
      .set('authorization', sampleUser.token)
      .send(sampleDog);
    expect(resDog.body).toEqual(expect.objectContaining(sampleDog));
    expect(resDog.status).toBe(201);
    sampleDog = resDog.body;

    // Check User
    const res = await request(server.getInstance())
      .get('/user')
      .set('authorization', sampleUser.token);
    expect(res.body.dogs[Object.keys(res.body.dogs)[0]]).toEqual(
      expect.objectContaining({ name: sampleDog.name, default: true })
    );
    expect(res.status).toBe(200);
    sampleUser = res.body;
  });

  it('should create sample feed', async () => {
    const res = await request(server.getInstance())
      .post('/feeds')
      .set('authorization', sampleUser.token)
      .send(sampleFeed);
    expect(res.body).toEqual(
      expect.objectContaining({
        ...sampleFeed,
        user: sampleUser._id,
        dog: sampleDog._id,
      })
    );
    expect(res.status).toBe(201);
    sampleFeed = res.body;
  });
});