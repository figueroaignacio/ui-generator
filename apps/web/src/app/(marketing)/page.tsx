import { MarketingView } from '@/components/marketing/marketing-view';
import { homeMetadata } from '@/lib/metadata';

export const metadata = homeMetadata;

export default function Home() {
  return (
    <main>
      <MarketingView />
    </main>
  );
}
