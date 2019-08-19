const express = require("express");

const { handleRequest } = require("./modules/handleRequest");
const port = 3003;
const app = express();

app.get("/myapi/sales/inventory/v1/merchandisable-vehicles", function(
  req,
  res
) {
  handleRequest(req, res);
  res.on("finish", () => {
    console.log("finished\n");
  });
});

app.listen(port, () => console.log(`Starting app on port ${port}`))

module.exports = app;