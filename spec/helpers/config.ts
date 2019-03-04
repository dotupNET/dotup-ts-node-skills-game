// tslint:disable
const TSConsoleReporter = require('jasmine-ts-console-reporter');

// tslint:disable-next-line:no-var-requires
const jasmineReporters = require("jasmine-reporters");

jasmine.getEnv()
  .clearReporters(); // Clear default console reporter

/* TSConsoleReporter
*/
jasmine.getEnv()
  .addReporter(new TSConsoleReporter());

/* TerminalReporter
const terminalReporter = new jasmineReporters.TerminalReporter();
jasmine.getEnv().addReporter(terminalReporter);
*/
/* TeamCityReporter => reports to the console in Team city format
const teamCityReporter = new jasmineReporters.TeamCityReporter();
jasmine.getEnv().addReporter(teamCityReporter);
*/
/*
jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
    consolidateAll: false,
    savePath: "./spec/junit",
}));
*/