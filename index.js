const express = require('express');
const os = require('os');
const cluster = require('cluster');


// prepare app parameters
const CPUS = os.cpus().length; // get # of cpu cores
const PORT = process.env.PORT || 5000;

console.log(`# of CPUS = ${CPUS}`);

if (CPUS > 1 && cluster.isMaster) {
    for (let i = 0; i < CPUS; i++) {
        cluster.fork(); // spawn a new worker process for each of the CPU's that exist on the machine
    }
    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.id} has exitted`);
    });
} else {
    const app = new express();
    app.listen(PORT, () => {
        console.log(`app listening on port ${PORT} and worker ${process.pid}`)
    });
}