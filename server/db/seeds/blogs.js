'use strict'

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('blogs').del()
    .then(function () {
      // Inserts seed entries
      return knex('blogs').insert([
        { author: 'Mauricio Mercado', title: 'Testing grpc', content: 'this a the first seed for the blog' },
        { author: 'Mauricio Mercado', title: 'Testing grpc part 2', content: 'Used kned' },
        { author: 'Mauricio Mercado', title: 'Testing grpc part 3', content: 'Learned a bit of everything' }
      ])
    })
}
