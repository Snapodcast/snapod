import React, { useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

const Tooltip = (props: Props) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef<HTMLDivElement>(null);
  const [toolTipShift, setToolTipShift] = useState([0, 0, 0, 0]);

  useEffectOnce(() => {
    if (triggerRef.current !== null && toolTipRef.current !== null) {
      const triggerHeight = triggerRef.current.offsetHeight;
      const triggerWidth = triggerRef.current.offsetWidth;
      const toolTipHeight = toolTipRef.current.offsetHeight;
      const toolTipWidth = toolTipRef.current.offsetWidth;

      switch (props.placement) {
        case 'top':
          setToolTipShift([
            -(triggerHeight + toolTipHeight + 6),
            0,
            0,
            -(toolTipWidth - triggerWidth) / 2,
          ]);
          break;
        case 'left':
          setToolTipShift([
            -((triggerHeight + toolTipHeight) / 2),
            0,
            0,
            -(toolTipWidth + 6),
          ]);
          break;
        case 'right':
          setToolTipShift([
            -((triggerHeight + toolTipHeight) / 2),
            0,
            0,
            triggerWidth + 6,
          ]);
          break;
        default:
          setToolTipShift([6, 0, 0, -(toolTipWidth - triggerWidth) / 2]);
          break;
      }
    }
  });

  return (
    <div className="group">
      <div ref={triggerRef}>{props.children}</div>
      <div
        ref={toolTipRef}
        className="group-hover:z-10 group-hover:opacity-100 absolute opacity-0 bg-black/80 rounded-[4px] text-xs py-[3px] px-2 text-gray-100 shadow-md transition-all delay-1000"
        style={{
          marginTop: toolTipShift[0],
          marginRight: toolTipShift[1],
          marginBottom: toolTipShift[2],
          marginLeft: toolTipShift[3],
        }}
      >
        {props.content}
      </div>
    </div>
  );
};

Tooltip.defaultProps = {
  placement: 'bottom',
};

export default Tooltip;
