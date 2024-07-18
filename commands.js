import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

const DUHHH_COMMAND = {
  name: 'duhhh',
  description: 'Get prototyping tips and tricks!',
  options: [
    {
      type: 3,
      name: 'question',
      description: 'Enter your question',
      required: true
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [DUHHH_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);