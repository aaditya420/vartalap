/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
          {
            protocol: 'https', // or 'http'
            hostname: 'lh3.googleusercontent.com', // The domain of your external images
          },
          // Add more objects for other allowed domains or patterns
        ],
      },
};

export default config;
