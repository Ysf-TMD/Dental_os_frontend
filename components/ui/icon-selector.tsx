'use client';

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

const iconList = Object.keys(Icons).filter(key => {
  const icon = Icons[key as keyof typeof Icons];
  return typeof icon === 'function' && key !== 'createLucideIcon' && key !== 'default';
});

interface IconSelectorProps {
  value?: string;
  onChange: (icon: string) => void;
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = iconList.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  const iconValue = typeof value === 'string' ? value : '';
  const SelectedIcon = iconValue && typeof iconValue === 'string' && iconValue !== '' ? (Icons as any)[iconValue] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
        >
          {SelectedIcon && typeof SelectedIcon === 'function' && iconValue ? (
            <div className="flex items-center gap-2">
              {React.createElement(SelectedIcon, { className: "size-4" })}
              <span>{iconValue}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Sélectionner une icône</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sélectionner une icône</DialogTitle>
          <DialogDescription>
            Choisissez une icône parmi la collection Lucide
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une icône..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons.map((iconName) => {
                const Icon = (Icons as any)[iconName];
                if (typeof Icon !== 'function') return null;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-center p-2 rounded-md border transition-colors hover:bg-accent ${
                      value === iconName ? 'bg-primary text-primary-foreground border-primary' : 'border-border'
                    }`}
                    title={iconName}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
