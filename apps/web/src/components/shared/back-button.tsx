'use client';

import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <Button onClick={handleBack} variant="link" leftIcon={<HugeiconsIcon icon={ArrowLeft02Icon} />}>
      <span>Back</span>
    </Button>
  );
}
