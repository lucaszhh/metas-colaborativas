import type { ReactNode } from "react";

type GoalListProps = {
  title: string;
  count: number;
  loading: boolean;
  hasSelectedList: boolean;
  emptyMessage: string;
  children: ReactNode;
};

function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-md bg-muted", className].join(" ")} />;
}

export function GoalList(props: GoalListProps) {
  const { title, count, loading, hasSelectedList, emptyMessage, children } = props;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>{title}</span>
        <span>{count}</span>
      </div>

      {loading ? (
        <>
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </>
      ) : (
        children
      )}

      {hasSelectedList && !loading && count === 0 && (
        <div className="text-sm text-muted-foreground">{emptyMessage}</div>
      )}
    </div>
  );
}
