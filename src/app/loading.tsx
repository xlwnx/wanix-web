export default function Loading() {
  return (
    <div className="min-h-[100dvh] pt-24 px-4 sm:px-8 pb-16">
      <div className="max-w-[1280px] mx-auto space-y-8">
        <div className="h-[52vh] rounded-[24px] glass skeleton-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 h-64 rounded-[20px] glass skeleton-shimmer" />
          <div className="md:col-span-3 h-64 rounded-[20px] glass skeleton-shimmer" />
          <div className="md:col-span-3 h-64 rounded-[20px] glass skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-[20px] glass skeleton-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
