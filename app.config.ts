import type { CliOptions } from "dt-app";

const config: CliOptions = {
  // CHANGE THIS TO POINT TO YOUR ENVIRONMENT:
  environmentUrl: "https://xxxxxxx.apps.dynatrace.com/",
  icon: "src/assets/Au.png",
  app: {
    name: "AutoUpdate Manager Sample",
    version: "0.0.23",
    description: "A Sample App which enables controlling AutoUpdate at large scale",
    id: "my.auto.update.manager",
    scopes: [
      { name: "storage:metrics:read", comment: "default template" },
      { name: "environment-api:deployment:download", comment: "get oneagent versions" },
      { name: "settings:objects:read", comment: "read settings" },
      { name: "settings:objects:write", comment: "write settings" },
      { name: "environment-api:entities:read", comment: "read HOST_GROUPS" },
      { name: "storage:entities:read", comment: "Query entities from Grail" },
      { name: "state:app-states:write", comment: "store macros" },
      { name: "state:app-states:read", comment: "read macros" },
      { name: "environment-api:oneagents:read", comment: "get oneagent update statuses" },
    ],
  },
};

module.exports = config;
