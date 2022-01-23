import { Tag, Input, message } from 'antd';
import { useState, useRef, useMemo, useEffect } from 'react';
import { useThrottledInput } from '@/util/hooks';
import { PlusOutlined } from '@ant-design/icons';
import { uniq } from 'lodash';
import { AntdControlledProps } from '.';

export type KeywordEditorProps = AntdControlledProps<string[]>;

export const KeywordEditor = ({ value, onChange }: KeywordEditorProps) => {
  const changeValue = useMemo(() => onChange!, []);
  const [tags, setTags] = useState<string[]>([]);
  useEffect(() => {
    setTags(uniq(value ?? []));
  }, [value]);

  useEffect(() => {
    if (!value) {
      changeValue([]);
    }
  });
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<Input>(null);
  const [inputValue, setInputValue] = useThrottledInput('');
  const addTag = () => {
    if (inputValue.length === 0) {
      setShowInput(false);
      return;
    }
    if (tags.includes(inputValue)) {
      message.info(`${inputValue} 已存在`);
      return;
    }
    const newTags = [...tags, inputValue];
    setTags(newTags);
    changeValue(newTags);
    setShowInput(false);
    setInputValue('');
  };
  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    changeValue(newTags);
  };
  return (
    <div className='flex'>
      {tags.map(v => (
        <Tag key={v} closable onClose={e => removeTag(v)} className='select-none flex items-center'>
          {v}
        </Tag>
      ))}
      {!showInput && (
        <Tag
          className='border-dashed bg-white flex items-center'
          onClick={() => {
            Promise.resolve(setShowInput(true)).then(() => inputRef.current?.focus());
            // setShowInput(true);
            // inputRef.current?.focus();
          }}
        >
          <PlusOutlined /> New
        </Tag>
      )}
      {showInput && (
        <Input
          size='small'
          className='mr-2 align-top w-20'
          ref={inputRef}
          onBlur={addTag}
          value={inputValue}
          onPressEnter={addTag}
          onChange={e => setInputValue(e.target.value)}
        ></Input>
      )}
    </div>
  );
};
