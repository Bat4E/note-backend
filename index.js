const app = require("./app"); // the actual Express application
const config = require("./utils/config"); // for env variables
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

/*
One of the advantages of having the Express app and the code taking care of the web server is that
the application can now be tested at the level of HTTP API calls without making calls via
HTTP over the network, making execution of tests faster.
*/
