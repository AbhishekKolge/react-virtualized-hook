import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

type VirtualScrollProps = {
  optionHeight: number;
  selectHeight: number;
  visibilitySize: number;
  bufferSize: number;
  initialStart: number;
};

const DEFAULT_BUFFER_SIZE = 0;
const DEFAULT_INITIAL_START = 0;

const useVirtualScroll = (props: VirtualScrollProps) => {
  const {
    optionHeight,
    selectHeight,
    visibilitySize,
    bufferSize = DEFAULT_BUFFER_SIZE,
    initialStart = DEFAULT_INITIAL_START,
  } = props;
  const [itemSlice, setItemSlice] = useState({
    start: initialStart,
    end: visibilitySize + bufferSize,
  });
  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);

  const resetItemSlice = useCallback(() => {
    setItemSlice({
      start: initialStart,
      end: visibilitySize + bufferSize,
    });
  }, [visibilitySize, bufferSize]);

  const scrollHandler = useCallback(() => {
    if (!listNode) return;

    const { scrollTop } = listNode;
    const start = Math.max(
      initialStart,
      Math.floor(scrollTop / optionHeight) - bufferSize,
    );
    const end = start + Math.ceil(selectHeight + bufferSize);
    setItemSlice({
      start,
      end,
    });
  }, [bufferSize, optionHeight, selectHeight, listNode]);

  useEffect(() => {
    if (listNode) {
      listNode.addEventListener('scroll', scrollHandler);
      return () => {
        listNode.removeEventListener('scroll', scrollHandler);
      };
    }
  }, [scrollHandler, listNode]);

  return { itemSlice, setListNode, resetItemSlice };
};

useVirtualScroll.PropTypes = {
  optionHeight: PropTypes.number.isRequired,
  selectHeight: PropTypes.number.isRequired,
  visibilitySize: PropTypes.number.isRequired,
  bufferSize: PropTypes.number,
  initialStart: PropTypes.number,
};

export default useVirtualScroll;
