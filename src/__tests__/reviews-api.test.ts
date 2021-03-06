import { pick } from 'lodash';
import request from 'supertest';
import { server } from './api-helper';
import { generatePlace } from './places-api.test';
// tslint:disable:max-line-length

let sampleUser: any = {
  email: 'review@sample.com',
  password: 'thisiswoodongdang',
  name: '리뷰왕',
  // token: string
};

let samplePlace: any = generatePlace();

let sampleReview: any = {
  rating: Math.round(Math.random() * 5),
};

describe('POST /reviews', () => {
  it('should get token from User', async () => {
    const res = await request(server.getInstance())
      .post('/signup')
      .send(sampleUser);
    expect(res.status).toBe(201);
    sampleUser = res.body;
  });

  it('should create random place', async () => {
    const res = await request(server.getInstance())
      .post('/places')
      .send(samplePlace);
    expect(res.body).toEqual(expect.objectContaining(samplePlace));
    expect(res.status).toBe(201);
    samplePlace = res.body;
    sampleReview.place = samplePlace._id;
  });

  it('should create review', async () => {
    const res = await request(server.getInstance())
      .post('/reviews')
      .set('authorization', sampleUser.token)
      .send(sampleReview);
    expect(res.body).toEqual(
      expect.objectContaining(pick(sampleReview, ['rating', 'place']))
    );
    expect(res.status).toBe(201);
    sampleReview = res.body;
  });

  it('should get right rating', async () => {
    const res = await request(server.getInstance()).get(
      `/places/${samplePlace._id}`
    );
    expect(res.body).toEqual(
      expect.objectContaining({ rating: sampleReview.rating })
    );
    samplePlace = res.body;
  });
});

describe('GET /reviews', () => {
  it('should get reviews by place', async () => {
    const place = samplePlace._id;
    const res = await request(server.getInstance())
      .get('/reviews')
      .query({ place });
    res.body.forEach((data: any) => {
      expect(data).toEqual(expect.objectContaining({ place }));
    });
    expect(res.status).toBe(200);
  });

  it('should get reviews by user', async () => {
    const user = sampleUser._id;
    const res = await request(server.getInstance())
      .get('/reviews')
      .query({ user });
    res.body.forEach((data: any) => {
      expect(data.user._id).toBe(user);
    });
    expect(res.status).toBe(200);
  });
});
