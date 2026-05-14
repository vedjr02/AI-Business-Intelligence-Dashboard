"use client";

import { useCallback, useState } from "react";
import { mockStreamAnswer } from "@/lib/mockData";
import { isApiConfigured } from "@/lib/api";

export interface QueryTurn {
  id: string;
  question: string;
  answer: string;
  status: "streaming" | "done" | "error";
}

/**
 * Streams AI answers via same-origin `/api/bi/query` when the backend is enabled,
 * otherwise uses the local mock streamer.
 */
export function useAIQuery(datasetId: string) {
  const [history, setHistory] = useState<QueryTurn[]>([]);
  const [isStreaming, setStreaming] = useState(false);

  const ask = useCallback(
    async (question: string) => {
      const id = Math.random().toString(36).slice(2);
      const turn: QueryTurn = { id, question, answer: "", status: "streaming" };
      setHistory((h) => [...h, turn]);
      setStreaming(true);

      const streamFromMock = async () => {
        let acc = "";
        for await (const chunk of mockStreamAnswer(question)) {
          acc += chunk;
          setHistory((h) =>
            h.map((t) => (t.id === id ? { ...t, answer: acc } : t))
          );
        }
      };

      try {
        if (isApiConfigured()) {
          const res = await fetch("/api/bi/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_id: datasetId, question }),
          });

          if (res.status === 404) {
            await streamFromMock();
          } else if (!res.ok) {
            const errText = await res.text().catch(() => "");
            throw new Error(errText || `Request failed (${res.status})`);
          } else if (!res.body) {
            throw new Error("Empty response");
          } else {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let acc = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              acc += chunk;
              setHistory((h) =>
                h.map((t) => (t.id === id ? { ...t, answer: acc } : t))
              );
            }
          }
        } else {
          await streamFromMock();
        }

        setHistory((h) =>
          h.map((t) => (t.id === id ? { ...t, status: "done" } : t))
        );
      } catch (err) {
        setHistory((h) =>
          h.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "error",
                  answer:
                    err instanceof Error && err.message
                      ? `Couldn't reach the AI service: ${err.message}`
                      : "Couldn't reach the AI service. Please try again.",
                }
              : t
          )
        );
      } finally {
        setStreaming(false);
      }
    },
    [datasetId]
  );

  return { history, ask, isStreaming };
}
