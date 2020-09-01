'use strict'

const grpc = require('grpc')
const blogs = require('../server/protos/blog_pb')
const { BlogServiceClient } = require('../server/protos/blog_grpc_pb')

function callListBlog () {
  const client = new BlogServiceClient('127.0.0.1:50051', grpc.credentials.createInsecure())

  const emptyBlogRequest = new blogs.ListBlogRequest()
  const call = client.listBlog(emptyBlogRequest, () => {})

  call.on('data', (data) => {
    console.log('Client streaming response', data.getBlog().toString())
  })

  call.on('error', (err) => {
    console.error('An error happened', err)
  })

  call.on('end', () => {
    console.log('Server finished streaming')
  })
}

function callCreateBlog () {
  const client = new BlogServiceClient('127.0.0.1:50051', grpc.credentials.createInsecure())
  const blog = new blogs.Blog()

  blog.setAuthor('Mau')
  blog.setTitle('Another Mau.. blog post')
  blog.setContent('This is okay...')
  const blogRequest = new blogs.CreateBlogRequest()
  blogRequest.setBlog(blog)

  client.createBlog(blogRequest, (err, response) => {
    if (err) {
      console.error('Error create blog', err)
      process.exit(1)
    }
    console.log('Received blog create response', response.toString())
  })
}

function main () {
  callListBlog()
  callCreateBlog()
}

main()
