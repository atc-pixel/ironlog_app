import React, { useState, useRef, useEffect } from "react";

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

export default function WheelPicker({ items, selectedValue, onSelect, label }) {
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const timerRef = useRef(null);
  const containerHeight = ITEM_HEIGHT * VISIBLE_ITEMS;
  const paddingHeight = (containerHeight - ITEM_HEIGHT) / 2;

  const handleScroll = (e) => {
    setIsScrolling(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsScrolling(false);
      const scrollTop = e.target.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      if (index >= 0 && index < items.length) {
        onSelect(items[index]);
        e.target.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" });
      }
    }, 150);
  };

  useEffect(() => {
    if (scrollRef.current && !isScrolling) {
      const index = items.indexOf(selectedValue);
      if (index !== -1) {
        scrollRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: "auto" });
      }
    }
  }, [selectedValue, isScrolling, items]);

  return (
    <div className="flex flex-col items-center w-full relative">
      <div className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">{label}</div>
      <div className="relative w-full overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-inner" style={{ height: containerHeight }}>
        <div className="absolute left-0 right-0 pointer-events-none z-10 border-y border-blue-500/20 bg-blue-500/5" style={{ top: paddingHeight, height: ITEM_HEIGHT }}></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-900/95 via-transparent to-slate-900/95 z-20"></div>
        <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto no-scrollbar touch-pan-y" style={{ scrollBehavior: isScrolling ? "auto" : "smooth" }}>
          <div style={{ height: paddingHeight }}></div>
          {items.map((item) => (
            <div key={item} onClick={() => { onSelect(item); const index = items.indexOf(item); scrollRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" }); }} className="flex items-center justify-center cursor-pointer" style={{ height: ITEM_HEIGHT }}>
              <span className={`transition-all duration-200 antialiased font-mono tracking-tight ${item === selectedValue ? "text-5xl font-black text-white" : "text-xl text-slate-500 font-semibold opacity-30"}`}>{item}</span>
            </div>
          ))}
          <div style={{ height: paddingHeight }}></div>
        </div>
      </div>
    </div>
  );
}