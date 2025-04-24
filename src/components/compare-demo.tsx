import React from "react";
import { Compare } from "@/components/ui/compare";

export default function CompareDemo() {
  return (
    <div className="p-4 border rounded-3xl bg-neutral-200/60 dark:bg-neutral-800/60 border-neutral-300 dark:border-neutral-700 px-4">
      <Compare
        firstImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000"
        secondImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000"
        firstImageClassName="object-cover object-center"
        secondImageClassname="object-cover object-center"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
} 