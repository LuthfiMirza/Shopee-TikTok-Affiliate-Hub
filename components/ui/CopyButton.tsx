'use client'
import { useState } from 'react'
interface CopyButtonProps { text: string; size?: 'sm' | 'md' }
export function CopyButton({ text, size = 'md' }: CopyButtonProps) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }; return <button type="button" onClick={copy} className={`rounded-lg bg-primary px-3 py-2 font-medium text-white hover:bg-primary-dark ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{copied ? 'Tersalin!' : 'Copy'}</button> }
