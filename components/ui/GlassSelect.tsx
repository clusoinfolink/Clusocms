'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface GlassSelectProps {
  label?: string;
  error?: string;
  name?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: any) => void;
  className?: string;
  showIcons?: boolean;
}

export function GlassSelect({ label, error, name, options, value, onChange, className = '', showIcons = false, ...props }: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    if (onChange) {
      onChange({ target: { name, value: val } });
    }
    setIsOpen(false);
  };

  const renderIcon = (iconName: string) => {
    if (!showIcons) return null;
    if (!iconName) return <div className="w-4 h-4 mr-2 shrink-0" />;
    
    const Icon = (LucideIcons as any)[iconName];
    if (Icon) {
      return <Icon size={16} className="mr-2 text-gray-500 shrink-0" />;
    }
    return <div className="w-4 h-4 mr-2 shrink-0" />;
  };

  return (
    <div className={`w-full relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div
        className={`w-full flex items-center justify-between bg-white/80 border rounded-xl px-4 py-2.5 text-gray-900 cursor-pointer focus:outline-none ring-offset-0 focus:ring-2 focus:ring-cluso-mid/50 transition-all text-sm ${error ? 'border-red-400' : 'border-gray-200'} ${isOpen ? 'ring-2 ring-cluso-mid/50' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center">
          {renderIcon(selectedOption?.value || '')}
          <span className={!selectedOption && !value ? 'text-gray-400' : 'text-gray-900'}>
            {selectedOption ? selectedOption.label : 'Select an option'}
          </span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`flex items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${value === opt.value ? 'bg-blue-50/50 font-medium text-blue-700' : 'text-gray-700'}`}
              onClick={() => handleSelect(opt.value)}
            >
              {renderIcon(opt.value)}
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}