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
