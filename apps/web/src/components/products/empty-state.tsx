export function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed py-18 text-center">
      <h3 className="text-lg font-medium">No products yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Set a count and hit Generate to populate the catalog.
      </p>
    </div>
  );
}
