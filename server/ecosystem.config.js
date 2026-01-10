module.exports = {
    apps: [
        {
            name: "project-mamagement",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development",
            },
        },
    ],
}