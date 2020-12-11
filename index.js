const path = require("path");
// const fs = require("fs");
const dotenv = require("dotenv");
const fs = require("fs");
const Hapi = require("@hapi/hapi");
const router = require("hapi-router");

const devEnvFile = path.resolve(process.cwd(), ".env.local");
const proEnvFile = path.resolve(`${process.cwd()}/../`, ".env");

// 检查配置文件
if (process.env.NODE_ENV == "production") {
  if (!fs.existsSync(proEnvFile)) {
    console.error("production配置文件不存在");
    process.exit(-1);
  }
}
if (process.env.NODE_ENV == "development") {
  if (!fs.existsSync(devEnvFile)) {
    console.error("development配置文件不存在");
    process.exit(-1);
  }
}
dotenv.config({
  path: process.env.NODE_ENV == "development" ? devEnvFile : proEnvFile,
});
const AllowDomains =
  process.env.NODE_ENV == "development" ? ["*"] : ["https://*.yangerxiao.com"];
const init = async () => {
  const server = Hapi.server({
    port: 3008,
    host: "localhost",
    routes: {
      cors: {
        origin: AllowDomains,
      },
    },
  });
  await server.register({
    plugin: router,
    options: {
      routes: "routes/**/*.js", // uses glob to include files
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
