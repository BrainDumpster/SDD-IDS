/**
 * Lib-local ScrollArea primitives (Base UI–compatible surface for IDS dropdowns).
 * Overlay scrollbar so option rows keep full width. No @base-ui-components.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface ScrollAreaContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
  overflowY: boolean;
  thumbHeight: number;
  thumbTop: number;
  setScrollTopFromThumb: (thumbTop: number) => void;
  orientation: "vertical" | "horizontal";
}

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);

function useScrollArea(): ScrollAreaContextValue {
  const ctx = useContext(ScrollAreaContext);
  if (!ctx) throw new Error("ScrollArea parts must be used within ScrollArea.Root");
  return ctx;
}

export interface ScrollAreaRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function ScrollAreaRoot({ children, className, style, ...rest }: ScrollAreaRootProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [overflowY, setOverflowY] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const { clientHeight, scrollHeight, scrollTop } = vp;
    const hasOverflow = scrollHeight > clientHeight + 1;
    setOverflowY(hasOverflow);
    if (!hasOverflow) {
      setThumbHeight(0);
      setThumbTop(0);
      return;
    }
    const track = Math.max(clientHeight - 4, 1);
    const nextThumb = Math.max((clientHeight / scrollHeight) * track, 16);
    const maxTop = track - nextThumb;
    const nextTop =
      scrollHeight === clientHeight
        ? 0
        : (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setThumbHeight(nextThumb);
    setThumbTop(nextTop);
  }, []);

  const setScrollTopFromThumb = useCallback((nextThumbTop: number) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const { clientHeight, scrollHeight } = vp;
    const track = Math.max(clientHeight - 4, 1);
    const thumb = Math.max((clientHeight / scrollHeight) * track, 16);
    const maxTop = track - thumb;
    const ratio = maxTop <= 0 ? 0 : nextThumbTop / maxTop;
    vp.scrollTop = ratio * (scrollHeight - clientHeight);
  }, []);

  useEffect(() => {
    measure();
    const vp = viewportRef.current;
    if (!vp) return;
    const onScroll = () => measure();
    vp.addEventListener("scroll", onScroll, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(vp);
    if (vp.firstElementChild) ro?.observe(vp.firstElementChild);
    return () => {
      vp.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [measure, children]);

  const value = useMemo<ScrollAreaContextValue>(
    () => ({
      viewportRef,
      rootRef,
      overflowY,
      thumbHeight,
      thumbTop,
      setScrollTopFromThumb,
      orientation: "vertical",
    }),
    [overflowY, thumbHeight, thumbTop, setScrollTopFromThumb],
  );

  return (
    <ScrollAreaContext.Provider value={value}>
      <div
        {...rest}
        ref={rootRef}
        className={className}
        style={{ position: "relative", ...style }}
        data-overflow-y={overflowY ? "" : undefined}
      >
        {children}
      </div>
    </ScrollAreaContext.Provider>
  );
}

export interface ScrollAreaViewportProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function ScrollAreaViewport({
  children,
  className,
  style,
  ...rest
}: ScrollAreaViewportProps) {
  const { viewportRef } = useScrollArea();
  return (
    <div
      {...rest}
      ref={viewportRef}
      className={className}
      style={style}
      data-ids-scroll-viewport=""
    >
      {children}
    </div>
  );
}

export interface ScrollAreaScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  orientation?: "vertical" | "horizontal";
}

function ScrollAreaScrollbar({
  children,
  className,
  style,
  orientation = "vertical",
  ...rest
}: ScrollAreaScrollbarProps) {
  const { overflowY } = useScrollArea();
  if (orientation === "vertical" && !overflowY) return null;
  if (orientation === "horizontal") return null;

  return (
    <div
      {...rest}
      className={className}
      style={style}
      data-orientation={orientation}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export interface ScrollAreaThumbProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function ScrollAreaThumb({ className, style, ...rest }: ScrollAreaThumbProps) {
  const { thumbHeight, thumbTop, setScrollTopFromThumb, overflowY } = useScrollArea();
  const dragging = useRef(false);
  const startY = useRef(0);
  const startTop = useRef(0);

  if (!overflowY) return null;

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    startY.current = event.clientY;
    startTop.current = thumbTop;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const delta = event.clientY - startY.current;
    setScrollTopFromThumb(Math.max(0, startTop.current + delta));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  };

  const thumbStyle: CSSProperties = {
    height: thumbHeight,
    transform: `translateY(${thumbTop}px)`,
    ...style,
  };

  return (
    <div
      {...rest}
      className={className}
      style={thumbStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
};

export default ScrollArea;
