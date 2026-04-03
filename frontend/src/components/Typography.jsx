import { twMerge } from 'tailwind-merge';

export function Heading({ as: Tag = 'h2', size = '3xl', className, children, ...props }) {
  const sizeMap = {
    '7xl': 'text-7xl font-extrabold leading-10',
    '6xl': 'text-6xl font-extrabold leading-10',
    '5xl': 'text-5xl font-bold      leading-8',
    '4xl': 'text-4xl font-bold      leading-8',
    '3xl': 'text-3xl font-bold      leading-6',
    '2xl': 'text-2xl font-bold      leading-6',
    'xl':  'text-xl  font-bold      leading-4',
  };

  return (
    <Tag
      className={twMerge('text-white', sizeMap[size] ?? sizeMap['3xl'], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Text({ size = 'base', muted = false, className, children, ...props }) {
  const sizeMap = {
    lg:   'text-lg leading-4',
    base: 'text-base leading-4',
    sm:   'text-sm leading-2',
    xs:   'text-xs leading-2',
  };

  return (
    <p
      className={twMerge(
        sizeMap[size] ?? sizeMap['base'],
        muted ? 'text-gray-400' : 'text-gray-100',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Label({ size = 'sm', className, children, ...props }) {
  return (
    <span
      className={twMerge(
        size === 'xs' ? 'text-xs' : 'text-sm',
        'font-medium text-gray-300',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
