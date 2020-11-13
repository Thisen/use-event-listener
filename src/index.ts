import { useRef, useEffect } from "react";

type ElementType = Document | Window | HTMLElement | null;

type EventMap<T extends ElementType> = T extends Window
  ? WindowEventMap
  : T extends Document
  ? DocumentEventMap
  : T extends HTMLElement | null
  ? HTMLElementEventMap
  : never;

export function useEventListener(
  eventName: keyof EventMap<typeof element>,
  listener: EventMap<typeof element>[keyof EventMap<typeof element>],
  element: ElementType = window
) {
  const savedListener = useRef(listener);

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      if (element?.addEventListener) {
        const eventListener = (event: Event) => (savedListener.current as any)?.(event);
        
        element.addEventListener(eventName, eventListener);
        return () => {
          element.removeEventListener(eventName, eventListener);
        };
      }
      return;
    },
    [eventName, element]
  );
}
