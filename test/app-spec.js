'use strict';
let supertest = require('supertest');
let should = require('should');
let express = require('express');
let app = require('../app');

describe('Kiwi FarmJS root route', () => {
  it('should return root route without 404', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });
});

describe('Kiwi FarmJS API Tests', () => {
  it('should return home page', (done) => {
    supertest(app)
      .get('/api/v1')
      .expect(200, done);
  });
});

describe('PUT /api/v1/fetch/courseserials', () => {
  it('should store new data form sharecourse to memcachier whit 201', function(done) {
    this.timeout(40000);
    supertest(app)
      .put('/api/v1/fetch/courseserials')
      .expect(201, done);
  });
});

describe('GET /api/v1/couseserial/:serial', () => {
  it('should retuen a array (200)', function(done) {
    this.timeout(15000);
    supertest(app)
      .get('/api/v1/couseserial/CS121000') //2015-秋季-電腦網路概論
      .expect(200, done);
  });

  it('should retuen  Internal Error (500)', function(done) {
    this.timeout(15000);
    supertest(app)
      .get('/api/v1/couseserial/noThisSerial')
      .expect(500, done);
  });
});
