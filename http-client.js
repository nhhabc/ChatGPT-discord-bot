const axios =  require("axios");
const dotenv = require("dotenv")

dotenv.config()

const DOMAIN = "https://api.openai.com/v1/chat/completions"

let createRequest = (baseURL) => {

  let timeout = 1000 * 60 * 5;
  const request = axios.create({
      baseURL: baseURL,
      timeout: timeout,

  });

  request.interceptors.response.use(response => {
      return response.data;
  }, error => {

      /**
       * perform redirect to login page when server response with status 401 ( un authorization )
       *
       */
      return Promise.reject(error);
  });

  request.interceptors.request.use(function (config) {

      /**
       * add Authorization header to request if user authenticated, run before sent request
       */
      config.maxBodyLength = Infinity
      config.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      }

      return config;

  }, function (error) {
      return Promise.reject(error);
  });

  return request;
};


module.exports = createRequest(DOMAIN);
