import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode
} from "react";
import { TbMinus, TbPlus, TbRefresh } from "react-icons/tb";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export type ZoomableMediaLabels = {
  region: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
};

type ZoomableMediaProps = {
  children: ReactNode;
  labels: ZoomableMediaLabels;
  resetKey: string;
  className?: string;
  onZoomChange?: (zoom: number) => void;
};

type ViewCenter = { x: number; y: number };

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

function ZoomableMedia({ children, labels, resetKey, className = "", onZoomChange }: ZoomableMediaProps) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [isPanning, setIsPanning] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<ViewCenter | null>(null);
  const panRef = useRef({ pointerId: -1, x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const updateZoom = useCallback((nextZoom: number) => {
    const viewport = viewportRef.current;
    if (viewport?.scrollWidth && viewport.scrollHeight) {
      centerRef.current = {
        x: (viewport.scrollLeft + viewport.clientWidth / 2) / viewport.scrollWidth,
        y: (viewport.scrollTop + viewport.clientHeight / 2) / viewport.scrollHeight
      };
    }
    setZoom(clampZoom(nextZoom));
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const center = centerRef.current;
    if (!viewport || !center) return;

    viewport.scrollLeft = viewport.scrollWidth * center.x - viewport.clientWidth / 2;
    viewport.scrollTop = viewport.scrollHeight * center.y - viewport.clientHeight / 2;
    centerRef.current = null;
  }, [zoom]);

  useEffect(() => {
    setZoom(MIN_ZOOM);
    setIsPanning(false);
    centerRef.current = null;
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollTo({ left: 0, top: 0 });
  }, [resetKey]);

  useEffect(() => {
    onZoomChange?.(zoom);
  }, [onZoomChange, zoom]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      updateZoom(zoom + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [updateZoom, zoom]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom <= MIN_ZOOM || event.button !== 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    panRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop
    };
    viewport.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const pan = panRef.current;
    if (!viewport || !isPanning || event.pointerId !== pan.pointerId) return;

    viewport.scrollLeft = pan.scrollLeft - (event.clientX - pan.x);
    viewport.scrollTop = pan.scrollTop - (event.clientY - pan.y);
  };

  const stopPanning = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== panRef.current.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    panRef.current.pointerId = -1;
    setIsPanning(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      updateZoom(zoom + ZOOM_STEP);
    } else if (event.key === "-") {
      event.preventDefault();
      updateZoom(zoom - ZOOM_STEP);
    } else if (event.key === "0") {
      event.preventDefault();
      updateZoom(MIN_ZOOM);
    }
  };

  const style = {
    "--media-zoom": zoom,
    "--media-zoom-size": `${zoom * 100}%`
  } as CSSProperties;

  return (
    <div className={`zoomable-media${zoom > MIN_ZOOM ? " is-zoomed" : ""}${isPanning ? " is-panning" : ""}${className ? ` ${className}` : ""}`} style={style}>
      <div className="zoomable-media-controls" role="group" aria-label={labels.region}>
        <button type="button" onClick={() => updateZoom(zoom - ZOOM_STEP)} disabled={zoom <= MIN_ZOOM} aria-label={labels.zoomOut} title={labels.zoomOut}>
          <TbMinus aria-hidden="true" />
        </button>
        <button className="zoomable-media-level" type="button" onClick={() => updateZoom(MIN_ZOOM)} disabled={zoom <= MIN_ZOOM} aria-label={`${labels.reset}: ${Math.round(zoom * 100)}%`} title={labels.reset}>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <TbRefresh aria-hidden="true" />
        </button>
        <button type="button" onClick={() => updateZoom(zoom + ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label={labels.zoomIn} title={labels.zoomIn}>
          <TbPlus aria-hidden="true" />
        </button>
      </div>

      <div
        ref={viewportRef}
        className="zoomable-media-viewport"
        tabIndex={0}
        aria-label={labels.region}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        onDoubleClick={() => updateZoom(zoom > MIN_ZOOM ? MIN_ZOOM : 2)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPanning}
        onPointerCancel={stopPanning}
      >
        <div className="zoomable-media-content">{children}</div>
      </div>
    </div>
  );
}

export default ZoomableMedia;
