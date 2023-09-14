/** @type {import('next').NextConfig} */

module.exports = {
    async redirects(){
        return [
            {
                source: "/:slug(yt|youtube)",
                destination: "https://www.youtube.com/Sukadia",
                permanent: false,
            },
            {
                source: "/:slug(dev|vod|vods)",
                destination: "https://www.youtube.com/channel/UC8S8l4sY8YsVcngSBTVyoSA",
                permanent: false,
            },
            {
                source: "/:slug(ttv|twitch)",
                destination: "https://www.twitch.tv/Sukadia",
                permanent: false,
            },
            {
                source: "/:slug(hub|discord)",
                destination: "https://discord.gg/ReSCjYpXnK",
                permanent: false,
            },
            {
                source: "/:slug(ev|everyonevotes|everyone-votes)",
                destination: "https://top.gg/bot/805922495705251891",
                permanent: false,
            },
            {
                source: "/:slug(kofi|ko-fi)",
                destination: "https://ko-fi.com/sukadia/tiers",
                permanent: false,
            },
            {
                source: "/dark",
                destination: "https://marketplace.visualstudio.com/items?itemName=Sukadia.sukadia-dev-dark",
                permanent: false,
            },
            {
                source: "/banner",
                destination: "https://www.youtube.com/watch?v=tvq5aBROV_s",
                permanent: false,
            },
            {
                source: "/nsfw",
                destination: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                permanent: false,
            },
        ]
    }
}
