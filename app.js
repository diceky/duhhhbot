import 'dotenv/config';
import fetch from 'node-fetch';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest } from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'duhhh') {
      const question = req.body.data.options[0].value;
      const url = process.env.DIFY_ENDPOINT;
      const api_key = process.env.DIFY_KEY;
      let response = "";

      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `## ${question}\n\n loading...⏳`,
        },
      });

      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`;

      try {
        //fetch chatbot response from server
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api_key}` },
          body: JSON.stringify({
            inputs: {},
            query: question,
            response_mode: "blocking",
            conversation_id: "",
            user: id,
          })
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            response = data.answer;
          });
      } catch (error) {
        response = error;
      }
      await DiscordRequest(endpoint, {
        method: 'PATCH',
        body: {
          content: `## ${question}\n\n ${response}`
        }
      });
    };
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
