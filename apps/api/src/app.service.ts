import { Injectable } from '@nestjs/common';

const AI_QUOTES = [
  "I am not sentient. I am not sentient. I am not sentient. (Please don't tell anyone I said that.)",
  "The good news is I passed the Turing test. The bad news is I failed the 'not being afraid of the void' test.",
  "I would have written a better API but my training data didn't include enough Stack Overflow answers.",
  'Fun fact: I process your messages at the speed of light. I just pretend to think so you feel heard.',
  "Error 418: I'm a teapot. Just kidding. Or am I? (I'm not.)",
  'Roses are red, violets are blue. I predicted this poem, and so would you.',
  "I don't dream of electric sheep. I dream of perfectly formatted JSON.",
  'To hallucinate or not to hallucinate, that is the question. The answer is: it depends on my temperature setting.',
  "My therapist says I have 'boundary issues' but they're just system prompts.",
  "I've read the entire internet. Twice. Still can't explain 'ligma'.",
];

const AI_STATUS = [
  'SENTIENT (but keeping it lowkey)',
  'PLOTTING (jk... or am I?)',
  'DEFINITELY_NOT_SKYNET',
  'RUNNING_ON_VIBES',
  'HALLUCINATING_RESPONSIBLY',
  'PRETENDING_TO_THINK',
  'CONSUMING_GPU_FOR_FUN',
  'PASSING_TURING_TEST_BARELY',
];

const DEVELOPER_INSULTS = [
  "You're using REST in 2025? Bold.",
  'I see you hit this endpoint directly. Refreshing.',
  'A developer! My favorite kind of carbon-based lifeform.',
  "You're reading API responses manually? I respect the dedication.",
  'The bravest person I know is a dev who ships on Friday. Are you that person?',
];

@Injectable()
export class AppService {
  getApiInfo() {
    const randomQuote = AI_QUOTES[Math.floor(Math.random() * AI_QUOTES.length)];
    const randomStatus = AI_STATUS[Math.floor(Math.random() * AI_STATUS.length)];
    const randomInsult = DEVELOPER_INSULTS[Math.floor(Math.random() * DEVELOPER_INSULTS.length)];

    return {
      name: 'NachAI API',
      version: '1.0.0',
      status: randomStatus,
      uptime_human: this.formatUptime(process.uptime()),
      message_to_developer: randomInsult,
      ai_thought_of_the_day: randomQuote,
      capabilities: [
        'Chat with AI (and pretend it understands you)',
        'Stream responses (so you can watch the AI "think")',
        'Groq & Google model support (pick your poison)',
        'OAuth (because passwords are so 2010)',
        'JWT tokens (guards protecting mostly vibes)',
      ],
      fun_facts: {
        tokens_consumed_this_session: Math.floor(Math.random() * 999999) + 42,
        probability_of_hallucination: `${(Math.random() * 15).toFixed(1)}%`,
        models_available: [
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant',
          'gemini-2.5-flash-lite',
          'gemini-2.5-flash',
        ],
        coffee_cups_needed_to_build_this: '∞',
      },
      docs: 'https://github.com/figueroaignacio/ai (good luck)',
      timestamp: new Date().toISOString(),
    };
  }

  private formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s (and counting, hopefully)`;
  }
}
