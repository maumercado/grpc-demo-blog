// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protos_blog_pb = require('../protos/blog_pb.js');

function serialize_blog_ListBlogRequest(arg) {
  if (!(arg instanceof protos_blog_pb.ListBlogRequest)) {
    throw new Error('Expected argument of type blog.ListBlogRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_ListBlogRequest(buffer_arg) {
  return protos_blog_pb.ListBlogRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var BlogServiceService = exports.BlogServiceService = {
  listBlog: {
    path: '/blog.BlogService/ListBlog',
    requestStream: false,
    responseStream: true,
    requestType: protos_blog_pb.ListBlogRequest,
    responseType: protos_blog_pb.ListBlogRequest,
    requestSerialize: serialize_blog_ListBlogRequest,
    requestDeserialize: deserialize_blog_ListBlogRequest,
    responseSerialize: serialize_blog_ListBlogRequest,
    responseDeserialize: deserialize_blog_ListBlogRequest,
  },
};

exports.BlogServiceClient = grpc.makeGenericClientConstructor(BlogServiceService);
