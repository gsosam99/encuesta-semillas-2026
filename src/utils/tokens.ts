import { PRODUCERS_DATA } from '../data/producers';

export const PRODUCER_TOKENS: Record<string, string> = {};
export const TOKEN_TO_PRODUCER: Record<string, string> = {};

(() => {
  Object.keys(PRODUCERS_DATA).forEach((name: string, i: number) => {
    let hash = 0;
    for (let c = 0; c < name.length; c++)
      hash = ((hash << 5) - hash + name.charCodeAt(c)) | 0;
    const token = 'p' + Math.abs(hash).toString(36) + i.toString(36);
    PRODUCER_TOKENS[name] = token;
    TOKEN_TO_PRODUCER[token] = name;
  });
})();
