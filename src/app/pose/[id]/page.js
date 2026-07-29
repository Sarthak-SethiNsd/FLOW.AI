import React from 'react';
import { notFound } from 'next/navigation';
import { getAsanaById, getAllAsanas } from '@/utils/asanas';
import PoseSelectionClient from './PoseSelectionClient';

export async function generateStaticParams() {
  const asanas = getAllAsanas();
  return asanas.map((asana) => ({
    id: asana.id,
  }));
}

export default async function PoseSelectionPage({ params }) {
  const { id } = await params;
  const asana = getAsanaById(id);

  if (!asana) {
    notFound();
  }

  return <PoseSelectionClient rawAsana={asana} />;
}
