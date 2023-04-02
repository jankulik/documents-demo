import express from 'express';
import fileUpload from 'express-fileupload';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import pdfParse from 'pdf-parse';

dotenv.config();

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello World!'
  })
})

app.post('/extract', (req, res) => {
  if (!req.files && !req.files.pdfFile) {
      res.status(400);
      res.end();
  }

  pdfParse(req.files.pdfFile).then(result => {
      res.send(result.text);
  });
});

app.post('/embed', async (req, res) => {
  try {
    const text = req.body.text;

    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: `${text}`,
    });

    res.status(200).send({
      embedding: response.data.data[0].embedding,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
})

app.post('/complete', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,         // number between 0 and 2; higher values means the model will take more risks
      max_tokens: 1500,         // the maximum number of tokens to generate in the completion
      frequency_penalty: 0.5,   // number between -2 and 2; positive values penalize new tokens based on their frequency in the text so far
      presence_penalty: 0,      // number between -2 and 2; positive values penalize new tokens based on whether they appear in the text so far
    });

    res.status(200).send({
      answer: response.data.choices[0].text,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(4000, () => console.log('Server started on http://localhost:4000'));
