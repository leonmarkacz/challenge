import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'typeorm';
import { Stock } from '../src/stock/entities/stock.entity';
import { StockStatusEnum } from '../src/stock/model/stock-status.enum';
import { validate as uuidValidate } from 'uuid';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  const productId = 'test-product-id';
  const stockMockData = [
    {
      productId,
      reservationToken: null,
      status: StockStatusEnum.IN_STOCK,
      id: '980e7eec-c0d7-42c6-aaf2-687d8443d097',
      size: 45,
    },
    {
      productId,
      reservationToken: null,
      status: StockStatusEnum.IN_STOCK,
      id: 'af657eb1-8db3-46f7-b6c5-8fc313dd3457',
      size: 45,
    },
    {
      productId,
      reservationToken: '92279eb5-2b36-4e42-b2ab-909411aede9d',
      status: StockStatusEnum.RESERVED,
      id: 'b3070bb2-d182-4aa7-84e7-da93fa3dcefd',
      size: 45,
    },
    {
      productId,
      reservationToken: '4d62c00a-2606-4698-ad15-ce995203a048',
      status: StockStatusEnum.RESERVED,
      id: '0b8ffcdf-f1c0-4d09-9a3d-021be14e2eda',
      size: 45,
    },
    {
      productId,
      reservationToken: null,
      status: StockStatusEnum.SOLD,
      id: 'fd3341cb-d917-4511-853b-27e81f057bba',
      size: 45,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    if (process.env.NODE_ENV === 'test') {
      connection = app.get(Connection);
      await connection.synchronize(true);
    }
  });

  beforeEach(async () => {
    if (process.env.NODE_ENV === 'test') {
      await connection.dropDatabase();
      await connection.query(
        'create table stock(id uuid default uuid_generate_v4() not null constraint "PK_092bc1fc7d860426a1dec5aa8e9" primary key, status varchar not null, "reservationToken" varchar, "productId" varchar not null, "size" integer not null);',
      );
      await connection.getRepository<Stock>('stock').save(stockMockData);
    }
  });

  afterAll(async () => {
    await Promise.all([await connection.close(), await app.close()]);
  });

  it('/product/{id} (GET)', async (done) => {
    return request(app.getHttpServer())
      .get(`/product/${productId}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ IN_STOCK: 2, RESERVED: 2, SOLD: 1 });
        done();
      });
  });

  it('/product/{id}/stock (PUT)', async (done) => {
    await request(app.getHttpServer())
      .put(`/product/${productId}/stock`)
      .send({ stock: 5 })
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(3);
        return res;
      });

    return await request(app.getHttpServer())
      .get(`/product/${productId}`)
      .then((res) => {
        expect(res.body).toEqual({ IN_STOCK: 5, RESERVED: 2, SOLD: 1 });
        done();
      });
  });

  it('/product/{id}/reserve (POST)', async (done) => {
    await request(app.getHttpServer())
      .post(`/product/${productId}/reserve`)
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('reservationToken');
        expect(uuidValidate(res.body.reservationToken)).toBeTruthy();
        return res;
      });

    return await request(app.getHttpServer())
      .get(`/product/${productId}`)
      .then((res) => {
        expect(res.body).toEqual({ IN_STOCK: 1, RESERVED: 3, SOLD: 1 });
        done();
      });
  });

  it('/product/{id}/unreserve (POST)', async (done) => {
    await request(app.getHttpServer())
      .post(`/product/${productId}/unreserve`)
      .send({ reservationToken: stockMockData[2].reservationToken })
      .expect(200)
      .then((res) => {
        return res;
      });

    return await request(app.getHttpServer())
      .get(`/product/${productId}`)
      .then((res) => {
        expect(res.body).toEqual({ IN_STOCK: 3, RESERVED: 1, SOLD: 1 });
        done();
      });
  });

  it('/product/{id}/sold (POST)', async (done) => {
    await request(app.getHttpServer())
      .post(`/product/${productId}/sold`)
      .send({ reservationToken: stockMockData[2].reservationToken })
      .expect(200)
      .then((res) => {
        return res;
      });

    return await request(app.getHttpServer())
      .get(`/product/${productId}`)
      .then((res) => {
        expect(res.body).toEqual({ IN_STOCK: 2, RESERVED: 1, SOLD: 2 });
        done();
      });
  });
});
