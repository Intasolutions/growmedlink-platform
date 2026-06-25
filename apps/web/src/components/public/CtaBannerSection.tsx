'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './CtaBannerSection.module.css';

/* ── Download icon SVG ── */
function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Downward arrow shaft */}
      <path
        d="M7.5 1.5 V9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Downward arrow head */}
      <path
        d="M4.5 6.5 L7.5 9.5 L10.5 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Horizontal base line */}
      <path
        d="M2.5 12.5 H12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
export default function CTABanner() {
  const [animate, setAnimate] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect(); // Fire only once
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDownload = () => {
    window.open('/brochure.pdf', '_blank');
  };

  const handleContact = () => {
    window.location.href = '/contact';
  };

  return (
    <div className={styles.section}>
      <div
        ref={cardRef}
        className={`${styles.card} ${animate ? styles.animateIn : ''}`}
      >
        {/* ── Left: green panel ── */}
        <div className={styles.green}>

          {/* Grayscale support-agent image at bottom-left */}
          <div className={styles.imgWrap}>
            <Image
              src="/cta-agent.png"
              alt="Support agent at laptop"
              width={215}
              height={230}
              style={{
                objectFit: 'contain',
                objectPosition: 'bottom center',
                filter: 'grayscale(100%)',
                width: '100%',
                height: 'auto',
              }}
              priority
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.opacity = '0';
              }}
            />
          </div>

          {/* Paragraph text */}
          <div className={styles.textArea}>
            <p className={styles.text}>
              Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae. Curabitur
              Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est
              Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis.
            </p>
          </div>

        </div>

        {/* ── Right: dark panel with buttons ── */}
        <div className={styles.dark}>

          {/* Download Brochure — outlined, monospace */}
          <button
            onClick={handleDownload}
            className={styles.btnDl}
            type="button"
          >
            <DownloadIcon />
            Download Brochure
          </button>

          {/* Contact Now! — solid green */}
          <button
            onClick={handleContact}
            className={styles.btnContact}
            type="button"
          >
            Contact Now!
          </button>

        </div>
      </div>
    </div>
  );
}
