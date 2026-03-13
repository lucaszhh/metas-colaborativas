import type { ReactNode } from "react";
import { Typography } from "@/components/ui/typography";

type GoalListProps = {
  title: string;
  count: number;
  loading: boolean;
  hasSelectedRole: boolean;
  emptyMessage: string;
  children: ReactNode;
};

function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-md bg-muted", className].join(" ")} />;
}

export function GoalList(props: GoalListProps) {
  const { title, count, loading, hasSelectedRole, emptyMessage, children } = props;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Typography
          variant="small"
          as="span"
          className="uppercase tracking-wide text-muted-foreground"
        >
          {title}
        </Typography>
        <Typography
          variant="small"
          as="span"
          className="uppercase tracking-wide text-muted-foreground"
        >
          {count}
        </Typography>
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

      {hasSelectedRole && !loading && count === 0 && (
        <Typography variant="muted">{emptyMessage}</Typography>
      )}
    </div>
  );
}
