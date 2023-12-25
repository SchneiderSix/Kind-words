import Elysia, { Context } from "elysia";
import { letterModel } from "./schema";
import * as tf from "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
const LanguageDetect = require("languagedetect");
const natural = require('natural');
const Analyzer = require("natural").SentimentAnalyzer;
const stemmer = require("natural").PorterStemmer;
const tokenizer = new natural.WordTokenizer();
const analyzer = new Analyzer("English", stemmer, "afinn");


/**
 * Get random letter from collection
 * @param req Context
 * @returns Random document or error message
 */
const getRandomLetter = async (req: Context) => {
  try {
    const dbResult = await letterModel.aggregate([{$sample: {size: 1}}]);
    return dbResult ? dbResult : {message: 'Letter not received'};
  } catch (error) {
    console.error('Error getting random letter:\t', error);
  }
}

/**
 * Creates a letter with text from  content header,
 * check if the text is in English and evaluate it's toxicity with Tensorflow 
 * @param req Context
 * @returns New document or error message
 */
const createLetter = async (req: Context) => {
  try {
    const reqContent = req.headers.content;
    const lngDetector = new LanguageDetect();
    if (
      reqContent !== undefined
      ) {

      const lan: string = lngDetector.detect(reqContent, 1)[0][0];

      console.log(lan);
      if (
        typeof reqContent === 'string' &&
        reqContent.length < 301 &&
        reqContent.length > 29 &&
        lan === 'english'
        ) {
        // It should print 'cpu'
        console.log('Using TensorFlow backend: ', tf.getBackend());
        // The minimum prediction confidence
        const threshold = 0.9;
  
        // Load toxicity model
        const model = await toxicity.load(threshold, []);
        const sentences = reqContent;
        const predictions = await model.classify(sentences);
        console.log(predictions);
        const predictionArray = predictions.filter(function (value) {
          if (value.results[0].match === true) {
            return {message: value.label};
          }
        });
        if (predictionArray.length > 0) {
          return {message: 'Be kind is a virtue'}
        } else {
          const sentimentNum: number = analyzer.getSentiment(tokenizer.tokenize(reqContent));
          const sentimentAnalized = sentimentNum
          ? sentimentNum < 0.2
            ? '💔'
            : sentimentNum < 0.5
            ? '💌'
            : sentimentNum < 0.8
            ? '💖'
            : '💗'
          : 'Undefined';
          const dbResult = await letterModel.create({content: reqContent, votes: 0, sentiment: sentimentAnalized});
          return dbResult ? {message: 'Thank you ❤'} : {message: 'Letter not created'};
        }
      } else {
        return {message: 'Invalid format, only english'};
      }
    }

  } catch (error) {
    console.error('Error creating letter:\t', error);
    return {message: 'Someone else has the same thought 💕'};
  }
}

/**
 * Find document by id and updates it's votes
 * @param req Context
 * @returns Updated document or error message
 */
const voteLetter = async (req: Context) => {
  try {
    const reqId = req.headers.id;
    const dbResult = await letterModel.findOneAndUpdate({_id: reqId}, {$inc: {votes: 1}}, {new: true});
    return dbResult ? dbResult : {message: 'Letter not found'};
  } catch (error) {
    console.error('Error voting letter:\t', error);
  }
}

/**
 * Module with each route
 */
export const lettersModule = new Elysia()
  .get('/receiveLetter', (req) => getRandomLetter(req))
  .post('/createLetter', (req) => createLetter(req))
  .post('/voteLetter', (req) => voteLetter(req))