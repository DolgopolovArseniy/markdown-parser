'use client';

import { DocumentNode } from '@/lib/parser/types';
import { createContext, ReactNode, useContext, useState } from 'react';

type ParsedMd = {
  fileName: string;
  ast: DocumentNode;
};

type ParsedMds = Record<string, ParsedMd>;

type MdContextType = {
  parsedMds: ParsedMds;
  addParsedMd: (id: string, newParsedMd: ParsedMd) => void;
};

const MdContext = createContext<MdContextType | null>(null);

export function MdProvider({ children }: { children: ReactNode }) {
  const [parsedMds, setParsedMds] = useState<ParsedMds>({});

  function addParsedMd(id: string, newParsedMd: ParsedMd) {
    setParsedMds((prev) => ({ ...prev, [id]: newParsedMd }));
  }

  return (
    <MdContext.Provider value={{ parsedMds, addParsedMd }}>
      {children}
    </MdContext.Provider>
  );
}

export function useMd() {
  const context = useContext(MdContext);
  if (!context) throw new Error('useMd must be used within MdProvider');
  return context;
}
