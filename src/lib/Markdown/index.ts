import md from 'markdown-it';
import emoji from 'markdown-it-emoji';

export default md({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
}).use(emoji);
