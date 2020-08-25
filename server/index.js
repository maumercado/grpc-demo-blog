'use strict'

const fs = require('fs')
const grpc = require('grpc')

const ENV = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[ENV]
const knex = require('knex')(config)

const blogs = require('./protos/blog_pb')
const { BlogServiceService: BlogService } = require('./protos/blog_grpc_pb')

async function listBlog (call, callback) {
  for await (const item of knex('blogs')) {
    const blog = new blogs.Blog()
    blog.setId(item.id)
    blog.setAuthor(item.author)
    blog.setTitle(item.title)
    blog.setContent(item.content)
    const blogResponse = new blogs.ListBlogResponse()
    blogResponse.setBlog(blog)
    call.write(blogResponse)
  }
  call.end()
}

function main () {
  const server = new grpc.Server()
  server.addService(BlogService, { listBlog })
  server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
  server.start()
  console.log('Blog Service Started at 127.0.0.1:50051')
}

main()
