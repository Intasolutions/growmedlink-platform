import Link from 'next/link';

const GREEN = '#96CA45';
const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#020C1B',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
      fontFamily: FH,
    }}>

      {/* Big 404 number */}
      <div style={{
        fontFamily: FH,
        fontWeight: 900,
        fontSize: 'clamp(100px, 22vw, 220px)',
        lineHeight: 1,
        letterSpacing: '-0.06em',
        color: 'transparent',
        WebkitTextStroke: `2px ${GREEN}`,
        marginBottom: 8,
        userSelect: 'none',
      }}>
        404
      </div>

      {/* Sparkle divider */}
      <svg width={48} height={48} viewBox="0 0 48 48" style={{ marginBottom: 32 }}>
        {(() => {
          const pts: string[] = [];
          for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4 - Math.PI / 2;
            const r = i % 2 === 0 ? 22 : 6;
            pts.push(`${(24 + r * Math.cos(a)).toFixed(2)},${(24 + r * Math.sin(a)).toFixed(2)}`);
          }
          return <polygon points={pts.join(' ')} fill={GREEN} />;
        })()}
      </svg>

      <h1 style={{
        fontFamily: FH,
        fontWeight: 700,
        fontSize: 'clamp(22px, 4vw, 40px)',
        color: '#fff',
        letterSpacing: '-0.03em',
        marginBottom: 16,
      }}>
        Page Not Found
      </h1>

      <p style={{
        fontSize: 'clamp(14px, 2vw, 18px)',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: 440,
        lineHeight: 1.7,
        marginBottom: 48,
      }}>
        The page you&apos;re looking for has been moved, deleted, or never existed.
        Let&apos;s get you back on track.
      </p>

      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: GREEN,
        color: '#020C1B',
        fontFamily: FH,
        fontWeight: 700,
        fontSize: 15,
        padding: '14px 32px',
        borderRadius: 12,
        textDecoration: 'none',
      }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
        Back to Home
      </Link>

    </div>
  );
}
