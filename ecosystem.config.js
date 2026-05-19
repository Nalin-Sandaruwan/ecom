module.exports = {
  apps: [
    {
      name: "woodengallery-backend",
      script: "apps/api/dist/index.js",
      cwd: "/var/www/woodengallery",
      env_file: "/var/www/woodengallery/apps/api/.env",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    },
    {
      name: "woodengallery-frontend",
      script: "apps/user-front/.next/standalone/apps/user-front/server.js",
      cwd: "/var/www/woodengallery",
      env_file: "/var/www/woodengallery/apps/user-front/.env",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1"
      }
    }
  ]
};
