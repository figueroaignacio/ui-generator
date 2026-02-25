import type { Metadata } from 'next';

const siteConfig = {
  name: 'NachAI',
  description: 'The most advanced AI UI generator at your fingertips.',
  url: 'https://nach-ui.vercel.app',
};

export const rootMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const homeMetadata: Metadata = {
  title: 'NachAI - Build the future of web with AI',
  description:
    'Turn your ideas into production-ready UI components with a single prompt. Powered by NachUI and advanced AI.',
};

export const chatMetadata: Metadata = {
  title: 'New Conversation',
  description:
    'Start a new design session. Describe what you need and watch NachAI build it for you.',
};

export const allChatsMetadata: Metadata = {
  title: 'History',
  description:
    'Explore your creative past. Access and manage all your previous conversations and generated components.',
};

export const searchMetadata: Metadata = {
  title: 'Search',
  description: "Quickly locate any past conversation, idea, or component you've built with NachAI.",
};

export const profileMetadata: Metadata = {
  title: 'Profile',
  description: 'Personalize your NachAI experience and manage your account settings.',
};

export const getStartedMetadata: Metadata = {
  title: 'Get Started',
  description:
    'Join the community of creators building the next generation of web interfaces with AI.',
};
