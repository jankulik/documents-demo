import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useStyles } from '@/styles/home.styles';
import DropzoneButton from '@/components/Dropzone';
import { ScrollArea, Title, Text, Overlay, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import ChatStripe from '@/components/ChatStripe';
import { postData } from '@/utils/helpers/postData';
import PromptInput from '@/components/PromptInput';
import Image from 'next/image';

export default function Home() {
  const { classes, theme } = useStyles();

  const [documentData, setDocumentData] = useState<Array<any>>([]);
  const [messages, setMessages] = useState<Array<string>>();
  const [sendDisabled, setSendDisabled] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    viewport.current != null && viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const viewport = useRef<HTMLDivElement>(null);

  const completerConfig = {
    textBeforeDocuments: `You are a chatbot assistant answering technical questions about documents. You can only respond to a question if the content necessary to answer the question is contained in the following provided documentation. If the answer is in the documentation, summarize it in a helpful way to the user. If it isn't, simply reply that you cannot answer the question. Do not refer to the documentation directly, but use the instructions provided within it to answer questions. Here is the documentation:\n<DOCUMENTS>\n`,
    textBeforePrompt: `<END DOCUMENTS>\nRemember:\nYou are a chatbot assistant answering technical questions about documents. Here are the rules you must follow:\n1) You must only respond with information contained in the documentation above. Say you do not know if the information is not provided.\n2) Make sure to format your answers in Markdown format, including code block and snippets.\n3) Do not reference any links, urls or hyperlinks in your answers.\n4) Do not refer to the documentation directly, but use the instructions provided within it to answer questions.\n5) If you do not know the answer to a question, or if it is completely irrelevant to the documents, simply reply with:\n'I'm sorry, but I am an AI language model trained to assist with questions related to the provided documents. I cannot answer that question as it is not relevant to the provided document. Is there anything else I can assist you with?'\nFor example:\nWhat is the meaning of life for a goat?\n'I'm sorry, but I am an AI language model trained to assist with questions related to the provided documents. I cannot answer that question as it is not relevant to the provided document. Is there anything else I can assist you with?' Now answer the following question:\n`
  }

  const splitText = (text: string, chunkSize: number) => {
    let chunks = [];

    while (text.length > 0) {
      if (text.length <= chunkSize) {
        chunks.push(text);
        break;
      }

      let lastSpace = text.substring(0, chunkSize).lastIndexOf(' ');

      if (lastSpace === -1) {
        chunks.push(text.substring(0, chunkSize));
        text = text.substring(chunkSize);
      } else {
        chunks.push(text.substring(0, lastSpace));
        text = text.substring(lastSpace + 1);
      }
    }

    return chunks;
  }

  const dotProduct = (vectorA: Array<number>, vectorB: Array<number>) => {
    let product = 0;
    for (let i = 0; i < vectorA.length; i++)
      product += vectorA[i] * vectorB[i];

    return product;
  }

  const magnitude = (vector: Array<number>) => {
    let sum = 0;
    for (let i = 0; i < vector.length; i++)
      sum += vector[i] * vector[i];

    return Math.sqrt(sum);
  }

  const cosineSimilarity = (vectorA: Array<number>, vectorB: Array<number>) => {
    return dotProduct(vectorA, vectorB) / (magnitude(vectorA) * magnitude(vectorB));
  }

  const handleSubmit = async (promptInput: string) => {
    setMessages(prevMessages => (prevMessages != undefined ? [...prevMessages, promptInput] : [promptInput]));
    setMessages(prevMessages => (prevMessages != undefined ? [...prevMessages, 'loading'] : ['loading']));
    setSendDisabled(true);

    const responseEmbed = await postData({ text: promptInput }, '/embed');
    let cosineSimilarities: Array<number> = [];
    for (let i = 0; i < documentData.length; i++)
      cosineSimilarities.push(cosineSimilarity(responseEmbed.embedding, documentData[i].embedding));

    const topIndices = [...cosineSimilarities]
      .sort((a, b) => b - a)
      .slice(0, 3)
      .map(value => cosineSimilarities.indexOf(value));

    let prompt = completerConfig.textBeforeDocuments;
    for (let i = 0; i < topIndices.length; i++)
      prompt += documentData[topIndices[i]].text + '\n\n';

    prompt += completerConfig.textBeforePrompt;
    prompt += promptInput;

    let responseComplete: any;
    if (uploaded) {
      responseComplete = await postData({ prompt: prompt }, '/complete');
    } else {
      responseComplete = { answer: "Please upload your document before asking questions." }
    }

    let index = 0
    let interval = setInterval(() => {
      if (index <= responseComplete.answer.length) {
        setMessages(prevMessages => (prevMessages != undefined ? [...prevMessages.slice(0, -1), responseComplete.answer.slice(0, index)] : [responseComplete.answer]));
        index++;
      } else {
        clearInterval(interval);
        setSendDisabled(false);
      }
    }, 20);
  }

  const handleUpload = async (textData: string) => {
    textData = textData.replace(/(\r\n|\n|\r)/gm, "");
    const textDataArray = splitText(textData, 3000);
    let textDataJson = textDataArray!.map((text, index) => ({ index: index, text: text, embedding: [] }));
    setDocumentData(textDataJson);

    for (let i = 0; i < textDataJson.length; i++) {
      const response = await postData({ text: textDataJson[i].text }, '/embed');
      let newData = textDataJson;
      newData[i].embedding = response.embedding;
      setDocumentData(newData);
      setUploadProgress(Math.round(i / textDataJson.length * 100));
    }

    showNotification({
      autoClose: 10000,
      title: "Upload successful",
      message: "You can now ask questions about your document",
      color: theme.colors.blue[6],
      icon: <IconCheck />
    });
    setUploaded(true);
  }

  return (
    <>
      <Head>
        <title>AI Assistant</title>
      </Head>

      <div className={classes.wrapper}>
        <div style={{ height: '40px', width: '100%', position: 'relative' }}>
          <Image
            alt='AIMMS logo'
            src='/logo_text.png'
            style={{objectFit: 'contain'}}
            fill
            priority
          />
        </div>

        <Title className={classes.title}>
          Upload a document and ask your{' '}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
            inherit>
            AI assistant
          </Text>{' '}
          about its contents
        </Title>

        {!uploaded &&
          <DropzoneButton
            progress={uploadProgress}
            handleUpload={handleUpload}
          />
        }

        <ScrollArea
          h={'100%'}
          viewportRef={viewport}
        >
          <Space h={2} />
          {messages != undefined &&
            messages.map((message, index) => (
              <div key={index}>
                <ChatStripe
                  text={message}
                  isUser={index % 2 == 0}
                  isLoading={index % 2 != 0 && message === 'loading'}
                />
              </div>
            ))
          }
          <Space h={4} />

          <Overlay
            gradient="linear-gradient(to bottom, white 0%, rgba(255, 255, 255, 0.7) 10px, rgba(255, 255, 255, 0) 20px, rgba(255, 255, 255, 0) 100%)"
            style={{ pointerEvents: 'none' }}
          />

          <Overlay
            gradient="linear-gradient(to top, white 0%, rgba(255, 255, 255, 0.7) 10px, rgba(255, 255, 255, 0) 20px, rgba(255, 255, 255, 0) 100%)"
            style={{ pointerEvents: 'none' }}
          />
        </ScrollArea>

        <PromptInput
          handleSubmit={handleSubmit}
          disabled={sendDisabled}
        />
      </div>
    </>
  )
}
