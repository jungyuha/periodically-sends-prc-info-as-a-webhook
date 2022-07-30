//swagger 설정
var swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "onlinepharm ai api",
      version: "0.0.1",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger"
    },
    servers: [
      {
        url: "/",
      },
    ],
  },
  apis: ["./routes/camera.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
