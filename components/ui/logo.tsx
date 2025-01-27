"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      width="277"
      height="55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-auto", className)}
      viewBox="0 0 277 55"
      {...props}
    >
      <g clipPath="url(#mentum-logo__a)" fill="currentColor">
        <path d="M0 15.02v-.04L20.73.57l20.732 14.41v.04L20.73 29.43 0 15.02Zm41.462 0v-.04L62.192.57l20.732 14.41v.04L62.193 29.43 41.462 15.02Z" />
        <path d="M20.73 29.431 41.463 15.02v24.96L20.73 54.391v-24.96Zm41.463 0 20.73-14.411v24.96l-20.73 14.411v-24.96Zm49.388 7.922V15.436h4.477l6.36 17.227h.062l6.391-17.227h4.477v21.917h-3.334V20.34h-.062l-6.083 17.013h-2.809l-6.083-17.013h-.062v17.013h-3.334Zm32.934 0V15.436h15.624v2.912h-12.227v6.223h10.714v2.912h-10.714v6.958h12.535v2.912h-15.932Zm25.909 0V15.436h3.891l10.25 16.859h.062v-16.86h3.427v21.918h-3.89l-10.282-16.86h-.061v16.86h-3.397Zm34.208 0V18.348h-7.133v-2.912h17.692v2.912h-7.132v19.005h-3.427Zm28.453.429c-6.052 0-8.614-3.157-8.614-7.878V15.436h3.396v14.468c0 3.402 1.729 4.966 5.218 4.966 3.52 0 5.218-1.563 5.218-4.966V15.436h3.427v14.468c0 4.72-2.563 7.878-8.645 7.878Zm19.68-.43V15.437h4.477l6.361 17.227h.061l6.392-17.227h4.477v21.917h-3.335V20.34h-.062l-6.082 17.013h-2.81l-6.083-17.013h-.061v17.013h-3.335Z" />
      </g>
      <defs>
        <clipPath id="mentum-logo__a">
          <path fill="#fff" d="M0 0h277v55H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="auto"
      fill="none"
      viewBox="-5 -5 200 130"
      className={className}
    >
      <path
        fill="currentColor"
        d="M0 33v-.09L47 0l47 32.91V33L47 65.91zm94 0v-.09L141 0l47 32.91V33l-47 32.91z"
      />
      <path
        fill="currentColor"
        d="M47 65.91 94 33v57l-47 32.91zm94 0L188 33v57l-47 32.91z"
      />
    </svg>
  )
}
