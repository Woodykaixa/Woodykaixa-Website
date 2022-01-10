import { useState } from 'react';
import { throttle } from 'lodash';

export function useThrottledInput(initialValue: string, wait?: number) {
  const [content, _setContent] = useState(initialValue);
  const setContent = throttle(_setContent, wait, {
    trailing: true,
  });

  return [content, setContent] as const;
}
