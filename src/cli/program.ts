import { Command } from "commander";
import { resolve } from "path";
import { cwd } from "process";
import { CONFIG_FILENAME } from "../lib/constants";
import { initCmd } from "./cmd/init";
import { pruneCmd } from "./cmd/prune";

const program = new Command();

program.name("modules-cleaner");

program
  .command("prune")
  .description("Prunes all unwanted files from all node_modules folder")
  .option(
    "-c,--config [string]",
    "Location of the config file",
    `./${CONFIG_FILENAME}`
  )
  .option("-f,--force", "Update the filesystem", false)
  .option(
    "-cwd,--current-working-directory [string]",
    "Set the current working directory of the command",
    (value: string) => resolve(value),
    cwd()
  )
  .option("-v,--verbose", "Show a list of affected files", false)
  .option("--stats", "Show some stats in the console", false)
  .action(pruneCmd);

program
  .command("init")
  .description(
    "Creates a new config file in the current working directory with a list of default rules"
  )
  .option("-f,--force", "Overwrite existing config", false)
  .action(initCmd);

export default program;
