require("colors");
const { build, version } = require("./info");
const connectDB = require("./src/dao/connectDB");
const Versioning = require("./src/dao/versioning");
const Users = require("./src/dao/users");
const Sessions = require("./src/dao/sessions");
const config = require("./config");
const Power = require("express-power");
const { log } = Power;

const master = async () => {
    console.log("");
    console.log("♥♥♥".green + " ♥♥♥".white + " ♥♥♥".red);
    console.log("♥♥♥".green + " ♥♥♥".white + " ♥♥♥".red);
    console.log("♥♥♥".green + " ♥♥♥".white + " ♥♥♥".red);
    console.log("");
    console.log("Honeyside".yellow);
    console.log(`Crumble v${version}`.yellow);
    console.log("");

    const isConnected = await connectDB();

    if (!isConnected) return;

    const info = await Versioning.getCurrentVersion();

    if (!info || info.build < build) {
        await Versioning.updateCurrentVersion({ version, build });
    }

    await Users.updateRootUser();
    await Sessions.deleteSessions();
}

const worker = async app => {
    const isConnected = await connectDB();
    if (!isConnected) return;

    const cors = require("cors");
    const formidable = require("express-formidable");
    const passport = require("passport");
    const jwtStrategy = require("./src/strategies/jwt");
    const routes = require("./src/routes");
    const xss = require("xss").filterXSS;

    app.use(cors({ preflightContinue: true, credentials: true }));
    app.use(formidable());
    app.use((req, res, next) => {
        Object.keys(req.fields).map(key => typeof req.fields[key] === 'string' && (req.fields[key] = xss(req.fields[key])));
        next();
    })
    app.use(passport.initialize({}));
    passport.use('jwt', jwtStrategy);
    app.use('/api', routes);

    app.listen(config.port, () => log(`listening on port ${config.port}`.green))
};

Power.load({ master, worker, logToFile: false });


