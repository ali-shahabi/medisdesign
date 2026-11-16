import { PageHero } from '@/components/PageHero';
import { TextLink } from '@/components/TextLink';

/* No reference page for this — same furniture, honest copy. */
export default function NotFound() {
  return (
    <main id="main">
      <PageHero
        en="lost"
        fa="خطا"
        h1="این صفحه اینجا نیست"
        lede="نشانی را بررسی کنید یا از پیوندهای زیر به بخش دیگری بروید."
        actions={<TextLink href="/">بازگشت به صفحهٔ اصلی</TextLink>}
      />
    </main>
  );
}
