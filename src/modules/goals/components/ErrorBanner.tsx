import { Typography } from "@/components/ui/typography";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
      <Typography variant="small" as="p" className="text-destructive">
        {message}
      </Typography>
    </div>
  );
}
