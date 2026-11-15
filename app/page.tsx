import { homePage } from '@/lib/data';
import { PageView, metadataFor } from '@/lib/PageView';

export const metadata = metadataFor(homePage);

export default function HomePage() {
  return <PageView model={homePage} />;
}
