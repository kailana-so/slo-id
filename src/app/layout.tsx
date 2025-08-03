import { montserrat, bricolage } from '@/lib/fonts'
import RootLayout from '@/components/RootLayout'
import './globals.css'

export const metadata = {
  title: 'Slo-id',
  description:
    'Slo-id focuses on identification in depth, avoiding misidentifications by examining key details, and tracking sightings to understand how it all fits together.',
  icons: {
    icon: '/slo-id.png',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${bricolage.variable}`}>
      <RootLayout>{children}</RootLayout>
    </html>
  );
}
