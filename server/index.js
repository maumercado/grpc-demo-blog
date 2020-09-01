'use strict'

const grpc = require('grpc')

const ENV = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[ENV]
const knex = require('knex')(config)

const blogs = require('./protos/blog_pb')
const { BlogServiceService } = require('./protos/blog_grpc_pb')

async function listBlog (call, callback) {
  console.log('Received request, for list blogs')
  const items = await knex('blogs')
  for (const item of items) {
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

async function createBlog (call, callback) {
  console.log('Receive request for create blog')
  const blog = call.request.getBlog()

  console.log('Inserting a blog', blog)
  await knex('blogs').insert({
    author: blog.getAuthor(),
    title: blog.getTitle(),
    content: blog.getContent()
  })

  const id = blog.getId()

  const addedBlog = new blogs.Blog()

  // set the blog response to be returned
  addedBlog.setId(id)
  addedBlog.setAuthor(blog.getAuthor())
  addedBlog.setTitle(blog.getTitle())
  addedBlog.setContent(blog.getContent())

  const blogResponse = new blogs.CreateBlogResponse()

  blogResponse.setBlog(addedBlog)

  console.log('Inserted blog', addedBlog.toString())

  callback(null, blogResponse)
}

async function readBlog (call, callback) {
  const blogId = call.request.getBlogId()

  console.log('Received blog request', blogId)

  const data = await knex('blogs').where({ id: parseInt(blogId) })
  if (data.length) {
    const blog = new blogs.Blog()
    console.log('Blog found')

    blog.setId(blogId)
    blog.setAuthor(data[0].author)
    blog.setTitle(data[0].title)
    blog.setContent(data[0].content)
    const blogResponse = new blogs.ReadBlogResponse()
    blogResponse.setBlog(blog)
    return callback(null, blogResponse)
  } else {
    console.log('No Blog Found')
    return callback({ code: grpc.status.NOT_FOUND, message: 'Blog not found' })
  }
}

async function updateBlog (call, callback) {
  const blogId = call.request.getBlog().getBlogId()

  console.log('Request to update blog', blogId)

  const data = await knex('blogs')
    .where({ id: parseInt(blogId) })
    .update({
      author: call.request.getBlog().getAuthor(),
      title: call.request.getBlog().getTitle(),
      content: call.request.getBlog().getContent()
    }).returning()

  if (data) {
    const blog = new blogs.Blog()
    blog.setId(blogId)
    blog.setAuthor(data.author)
    blog.setTitle(data.title)
    blog.setContent(data.content)
    const updateBlogResponse = new blogs.UpdateBlogResponse()
    updateBlogResponse.setBlog(blog)
    console.log('Updated blog', updateBlogResponse.getBlog())
    return callback(null, updateBlogResponse)
  } else {
    console.log('No Blog Found')
    return callback({ code: grpc.status.NOT_FOUND, message: 'Blog not found' })
  }
}

function main () {
  const server = new grpc.Server()
  server.addService(BlogServiceService, { listBlog, createBlog, readBlog, updateBlog })
  server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
  server.start()
  console.log('Blog Service Started at 127.0.0.1:50051')
}

main()
