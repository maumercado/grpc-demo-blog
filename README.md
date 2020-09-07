# grpc based blog
A gRPC simple CRUD blog, for learning purposes 

## Execute

In order to initialize this project first generate the proper files from the .proto sources.

```sh
protoc -I=. ./protos/blog.proto --js_out=import_style=commonjs,binary:./server --grpc_out=./server --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`

```

To start the server simply do
```
node server/index.js
```

To start the client, simply uncomment any method you want to use at `./client/index.js` and execute
```
node client/indext.js
```

More about protobuffers 
[official docs](https://grpc.io)
[source code](https://github.com/protocolbuffers/protobuf)
[google docs](https://developers.google.com/protocol-buffers/)
[protobuff gateway](https://github.com/grpc-ecosystem/grpc-gateway)
