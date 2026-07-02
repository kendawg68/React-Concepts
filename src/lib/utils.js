import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn = "class names".
 * A tiny helper used all over the UI. It:
 *   1. lets you pass conditional classes  ->  clsx('a', isOpen && 'b')
 *   2. resolves Tailwind conflicts sanely ->  twMerge('p-2', 'p-4') === 'p-4'
 *
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
