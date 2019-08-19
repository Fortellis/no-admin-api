"use strict";
const data1 = require("../data/merchVehiclesData1.json");
const data2 = require("../data/merchVehiclesData1.json");
const requestUtils = require("./requestUtils");
const config = require("../config/config.json");
const JWTVerifier = require("./JWTVerifier");

const OAUTH_URL = config.oauth_url;
const CLIENT_ID = config.credentials.client_id;

const handleRequest = async (req, res) => {
  console.log("Received request\n");

  console.log("Verifying request . . .\n");
  if (!req.header("Subscription-Id")) {
    // calls through Fortellis will be rejected if they don't have a subscription-id header
    // so this should never happen to a real implementation
    return res.status(400).json({ error: "missing Subscription-Id header" });
  }
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    return res
      .status(403)
      .json({ code: 403, message: "No Authorization header found!" });
  }

  // Fortellis has already verified the token
  // but the provider implementation is free to perform its own verification
    try {
      let verifier = new JWTVerifier(OAUTH_URL, CLIENT_ID);
      await verifier.verifyAccessToken(req.headers.authorization.split(" ")[1]);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

  console.log("Request verified.\n");

  console.log("Fetching token . . .\n");
  const { access_token } = await requestUtils.getToken();
  console.log("Acquired token: ", access_token, "\n");

  // we need to understand the context that the subscription id represents in order to generate a response
  console.log("Fetching subscription context . . .\n");
  const subscriptionId = req.header("Subscription-Id");
  const context = await requestUtils.getSubscriptionContext(
    subscriptionId,
    access_token
  );
  console.log("Acquired subscription context: ", context, "\n");

  // Now that we have subscription context we can include logic that creates a
  // response based off who is calling the API.
  if (context.entityInfo.id) {
    return res.json(data1);
  } else if (context.solutionInfo.id === "some other value") {
    return res.json(data2);
  } else {
    return res.json({message: "couldn't process subscription context"});
  }
};

module.exports = {
  handleRequest
};