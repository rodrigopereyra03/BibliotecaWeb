import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export default function CameraQRScannerModal({
  isOpen,
  onClose,
  onScan,
  pendingReservations = [],
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameId = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [scannedCode, setScannedCode] = useState('');

  // Beep sound on QR detection using Web Audio API
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // Ignore audio failure
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async (mode = facingMode) => {
    stopCamera();
    setCameraError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Tu navegador o dispositivo no soporta acceso a la cámara web.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permiso denegado: Por favor habilita el permiso de cámara en tu navegador para escanear pases QR.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No se encontró ninguna cámara conectada en este equipo.');
      } else {
        setCameraError('No se pudo iniciar la cámara (' + (err.message || 'error desconocido') + '). Podés seleccionar el pase manualmente.');
      }
      setCameraActive(false);
    }
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(scanFrame);
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          playBeep();
          setScannedCode(code.data);
          stopCamera();
          onScan(code.data);
          onClose();
          return;
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-marble-border shadow-2xl flex flex-col text-left overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 pb-3 bg-parchment-surface border-b border-marble-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished shadow-xs">
              <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            </div>
            <div>
              <h4 className="font-bold font-display text-base text-sepia-heading leading-tight">
                Escáner de Pase QR en Vivo
              </h4>
              <p className="text-[11px] text-warm-charcoal">
                Apunte la cámara al pase digital del lector para validarlo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-warm-charcoal hover:text-sepia-heading hover:bg-parchment-card transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="p-5 flex flex-col gap-4">
          <div className="relative w-full h-64 sm:h-72 bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner border border-stone-800">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Hidden canvas for QR decoding */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Animated Laser Scanline (Active while camera is streaming) */}
            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
                {/* Viewfinder Target Frame with Gold Corners */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  {/* Top-left corner */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold-accent rounded-tl-lg"></div>
                  {/* Top-right corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold-accent rounded-tr-lg"></div>
                  {/* Bottom-left corner */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold-accent rounded-bl-lg"></div>
                  {/* Bottom-right corner */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold-accent rounded-br-lg"></div>

                  {/* Laser scan line animation */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent shadow-[0_0_12px_#d4af37] animate-pulse"></div>
                </div>

                <span className="mt-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide border border-white/10 shadow-xs">
                  Buscando código QR en pantalla...
                </span>
              </div>
            )}

            {/* Camera Loading or Inactive fallback state */}
            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-300">
                <span className="material-symbols-outlined text-4xl text-gold-burnished animate-spin">
                  progress_activity
                </span>
                <span className="text-xs">Iniciando cámara del dispositivo...</span>
              </div>
            )}

            {/* Camera Error Message */}
            {cameraError && (
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center gap-3 bg-stone-900/95 text-white">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-2xl">no_photography</span>
                </div>
                <p className="text-xs text-stone-200 max-w-xs leading-relaxed">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-1.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Reintentar Acceso a Cámara
                </button>
              </div>
            )}
          </div>

          {/* Quick Selection: Pending Reservations List for Testing / Fast Retrieval */}
          {pendingReservations && pendingReservations.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-warm-charcoal uppercase tracking-wider">
                O seleccione un pase activo en espera ({pendingReservations.length}):
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {pendingReservations.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => {
                      playBeep();
                      stopCamera();
                      onScan(res.reservation_code || res.id.toString());
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl bg-parchment-surface hover:bg-gold-light/40 border border-marble-border transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-sepia-heading truncate">
                        {res.book_title || res.book?.title || 'Libro reservado'}
                      </p>
                      <p className="text-[10px] text-warm-charcoal truncate">
                        {res.user_name || 'Socio Lector'} · <span className="font-mono text-gold-burnished font-bold">{res.reservation_code}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gold-burnished group-hover:translate-x-0.5 transition-transform shrink-0">
                      Cargar Orden →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-marble-border">
            <button
              type="button"
              onClick={() => {
                const nextMode = facingMode === 'environment' ? 'user' : 'environment';
                setFacingMode(nextMode);
                startCamera(nextMode);
              }}
              disabled={!cameraActive}
              className="px-3 py-2 rounded-xl bg-parchment-surface hover:bg-parchment-card border border-marble-border text-xs font-semibold text-warm-charcoal flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-base text-gold-burnished">cameraswitch</span>
              <span>Cambiar Cámara</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Cerrar Escáner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
