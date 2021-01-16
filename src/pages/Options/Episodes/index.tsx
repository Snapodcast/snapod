import React from 'react';
import Head from '../../../components/Head';

export default function Episodes() {
  return (
    <div>
      <Head title="Episodes" description="Manage and view episodes" />
      <div className="grid grid-cols-2 gap-x-5">
        <div className="border shadow-sm rounded-md py-5 px-6 hover:bg-headerBorder hover:border-headerBorder hover:bg-opacity-20 cursor-pointer">
          <h2 className="text-lg font-medium tracking-wide">
            EP01: 解构的 2020 之留学杂谈
          </h2>
          <p className="text-sm text-gray-500 tracking-wide mt-2">
            2020
            是特殊的一年，每个国家和社会都经历着多种多样的变革，各行各业也面临着全新的挑战...
          </p>
          <p className="mt-3 flex">
            <span className="pr-2 text-gray-500 text-xs border-r border-gray-200 uppercase">
              2 years ago
            </span>
            <span className="pl-2 text-gray-500 text-xs">43:09</span>
          </p>
        </div>
        <div className="border shadow-sm rounded-md py-5 px-6 hover:bg-headerBorder hover:border-headerBorder hover:bg-opacity-20 cursor-pointer">
          <h2 className="text-lg font-medium tracking-wide">
            EP01: 解构的 2020 之留学杂谈
          </h2>
          <p className="text-sm text-gray-500 tracking-wide mt-2">
            2020
            是特殊的一年，每个国家和社会都经历着多种多样的变革，各行各业也面临着全新的挑战...
          </p>
          <p className="mt-3 flex">
            <span className="pr-2 text-gray-500 text-xs border-r border-gray-200 uppercase">
              2 years ago
            </span>
            <span className="pl-2 text-gray-500 text-xs">43:09</span>
          </p>
        </div>
      </div>
    </div>
  );
}
