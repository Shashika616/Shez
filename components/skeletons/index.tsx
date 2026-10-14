import Skeleton from "../ui/Skeleton";

/**
 * Loading placeholders that mirror the real layouts box for box,
 * so nothing jumps when the content arrives.
 */

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="bg-cream pb-28 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]" role="status" aria-label="Loading the collection">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="mt-6 h-[14vw] w-[80%] md:h-[7.5vw] md:w-[70%]" />
          </div>
          <div className="space-y-3 md:col-span-4">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between gap-4 py-3">
          <div className="flex gap-2 overflow-hidden">
            {[64, 150, 110, 84, 118, 92].map((w, i) => (
              <Skeleton key={i} className="h-10 shrink-0 !rounded-full" style={{ width: w }} />
            ))}
          </div>
          <Skeleton className="hidden h-11 w-48 shrink-0 !rounded-full md:block" />
        </div>
        <Skeleton className="mt-6 h-7 w-44 md:mt-8" />
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-16 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-cream pb-32 md:pb-24" role="status" aria-label="Loading product">
      <div className="md:grid md:grid-cols-12 md:gap-10 md:px-[var(--gutter)] md:pt-[calc(var(--header-h)+1.5rem)]">
        <div className="md:col-span-7">
          <div className="md:grid md:grid-cols-2 md:gap-3">
            <Skeleton className="aspect-[3/4] w-full md:col-span-2 md:aspect-[4/5]" />
            <Skeleton className="hidden aspect-[3/4] w-full md:block" />
            <Skeleton className="hidden aspect-[3/4] w-full md:block" />
          </div>
        </div>
        <div className="container-x pt-8 md:col-span-5 md:px-0 md:pt-0">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-6 h-[11vw] w-4/5 md:h-[3.8vw]" />
          <Skeleton className="mt-3 h-[11vw] w-1/2 md:h-[3.8vw]" />
          <Skeleton className="mt-5 h-4 w-40" />
          <Skeleton className="mt-6 h-9 w-36" />
          <Skeleton className="mt-6 h-4 w-full max-w-md" />
          <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />
          <Skeleton className="mt-8 h-3 w-28" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-12 !rounded-full" />
            ))}
          </div>
          <div className="mt-7 flex gap-3">
            <Skeleton className="h-14 w-[118px] !rounded-full" />
            <Skeleton className="h-14 flex-1 !rounded-full" />
          </div>
          <Skeleton className="mt-3 h-14 w-full !rounded-full" />
          <div className="mt-6 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-11 !rounded-xl" />
            ))}
          </div>
          <div className="mt-8 space-y-5 border-t border-ink/10 pt-5">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-3 w-32" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="bg-cream pb-20 pt-[calc(var(--header-h)+1.5rem)] md:pt-[calc(var(--header-h)+3rem)]" role="status" aria-label="Loading checkout">
      <div className="container-x">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-[12vw] w-2/3 md:h-[5vw] md:w-[38%]" />
        <Skeleton className="mt-6 h-[72px] w-full !rounded-[20px] md:hidden" />
        <div className="mt-8 grid gap-12 md:mt-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-3 h-6 w-64" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["", "", "sm:col-span-2", "sm:col-span-2", "", ""].map((span, i) => (
                <Skeleton key={i} className={`h-[58px] !rounded-2xl ${span}`} />
              ))}
            </div>
            <Skeleton className="mt-12 h-3 w-24" />
            <Skeleton className="mt-3 h-6 w-56" />
            <div className="mt-6 grid gap-3">
              <Skeleton className="h-[92px] !rounded-[20px]" />
              <Skeleton className="h-[92px] !rounded-[20px]" />
            </div>
            <Skeleton className="mt-10 h-[60px] w-full !rounded-full" />
          </div>
          <div className="hidden md:col-span-4 md:col-start-9 md:block">
            <div className="rounded-[24px] bg-ivory p-7">
              <Skeleton className="h-3 w-24" />
              {[0, 1].map((i) => (
                <div key={i} className="mt-6 flex items-center gap-4">
                  <Skeleton className="h-20 w-16 !rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
              <div className="mt-6 space-y-3 border-t border-ink/10 pt-5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="mt-2 h-8 w-1/2 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
