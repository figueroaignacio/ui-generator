import { SearchView } from '@/features/chat/components/search-view';
import { searchMetadata } from '@/lib/metadata';

export const metadata = searchMetadata;

export default function SearchPage() {
  return (
    <div className="flex flex-col flex-1 bg-background overflow-y-auto w-full">
      <div className="max-w-3xl mx-auto w-full px-6 pt-12 pb-20">
        <SearchView />
      </div>
    </div>
  );
}
