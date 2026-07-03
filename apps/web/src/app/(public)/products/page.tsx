'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FAQSection from '@/components/FAQSection';
import { getProducts } from '@/lib/api/products';
import { IProduct, IMedia, ICategory } from '@intelligen/types';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const FP = "'Power Grotesk','Helvetica Neue',Arial,sans-serif";
const FS = "'Great Day Personal Use','Brush Script MT',cursive";
const GREEN = '#96CA45';
const DARK = '#252525';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STYLES = `
.prd * { box-sizing: border-box; }
.prd a { text-decoration: none; }
.prd img { display: block; }

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

@media (prefers-reduced-motion: reduce) {
  .prd-rv { opacity: 1 !important; transform: none !important; transition: none !important; }
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
    <div style={{ position: 'relative', width: 318, height: 42 }}>
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
    <section className="relative overflow-hidden bg-[#141414] px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 opacity-20" style={{ background: 'linear-gradient(91deg,#155BA9 10%,#96CA45 82%)' }} />

      {/* Decorative glows */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[450px] rounded-full bg-[#155BA9]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-10 top-20 h-[260px] w-[330px] rounded-full bg-[#96CA45]/20 blur-[90px]" />

      {/* Sunburst — full hero background */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: 'clamp(700px, 110vw, 1300px)', height: 'clamp(700px, 110vw, 1300px)', opacity: 0.5,
          animation: 'prd-sunburst-spin 80s linear infinite',
          willChange: 'transform',
        }}
      >
        <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
      </div>
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="relative mx-auto" style={{ width: 'clamp(280px, 45vw, 480px)' }}>
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

/* ══════════════════════ FILTER PILLS ══════════════════════ */
interface FilterPillsProps {
  categories: ICategory[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

function FilterPills({ categories, activeCategory, setActiveCategory }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-10">
      <button
        onClick={() => setActiveCategory('all')}
        className="prd-pill rounded-full px-6 py-3 text-sm font-semibold transition-all"
        style={{
          fontFamily: FM,
          background: activeCategory === 'all' ? GREEN : '#E4E4E4',
          color: '#252525',
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
          }}
        >
          {cat.name}
        </button>
      ))}
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
    <main className="prd">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <HeroSection />
      <FilterPills 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      <ProductsGrid products={filteredProducts} />
      <FAQSection />
    </main>
  );
}
