/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

export const Input = (props: {
  name: string;
  placeholder: string;
  [prop: string]: any;
}) => {
  const { name, placeholder, ...rest } = props;
  return (
    <div>
      <span className="flex items-center">
        <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
          {name}
        </em>
      </span>
      <input
        placeholder={placeholder}
        {...rest}
        className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 dark:bg-transparent dark:text-gray-300 dark:border-gray-500 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
      />
    </div>
  );
};

export const TextArea = (props: {
  name: string;
  placeholder: string;
  [prop: string]: any;
}) => {
  const { name, placeholder, ...rest } = props;
  return (
    <div>
      <span className="flex items-center">
        <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
          {name}
        </em>
      </span>
      <textarea
        placeholder={placeholder}
        maxLength={255}
        minLength={1}
        rows={3}
        {...rest}
        className="mt-1 tracking-wide  focus:outline-none dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
      />
    </div>
  );
};
