'use client';

import React, { useEffect, useState } from 'react';
import { getGlobalSettings } from '@/lib/api/settings';

interface WhatsAppButtonProps {
  pageType: 'products' | 'services' | 'product_detail' | 'service_detail';
  itemName?: string;
}

export default function WhatsAppButton({ pageType, itemName }: WhatsAppButtonProps) {
  const [phone, setPhone] = useState('');

  useEffect(() => {
    getGlobalSettings()
      .then(settings => {
        if (settings?.contactPhone) {
          // Strip non-numeric characters for WhatsApp API
          const cleaned = settings.contactPhone.replace(/[^0-9]/g, '');
          setPhone(cleaned);
        }
      })
      .catch(err => console.error('Failed to load settings for WhatsApp button:', err));
  }, []);

  if (!phone) return null;

  let text = '';
  if (pageType === 'products') {
    text = 'Hello! I am interested in inquiring about your products.';
  } else if (pageType === 'services') {
    text = 'Hello! I am interested in inquiring about your services.';
  } else if (pageType === 'product_detail') {
    text = `Hello! I am interested in inquiring about the product: ${itemName || ''}.`;
  } else if (pageType === 'service_detail') {
    text = `Hello! I am interested in inquiring about the service: ${itemName || ''}.`;
  }

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#25D366',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.22, 0.68, 0, 1.2), box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.22)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      aria-label="Contact us on WhatsApp"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.486L3 21l4.637-1.216a8.932 8.932 0 0 0 4.413 1.161h.004c4.947 0 8.975-4.027 8.977-8.977a8.922 8.922 0 0 0-2.628-6.335zm-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.74.753-2.753-.178-.283a7.447 7.447 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.348 7.462-7.46 7.462zm4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112-.149.224-.578.73-.709.879-.13.15-.26.168-.485.056-.225-.113-.949-.349-1.808-1.116-.669-.597-1.12-1.335-1.252-1.56-.13-.224-.014-.346.099-.458.101-.1.224-.262.337-.393.112-.13.149-.224.224-.374.075-.15.038-.281-.018-.393-.056-.113-.504-1.217-.691-1.666-.181-.435-.366-.377-.504-.383-.13-.007-.28-.008-.43-.008s-.392.056-.597.28c-.205.225-.784.767-.784 1.87 0 1.102.802 2.17.914 2.321.112.15 1.58 2.411 3.826 3.38.535.23 1.002.39 1.378.51.583.185 1.113.159 1.532.096.467-.07 1.327-.542 1.513-1.066.187-.524.187-.973.131-1.067-.056-.093-.205-.15-.43-.263z"
          fill="#FFF"
        />
      </svg>
    </a>
  );
}
