import { Metadata } from 'next';
import ContactPageClient from '@/components/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us | GrowMedLink',
  description: 'Get in touch with GrowMedLink. We are here to help you navigate your global journey.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
