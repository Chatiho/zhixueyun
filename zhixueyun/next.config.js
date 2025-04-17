/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: [
            "source.unsplash.com",
            "images.unsplash.com",
            "ext.same-assets.com",
            "ugc.same-assets.com",
            "storage.googleapis.com",
            "cloudinary.com",
            "cdn.example.com",
            "res.cloudinary.com",
            "i.imgur.com",
            "fastly.jsdelivr.net"
        ],
        remotePatterns: [{
                protocol: "https",
                hostname: "source.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "ext.same-assets.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "ugc.same-assets.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.example.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.imgur.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "fastly.jsdelivr.net",
                pathname: "/**",
            }
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;