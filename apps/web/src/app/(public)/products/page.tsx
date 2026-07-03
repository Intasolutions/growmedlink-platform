'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FAQSection from '@/components/FAQSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getProducts } from '@/lib/api/products';
import { IProduct, IMedia, ICategory } from '@intelligen/types';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const FP = "'Power Grotesk','Helvetica Neue',Arial,sans-serif";
const FS = "'Great Day Personal Use','Brush Script MT',cursive";
const GREEN = '#96CA45';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STYLES = `
.prd * { box-sizing: border-box; }
.prd a { text-decoration: none; }
.prd img { display: block; max-width: 100%; }

@keyframes prd-sunburst-spin {
  0%   { transform: translate3d(-50%,-50%,0) rotate(0deg);   }
  100% { transform: translate3d(-50%,-50%,0) rotate(360deg); }
}
@keyframes prd-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1);    }
  50%      { opacity: 1;    transform: scale(1.25); }
}
@keyframes prd-reveal {
  from { opacity: 0; transform: translate3d(0, 24px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0px, 0);  }
}
@keyframes prd-arrow-float {
  0%, 100% { transform: translate3d(0, 0px, 0);  }
  50%      { transform: translate3d(0, -6px, 0); }
}
.prd-rv {
  opacity: 0;
  transform: translateY(38px);
  transition: opacity 0.72s cubic-bezier(.22,.68,0,1.2), transform 0.72s cubic-bezier(.22,.68,0,1.2);
}
.prd-rv.prd-in { opacity: 1; transform: translateY(0); }

.prd-card {
  transition: transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease;
}
.prd-card:hover { transform: translateY(-8px); box-shadow: 0 24px 56px rgba(0,0,0,0.16); }
.prd-card-img { overflow: hidden; }
.prd-card-img-inner { transition: transform 0.55s cubic-bezier(.22,.68,0,1.2); width: 100%; height: 100%; }
.prd-card:hover .prd-card-img-inner { transform: scale(1.06); }
.prd-card-arrow {
  display: inline-flex; align-items: center; justify-content: center;
  transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), background 0.28s ease;
}
.prd-card:hover .prd-card-arrow { transform: rotate(45deg); background: ${GREEN}; }
.prd-card:hover .prd-card-arrow svg path { stroke: #000; }

.prd-pill {
  transition: background 0.25s ease, color 0.25s ease, transform 0.2s ease;
}
.prd-pill:hover { transform: translateY(-2px); }

/* ── hero sunburst: never wider than viewport ── */
.prd-sunburst {
  position: absolute; left: 50%; top: 50%;
  width: min(110vw, 1300px); height: min(110vw, 1300px);
  opacity: 0.5;
  animation: prd-sunburst-spin 80s linear infinite;
  will-change: transform;
  transform: translate3d(-50%,-50%,0) rotate(0deg);
}

@media (prefers-reduced-motion: reduce) {
  .prd-rv { opacity: 1 !important; transform: none !important; transition: none !important; }
  .prd-sunburst { animation: none !important; }
}
`;

interface ProductItem extends IProduct {}

function resolveImage(p: ProductItem): string | null {
  if (p.image && typeof p.image === 'object' && 'secureUrl' in p.image) {
    return (p.image as IMedia).secureUrl;
  }
  if (typeof p.image === 'string') return p.image;
  return null;
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function WaveDots() {
  const dots = [
    { left: 0, top: 29 }, { left: 31, top: 24 }, { left: 60, top: 29 },
    { left: 93, top: 20 }, { left: 131, top: 29 }, { left: 157, top: 13 },
    { left: 192, top: 29 }, { left: 226, top: 6 }, { left: 270, top: 29 },
    { left: 305, top: 0 },
  ];
  return (
    <div style={{ position: 'relative', width: 'min(318px, 80vw)', height: 42, overflow: 'hidden' }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: d.left, top: d.top,
            width: 13, height: 13, borderRadius: '50%', background: GREEN,
            animation: `prd-pulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════ HERO ══════════════════════ */
function HeroSection() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms, transform 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  return (
    <section className="relative bg-[#141414] px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28" style={{ overflow: 'hidden', width: '100%' }}>
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 opacity-20" style={{ background: 'linear-gradient(91deg,#155BA9 10%,#96CA45 82%)' }} />

      {/* Decorative glows */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[450px] rounded-full bg-[#155BA9]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-10 top-20 h-[260px] w-[330px] rounded-full bg-[#96CA45]/20 blur-[90px]" />

      {/* Sunburst — full hero background */}
      <div className="prd-sunburst pointer-events-none">
        <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
      </div>
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="relative mx-auto" style={{ width: 'min(45vw, 480px)', minWidth: 240 }}>
          {/* Handwritten callout + arrow */}
          <div
            className="pointer-events-none absolute -right-8 -top-16 hidden sm:block lg:-right-24 lg:-top-20"
            style={{
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible
                ? 'prd-reveal 0.75s cubic-bezier(.22,.68,0,1.2) 700ms both, prd-arrow-float 2.6s ease-in-out 1.5s infinite'
                : 'none',
            }}
          >
            <span style={{ fontFamily: FS, fontSize: 22, color: GREEN, display: 'block', whiteSpace: 'nowrap' }}>
              Our Featured Products
            </span>
            <Image
              src="/curly-arrow.png"
              alt=""
              width={70}
              height={66}
              style={{ width: 70, height: 'auto', marginTop: 4, marginLeft: -4, transform: 'scaleY(-1)' }}
            />
          </div>

          <h1
            className="relative z-10 text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-[86px]"
            style={{ fontFamily: FH, letterSpacing: '-0.03em', ...fadeUp(100) }}
          >
            Our Products<span style={{ color: GREEN }}>.</span>
          </h1>
        </div>

        <p
          className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base"
          style={fadeUp(260)}
        >
          Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae. Curabitur scelerisque
          nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse
          aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus
          ipsum nec.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3" style={fadeUp(380)}>
          <Image src="/avatars-group.png" alt="Students" width={154} height={27} style={{ height: 27, width: 'auto' }} />
          <span style={{ fontFamily: FP, fontSize: 12, color: '#CACACA' }}>1600 + Trusted Students</span>
        </div>

        <div className="mt-8" style={fadeUp(480)}>
          <a
            href="#products"
            className="inline-flex h-[42px] w-[170px] items-center justify-center rounded-md font-bold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: GREEN, fontFamily: FM, fontSize: 14 }}
          >
            Explore Products
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-4 hidden sm:block lg:left-8">
        <WaveDots />
      </div>
    </section>
  );
}

/* ══════════════════════ BUILT AROUND YOUR NEEDS ══════════════════════ */
const BAN_STYLES = `
.ban-section {
  background: #fff;
  padding: clamp(40px,6vw,88px) clamp(16px,4vw,72px);
  overflow: hidden;
}
.ban-inner { max-width: 1160px; margin: 0 auto; width: 100%; }

.ban-heading {
  font-family: 'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
  font-size: clamp(28px,4vw,52px);
  font-weight: 500;
  color: #252525;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: clamp(32px,5vw,56px);
}

/* rows */
.ban-row1, .ban-row2 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(20px,4vw,52px);
  width: 100%;
}
.ban-row1 { margin-bottom: clamp(36px,6vw,68px); }

/* image 1 — square portrait */
.ban-img1-wrap {
  position: relative;
  flex: 0 0 clamp(180px,28vw,300px);
  max-width: 100%;
}
.ban-img1 {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 16px;
  overflow: hidden;
}

/* image 2 — landscape, shorter than before */
.ban-img2-wrap {
  position: relative;
  flex: 0 0 clamp(240px,44vw,500px);
  max-width: 100%;
}
.ban-img2 {
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 16px;
  overflow: hidden;
}

/* shared image style */
.ban-img1 img, .ban-img2 img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.65s cubic-bezier(.22,.68,0,1.2);
}
.ban-img1:hover img, .ban-img2:hover img { transform: scale(1.05); }

/* text blocks */
.ban-text { flex: 1 1 220px; min-width: 0; }
.ban-text p {
  font-family: 'Power Grotesk','Helvetica Neue',Arial,sans-serif;
  font-size: clamp(13px,1.3vw,16px);
  color: #555;
  line-height: 1.8;
  margin: 0 0 24px 0;
}

/* decorative SVG overlays */
.ban-sparkle {
  position: absolute; top: -20px; right: -18px;
  width: clamp(38px,4vw,54px); height: auto; pointer-events: none;
}
.ban-cap {
  position: absolute; top: -18px; left: -16px;
  width: clamp(48px,5vw,70px); height: auto; pointer-events: none;
}
.ban-scribble {
  position: absolute; top: -18px; right: -16px;
  width: clamp(54px,6vw,80px); height: auto; pointer-events: none;
}

/* CTA */
.ban-cta {
  display: inline-flex; align-items: center; justify-content: center;
  height: 46px; padding: 0 30px; border-radius: 8px;
  background: #96CA45; color: #000;
  font-family: 'Haffer XH Mono-TRIAL','Courier New',monospace;
  font-size: 14px; font-weight: 700; text-decoration: none;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.ban-cta:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(150,202,69,0.35); }

/* scroll-reveal */
.ban-rv {
  opacity: 0; transform: translateY(32px);
  transition: opacity 0.7s cubic-bezier(.22,.68,0,1.2), transform 0.7s cubic-bezier(.22,.68,0,1.2);
}
.ban-rv.ban-in { opacity: 1; transform: translateY(0); }

/* floating animations */
@keyframes ban-float  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(8deg)} }
@keyframes ban-float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-5px) rotate(-6deg)} }
@keyframes ban-float3 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-4px) rotate(5deg)} }
.ban-sparkle { animation: ban-float  3s   ease-in-out       infinite; }
.ban-scribble{ animation: ban-float2 3.5s ease-in-out 0.4s  infinite; }
.ban-cap     { animation: ban-float3 4s   ease-in-out 0.8s  infinite; }

/* ── mobile: stack everything, full width images ── */
@media (max-width: 640px) {
  .ban-img1-wrap, .ban-img2-wrap { flex: 1 1 100%; max-width: 100%; }
  .ban-img1 { aspect-ratio: 4/3; }
  .ban-img2 { aspect-ratio: 16/10; }
  .ban-sparkle  { top: -12px; right: -8px;  width: 36px; }
  .ban-cap      { top: -12px; left: -8px;   width: 44px; }
  .ban-scribble { top: -12px; right: -8px;  width: 48px; }
  .ban-text { flex: 1 1 100%; }
}
@media (max-width: 400px) {
  .ban-sparkle, .ban-cap, .ban-scribble { display: none; }
}
`;

function useBanReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function BuiltAroundYourNeeds() {
  const heading = useBanReveal();
  const row1    = useBanReveal();
  const row2    = useBanReveal();

  return (
    <section className="ban-section">
      <style dangerouslySetInnerHTML={{ __html: BAN_STYLES }} />
      <div className="ban-inner">

        {/* Heading */}
        <div ref={heading.ref} className={`ban-rv ${heading.visible ? 'ban-in' : ''}`}>
          <h2 className="ban-heading">
            Built Around <span style={{ color: GREEN }}>Your Needs</span>
          </h2>
        </div>

        {/* Row 1 */}
        <div
          ref={row1.ref}
          className={`ban-row1 ban-rv ${row1.visible ? 'ban-in' : ''}`}
          style={{ transitionDelay: '0.1s' }}
        >
          {/* Image 1 */}
          <div className="ban-img1-wrap">
            <div className="ban-img1">
              <img src="/product/student-1.jpg" alt="Student with laptop" />
            </div>
            <img src="/product/sparkle.svg" alt="" className="ban-sparkle" />
          </div>

          {/* Text 1 */}
          <div className="ban-text">
            <p>
              We understand that every student&apos;s journey is unique. That&apos;s why GrowMedLink offers
              personalised guidance — from choosing the right university to navigating visa requirements
              and settling in abroad. Our expert advisors work with you one-on-one to map out a plan
              that fits your goals, your timeline, and your budget.
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div
          ref={row2.ref}
          className={`ban-row2 ban-rv ${row2.visible ? 'ban-in' : ''}`}
          style={{ transitionDelay: '0.18s' }}
        >
          {/* Image 2 */}
          <div className="ban-img2-wrap">
            <div className="ban-img2">
              <img src="/product/students-2.jpg" alt="Group of students celebrating" />
            </div>
            <img src="/product/cap.svg"      alt="" className="ban-cap" />
            <img src="/product/scribble.svg" alt="" className="ban-scribble" />
          </div>

          {/* Text 2 + CTA */}
          <div className="ban-text">
            <p>
              From undergraduate admissions to postgraduate research programs, our services cover
              every step of your academic journey. We partner with top institutions worldwide to
              give you access to opportunities that truly match your aspirations.
            </p>
            <a href="/contact" className="ban-cta">Contact Us!</a>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════ FILTER PILLS ══════════════════════ */
interface FilterPillsProps {
  categories: ICategory[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

function FilterPills({ categories, activeCategory, setActiveCategory }: FilterPillsProps) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any, paddingBottom: 4 }}>
      <div className="flex items-center gap-2 px-4 py-10" style={{ width: 'max-content', minWidth: '100%', justifyContent: 'center' }}>
        <button
          onClick={() => setActiveCategory('all')}
          className="prd-pill rounded-full px-6 py-3 text-sm font-semibold transition-all"
          style={{
            fontFamily: FM,
            background: activeCategory === 'all' ? GREEN : '#E4E4E4',
            color: '#252525',
            whiteSpace: 'nowrap',
          }}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className="prd-pill rounded-full px-6 py-3 text-sm font-semibold transition-all"
            style={{
              fontFamily: FM,
              background: activeCategory === cat._id ? GREEN : '#E4E4E4',
              color: '#252525',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ PRODUCT CARD ══════════════════════ */
function ProductCard({ product, delay }: { product: ProductItem; delay: number }) {
  const reveal = useReveal();
  const img = resolveImage(product);

  return (
    <div
      ref={reveal.ref}
      className={`prd-rv ${reveal.visible ? 'prd-in' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <Link href={`/products/${product.slug}`} className="prd-card block rounded-2xl bg-white p-2.5 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        <div className="prd-card-img relative h-[190px] w-full rounded-lg bg-[#eee]">
          <div className="prd-card-img-inner absolute inset-0">
            {img ? (
              <Image src={img} alt={product.name} fill sizes="420px" style={{ objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <div className="h-full w-full rounded-lg bg-[#ddd]" />
            )}
          </div>
        </div>
        <div className="relative px-2 pb-2 pt-4">
          <h3 className="text-lg font-medium text-[#000]" style={{ fontFamily: FM }}>
            {product.name}
          </h3>
          <p
            className="mt-2 max-w-[85%] text-sm leading-relaxed text-[#252525]"
            style={{ fontFamily: FH, letterSpacing: '0.01em', textTransform: 'capitalize' }}
          >
            {product.fees} &middot; {product.duration}
          </p>
          <div className="prd-card-arrow absolute bottom-0 right-0 h-[42px] w-[42px] rounded-lg bg-white shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="m-auto mt-[11px]">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ══════════════════════ PRODUCT GRID ══════════════════════ */
function ProductsGrid({ products }: { products: ProductItem[] }) {
  if (!products.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-24 text-center text-sm text-[#666]">
        No products available in this category yet. Check back soon.
      </div>
    );
  }
  return (
    <section id="products" className="bg-white px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p._id} product={p} delay={(i % 3) * 0.12} />
        ))}
      </div>
    </section>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    // Fetch products
    getProducts()
      .then((data: any) => setProducts(Array.isArray(data) ? data : data?.data ?? []))
      .catch((err: unknown) => console.error('[ProductsPage] Load products error:', err));

    // Fetch categories
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(err => console.error('[ProductsPage] Load categories error:', err));
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => {
        const catId = p.category ? (typeof p.category === 'object' ? (p.category as any)._id : p.category) : '';
        return catId === activeCategory;
      });

  return (
    <main className="prd" style={{ width: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <HeroSection />
      <BuiltAroundYourNeeds />
      <FilterPills
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      <ProductsGrid products={filteredProducts} />
      <FAQSection />
      <WhatsAppButton pageType="products" />
    </main>
  );
}
