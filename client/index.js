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

function callReadBlog () {
  const client = new BlogServiceClient('127.0.0.1:50051', grpc.credentials.createInsecure())

  const readBlogRequest = new blogs.ReadBlogRequest()
  readBlogRequest.setBlogId('1')
  client.readBlog(readBlogRequest, (err, response) => {
    if (err) {
      if (err.code === grpc.status.NOT_FOUND) {
        console.error('Not found')
        return
      }
      console.error('Error:', err)
      return
    }
    console.log('Found blog', response.toString())
  })
}

function callUpdateBlog () {
  const client = new BlogServiceClient('127.0.0.1:50051', grpc.credentials.createInsecure())

  const updateBlogRequest = new blogs.UpdateBlogRequest()
  const newBlog = new blogs.Blog()
  newBlog.setId('2')
  newBlog.setAuthor('Mau')
  newBlog.setTitle('Mau Test')
  newBlog.setContent('This is good')

  updateBlogRequest.setBlog(newBlog)
  console.log('Updating blog', newBlog)

  client.updateBlog(updateBlogRequest, (err, response) => {
    if (err) {
      if (err.code === grpc.status.NOT_FOUND) {
        console.error('Not found')
        return
      }
      console.error('Error:', err)
      return
    }
    console.log('Blog Updated', response.toString())
  })
}

function callDeleteBlog () {
  const client = new BlogServiceClient('127.0.0.1:50051', grpc.credentials.createInsecure())

  const blogId = '3'
  const deleteBlogRequest = new blogs.DeleteBlogRequest()
  deleteBlogRequest.setBlogId(blogId)
  client.deleteBlog(deleteBlogRequest, (err, response) => {
    if (err) {
      if (err.code === grpc.status.NOT_FOUND) {
        console.error('Not found')
        return
      }
      console.error('Error:', err)
    } else {
      console.log('Deleted blog', response.toString())
    }
  })
}

function main () {
  callDeleteBlog()
  // callUpdateBlog()
  // callReadBlog()
  // callListBlog()
  // callCreateBlog()
}

main()
