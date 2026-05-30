"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";

export function ApiStatusBanner() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/bi/health")
      .then((r) => setOk(r.ok))
      .catch(() => setOk(false));
  }, []);

  if (ok === null) return null;
  return (
    <div className="flex justify-center py-2">
      <Badge variant={ok ? "green" : "amber"} size="sm">
        {ok ? "API connected" : "API offline — uploads may fail"}
      </Badge>
    </div>
  );
}
