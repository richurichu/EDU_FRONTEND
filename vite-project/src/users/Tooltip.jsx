import { Tooltip } from 'flowbite-react';

export default function TooltipWrapper({ content, children }) {
  return (
    <Tooltip content={content}>
      {children}
    </Tooltip>
  )
}
