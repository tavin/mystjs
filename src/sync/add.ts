import fs from 'fs';
import inquirer from 'inquirer';
import { basename, resolve } from 'path';
import chalk from 'chalk';
import { ISession } from '../session/types';
import questions from './questions';
import { isDirectory } from '../toc';
import { loadSiteConfigOrThrow, writeSiteConfig } from '../newconfig';
import { config } from '../store/local';

const START = `

${chalk.green.bold('Add new project to your Curvenote site')} 🛻

`;

const FINISHED = `

${chalk.green.bold('Project successfully added')} 🎉

`;

/**
 * Add local project to curve.space site config
 */
export async function add(session: ISession) {
  const siteConfig = loadSiteConfigOrThrow(session.store);

  session.log.info(START);

  const { projectPath } = await inquirer.prompt([questions.projectPath()]);
  if (!fs.existsSync(projectPath) || !isDirectory(projectPath)) {
    session.log.error(`cannot find project: ${projectPath}`);
  }
  siteConfig.projects.push({ path: projectPath, slug: basename(resolve(projectPath)) });
  session.store.dispatch(config.actions.receiveSite(siteConfig));
  writeSiteConfig(session.store.getState(), '.');

  session.log.info(FINISHED);
}
