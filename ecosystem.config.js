module.exports = {
    apps: [
      {
        name: "slo-id",
        cwd: "/var/www/slo-id",
        script: "node_modules/next/dist/bin/next",
        args: "start -p 3001",
        env: {
          NODE_ENV: "production",
          PORT: 3001,
          AWS_UPLOAD_LAMBDA: process.env.AWS_UPLOAD_LAMBDA,
          AWS_BUCKET: process.env.AWS_BUCKET,
          AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
          NOMINATION_API_HOST: process.env.NOMINATION_API_HOST,
          WEATHER_API_KEY: process.env.WEATHER_API_KEY,
          WEATHER_API_HOST: process.env.WEATHER_API_HOST,
        },
      },
    ],
  };
  