/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
  .addJSON({
    protocol: {
      nested: {
        Message: {
          fields: {
            avatar: {
              type: "string",
              id: 1
            },
            fromUsername: {
              type: "string",
              id: 2
            },
            from: {
              type: "string",
              id: 3
            },
            lid: {
              type: "string",
              id: 4
            },
            content: {
              type: "string",
              id: 5
            },
            contentType: {
              type: "int32",
              id: 6
            },
            type: {
              type: "string",
              id: 7
            },
            messageType: {
              type: "int32",
              id: 8
            },
            url: {
              type: "string",
              id: 9
            },
            fileSuffix: {
              type: "string",
              id: 10
            },
            seq: {
              type: "int64",
              id: 11
            },
            token: {
              type: "string",
              id: 12
            },
            createTime: {
              type: "int64",
              id: 13
            },
            fromType: {
              type: "int32",
              id: 14
            }
          }
        }
      }
    }
  });

module.exports = $root;
