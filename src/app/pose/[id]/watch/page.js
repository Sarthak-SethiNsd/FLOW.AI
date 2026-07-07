import React from 'react';
import { notFound } from 'next/navigation';
import { getAsanaById } from '@/utils/asanas';
import WatchClient from './WatchClient';

export default async function WatchPage({ params }) {
  const { id } = await params;
  const asana = getAsanaById(id);

  if (!asana) {
    notFound();
  }

  return <WatchClient asana={asana} />;
}
