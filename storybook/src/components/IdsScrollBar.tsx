import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./IdsScrollBar.module.css";

export type ScrollBarType = "vertical" | "horizontal";
export type ScrollThumbPosition = "start" | "middle" | "end";

export interface IdsScrollBarProps {
  type?: ScrollBarType;
  scrollThumb?: ScrollThumbPosition;
  className?: string;
}

function CaretIcon({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  const rotate =
    direction === "up"
      ? 0
      : direction === "down"
      ? 180
      : direction === "left"
      ? -90
      : 90;
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 10 10"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M5 1.5L9.5 8.5H0.5L5 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function positionFromThumb(scrollThumb: ScrollThumbPosition): number {
  switch (scrollThumb) {
    case "middle":
      return 0.5;
    case "end":
      return 1;
    case "start":
    default:
      return 0;
  }
}

const TRAVEL_VERTICAL = 208;
const TRAVEL_HORIZONTAL = 210;
const ARROW_STEP = 0.1;

export function IdsScrollBar({
  type = "vertical",
  scrollThumb = "start",
  className,
}: IdsScrollBarProps) {
  const isVertical = type === "vertical";
  const travel = isVertical ? TRAVEL_VERTICAL : TRAVEL_HORIZONTAL;

  const [position, setPosition] = useState(() => positionFromThumb(scrollThumb));
  useEffect(() => {
    setPosition(positionFromThumb(scrollThumb));
  }, [scrollThumb]);

  const dragRef = useRef<{
    pointerId: number;
    startClient: number;
    startPosition: number;
  } | null>(null);

  const rootClass = [
    styles.root,
    isVertical ? styles.vertical : styles.horizontal,
    className,
  ].join(" ");

  const thumbClass = [styles.thumb, isVertical ? styles.thumbVertical : styles.thumbHorizontal].join(" ");

  const thumbStyle: CSSProperties = isVertical
    ? { top: `${16 + position * travel}px`, left: "2px" }
    : { left: `${16 + position * travel}px`, top: "2px" };

  const decrementDirection = isVertical ? "up" : "left";
  const incrementDirection = isVertical ? "down" : "right";

  const clamp = (value: number) => Math.max(0, Math.min(1, value));

  const moveBy = (delta: number) => setPosition((prev) => clamp(prev + delta));

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startClient: isVertical ? e.clientY : e.clientX,
      startPosition: position,
    };
  };

  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return;
    const currentClient = isVertical ? e.clientY : e.clientX;
    const deltaPx = currentClient - dragRef.current.startClient;
    const deltaPosition = deltaPx / travel;
    setPosition(clamp(dragRef.current.startPosition + deltaPosition));
  };

  const handleThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  return (
    <div
      className={rootClass}
      role="scrollbar"
      aria-orientation={type}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position * 100)}
    >
      <button
        type="button"
        className={styles.button}
        aria-label={isVertical ? "Scroll up" : "Scroll left"}
        onClick={() => moveBy(-ARROW_STEP)}
      >
        <CaretIcon direction={decrementDirection} />
      </button>
      <div className={styles.track} />
      <div
        className={thumbClass}
        style={thumbStyle}
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        onPointerUp={handleThumbPointerUp}
      />
      <button
        type="button"
        className={styles.button}
        aria-label={isVertical ? "Scroll down" : "Scroll right"}
        onClick={() => moveBy(ARROW_STEP)}
      >
        <CaretIcon direction={incrementDirection} />
      </button>
    </div>
  );
}
