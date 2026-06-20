import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';

// ─── Shared WhatsApp-style Photo Adjuster Component ──────────────────────────
// Reusable across Signup, Settings, or anywhere else that needs a circular crop.
// Renders via React Portal directly to document.body so it ALWAYS centers in
// the viewport — bypassing any transformed ancestor (like PageWrapper or
// framer-motion animations) that would otherwise trap position:fixed.
// ────────────────────────────────────────────────────────────────────────────
const CONTAINER_W = 360;
const CONTAINER_H = 360;
const CROP_SIZE = 280;
const CIRCLE_R = CROP_SIZE / 2;
const CIRCLE_CX = CONTAINER_W / 2;
const CIRCLE_CY = CONTAINER_H / 2;

const PhotoAdjuster = ({ imageSrc, originalFile, onConfirm, onCancel }) => {
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ mx: 0, my: 0, ix: 0, iy: 0 });

  const clamp = useCallback((x, y, s) => {
    const iw = imgNatural.w * s;
    const ih = imgNatural.h * s;
    const clampedX = Math.min(CIRCLE_CX - CIRCLE_R, Math.max(CIRCLE_CX + CIRCLE_R - iw, x));
    const clampedY = Math.min(CIRCLE_CY - CIRCLE_R, Math.max(CIRCLE_CY + CIRCLE_R - ih, y));
    return { x: clampedX, y: clampedY };
  }, [imgNatural]);

  const onImgLoad = useCallback((e) => {
    const nw = e.target.naturalWidth;
    const nh = e.target.naturalHeight;
    const minFit = Math.max(CROP_SIZE / nw, CROP_SIZE / nh);
    setImgNatural({ w: nw, h: nh });
    setScale(minFit);
    setPos({
      x: (CONTAINER_W - nw * minFit) / 2,
      y: (CONTAINER_H - nh * minFit) / 2
    });
  }, []);

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragOrigin.current = { mx: e.clientX, my: e.clientY, ix: pos.x, iy: pos.y };
  };
  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    const nx = dragOrigin.current.ix + (e.clientX - dragOrigin.current.mx);
    const ny = dragOrigin.current.iy + (e.clientY - dragOrigin.current.my);
    setPos(clamp(nx, ny, scale));
  }, [dragging, scale, clamp]);
  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    setDragging(true);
    dragOrigin.current = { mx: t.clientX, my: t.clientY, ix: pos.x, iy: pos.y };
  };
  const onTouchMove = useCallback((e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const nx = dragOrigin.current.ix + (t.clientX - dragOrigin.current.mx);
    const ny = dragOrigin.current.iy + (t.clientY - dragOrigin.current.my);
    setPos(clamp(nx, ny, scale));
  }, [dragging, scale, clamp]);

  const applyZoom = useCallback((delta) => {
    setScale(prev => {
      const minS = imgNatural.w && imgNatural.h
        ? Math.max(CROP_SIZE / imgNatural.w, CROP_SIZE / imgNatural.h)
        : 0.1;
      const next = Math.min(4, Math.max(minS, prev + delta));
      setPos(p => clamp(p.x, p.y, next));
      return next;
    });
  }, [imgNatural, clamp]);

  const onWheel = (e) => { e.preventDefault(); applyZoom(e.deltaY < 0 ? 0.06 : -0.06); };

  const handleConfirm = () => {
    const OUT = 400;
    const canvas = document.createElement('canvas');
    canvas.width = OUT; canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const srcX = (CIRCLE_CX - CIRCLE_R - pos.x) / scale;
      const srcY = (CIRCLE_CY - CIRCLE_R - pos.y) / scale;
      const srcW = CROP_SIZE / scale;
      const srcH = CROP_SIZE / scale;
      ctx.beginPath();
      ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUT, OUT);
      canvas.toBlob((blob) => {
        onConfirm(new File([blob], originalFile.name, { type: 'image/png' }), URL.createObjectURL(blob));
      }, 'image/png');
    };
    img.src = imageSrc;
  };

  const iw = imgNatural.w * scale;
  const ih = imgNatural.h * scale;
  const minScale = imgNatural.w && imgNatural.h
    ? Math.max(CROP_SIZE / imgNatural.w, CROP_SIZE / imgNatural.h)
    : 0.1;

  const modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.93)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, backdropFilter: 'blur(8px)'
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>
            Adjust Photo
          </h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>
            Drag · Pinch · Scroll to zoom
          </p>
        </div>

        <div
          style={{
            width: CONTAINER_W, height: CONTAINER_H,
            position: 'relative', overflow: 'hidden',
            borderRadius: '14px', background: '#0a0a0a',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none', userSelect: 'none',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08)'
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
          onWheel={onWheel}
        >
          <img
            src={imageSrc}
            alt="adjust"
            onLoad={onImgLoad}
            draggable={false}
            style={{
              position: 'absolute',
              left: pos.x, top: pos.y,
              width: iw, height: ih,
              userSelect: 'none', pointerEvents: 'none'
            }}
          />
          <svg
            width={CONTAINER_W}
            height={CONTAINER_H}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            <defs>
              <mask id="paCircleMask">
                <rect width={CONTAINER_W} height={CONTAINER_H} fill="white" />
                <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill="black" />
              </mask>
            </defs>
            <rect width={CONTAINER_W} height={CONTAINER_H} fill="rgba(0,0,0,0.55)" mask="url(#paCircleMask)" />
            <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: CONTAINER_W }}>
          <button
            type="button"
            onClick={() => applyZoom(-0.1)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '8px', padding: '8px', cursor: 'pointer',
              color: 'white', display: 'flex', alignItems: 'center', flexShrink: 0
            }}
          >
            <ZoomOut size={17} />
          </button>
          <input
            type="range"
            min={minScale}
            max={4}
            step={0.01}
            value={scale}
            onChange={(e) => {
              const next = parseFloat(e.target.value);
              setScale(next);
              setPos(p => clamp(p.x, p.y, next));
            }}
            style={{ flex: 1, accentColor: '#6366f1', cursor: 'pointer' }}
          />
          <button
            type="button"
            onClick={() => applyZoom(0.1)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '8px', padding: '8px', cursor: 'pointer',
              color: 'white', display: 'flex', alignItems: 'center', flexShrink: 0
            }}
          >
            <ZoomIn size={17} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: CONTAINER_W }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', cursor: 'pointer',
              fontSize: '0.95rem', fontWeight: '700',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
            }}
          >
            Use Photo
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  //  Render through a portal to document.body. This escapes any transformed
  //    ancestor (PageWrapper, framer-motion containers, etc.) so position:fixed
  //    is anchored to the actual viewport — not to a parent's coordinate system.
  return createPortal(modal, document.body);
};

export default PhotoAdjuster;