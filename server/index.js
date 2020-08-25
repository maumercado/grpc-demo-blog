'use strict'

const fs = require('fs')
const grpc = require('grpc')

const ENV = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[ENV]
const knex = require('knex')(config)
