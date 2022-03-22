#! /usr/bin/env node

const yargs = require("yargs");
const utils = require('./client_utils.js')


const usage = "\nUsage: suivit <Order_id>";

const options = yargs
  .usage(usage)
  .option("o", {alias:"Order_id", describe: "Id of order", type: "string", demandOption: false })
  .help(true)
  .argv;



if(yargs.argv._[0] == null){
  utils.showHelp();
  return;
}
else {utils.respond();return;}