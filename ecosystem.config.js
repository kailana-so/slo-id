module.exports = {
    apps: [
      {
        name: "slo-id",
        cwd: "/var/www/slo-id",
        script: "node_modules/next/dist/bin/next",
        args: "start -p 3002",
        env: {
          NODE_ENV: "production",
          PORT: 3002,
          NODE_OPTIONS: "--dns-result-order=ipv4first",
          AWS_UPLOAD_LAMBDA: process.env.AWS_UPLOAD_LAMBDA,
          AWS_BUCKET: process.env.AWS_BUCKET,
          AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
          NOMINATION_API_HOST: process.env.NOMINATION_API_HOST,
          EMAIL_SIGNER: process.env.EMAIL_SIGNER,
          WEATHER_API_KEY: process.env.WEATHER_API_KEY,
          WEATHER_API_HOST: process.env.WEATHER_API_HOST,
          DS_API_KEY: process.env.DS_API_KEY,
          DS_CHAT_HOST: process.env.DS_CHAT_HOST,
        },
        log_date_format: "YYYY-MM-DD HH:mm:ss",
      },
    ],
  };
  