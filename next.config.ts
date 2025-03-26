import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname: "**", // Allows all HTTPS images
      
      }
    ]
  }
};

export default nextConfig;
