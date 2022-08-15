import { ButtonHTMLAttributes } from 'react'

export default function ActionButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { children, ...rest } = props

  return (
    <button
      {...rest}
      className="focus:ring-black-500 inline-flex items-center rounded-md border border-gray-900 
      bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-50 hover:text-gray-900 
      focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {props.children}
    </button>
  )
}
