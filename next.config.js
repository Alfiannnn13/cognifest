// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["utfs.io", "88yc4zzgzt.ufs.sh"],
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "88yc4zzgzt.ufs.sh",
      },
    ],
  },
};

module.exports = nextConfig;
