import React from 'react';
import { notFound } from 'next/navigation';
import { getAsanaById } from '@/utils/asanas';
import PracticeClient from './PracticeClient';

export default async function PracticePage({ params }) {
  const { id } = await params;
  const asana = getAsanaById(id);

  if (!asana) {
    notFound();
  }

  return <PracticeClient asana={asana} />;
}
