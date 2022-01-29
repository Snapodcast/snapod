import React from 'react';
import { motion } from 'framer-motion';
import { Motion } from '../../constants';

type Props = {
  data: any;
  itemComponent: (item: any, index: number) => JSX.Element;
  placeholderComponent: () => JSX.Element;
};

export default function List(props: Props) {
  return (
    <div className="my-4 mx-5">
      {props.data && props.data.length > 0 ? (
        <div className="mb-5">
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={Motion.LIST.list}
          >
            {props.data.map((item: any, index: number) => (
              <motion.li
                variants={Motion.LIST.item}
                transition={{
                  delay: 0.2 * index,
                  type: 'spring',
                  stiffness: 700,
                  damping: 100,
                }}
              >
                {props.itemComponent(item, index)}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      ) : (
        <div className="flex justify-center error-container items-center">
          {props.placeholderComponent}
        </div>
      )}
    </div>
  );
}
