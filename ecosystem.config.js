module.exports = {
    apps: [
        {
            name: "final-proj-demo",
            script: "bun",
            args: "start",
            cron_restart: "0 3 * * *", // Daily at 3 AM
            max_memory_restart: "2G",
            autorestart: true,
            watch: false,
        },
    ],
};
