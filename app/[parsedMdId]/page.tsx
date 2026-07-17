'use client';

import { useParams } from 'next/navigation';
import { useMd } from '../context/MdContext';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function ParsedMdPage() {
  const { parsedMds } = useMd();
  const { parsedMdId } = useParams();
  const entry = parsedMds[parsedMdId as string];

  if (!entry) {
    return <p className="md-not-found">Document not found</p>;
  }

  return <MarkdownRenderer ast={entry.ast} />;
}
