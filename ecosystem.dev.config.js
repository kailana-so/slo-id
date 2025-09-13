module.exports = {
    apps: [
        {
        name: "slo-id-dev",
        script: "yarn",
        args: "dev",
        watch: false,
        interpreter: "bash",
        env: {
            NODE_ENV: "development",
            NODE_OPTIONS: process.env.NODE_OPTIONS, // ipvN first force
        },
        },
    ],
};
  