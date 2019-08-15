"use strict";
const request = require("request-promise-native");
const config = require("../config/config.json");

const ACCOUNTS_URL = config.accounts_url;
const SUBSCRIPTION_URL = config.subscription_url;

const PROVIDER_CREDENTIALS = {
  client_id: config.credentials.client_id,
  client_secret: config.credentials.client_secret
};

// fetch an access token using provider credentials (client_id and client_secret)
const getToken = async () => {
  const url = ACCOUNTS_URL;

  const options = {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${PROVIDER_CREDENTIALS.client_id}:${
            PROVIDER_CREDENTIALS.client_secret
          }`
        ).toString("base64"),
      Accept: "application/json"
    },
    form: {
      grant_type: "client_credentials",
      scope: "anonymous"
    },
    json: true
  };

  return request
    .post({
      url,
      ...options
    })
    .catch(err => {
      throw err;
    });
};

const getSubscriptionContext = async (subscriptionId, token) => {
  const url = `${SUBSCRIPTION_URL}/${subscriptionId}/context`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    json: true
  };

  return request
    .get({
      url,
      ...options
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  getToken,
  getSubscriptionContext
};