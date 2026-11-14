"use client";

import React, { useState } from "react";
import { X, Copy, Check, Download, FileCode, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportModalProps {
  isOpen: boolean;
  pgn: string;
  json: string;
  roundNumber: number;
  onClose: () => void;
}

export function ExportModal({
  isOpen,
  pgn,
  json,
  roundNumber,
  onClose,
}: ExportModalProps) {
  const [format, setFormat] = useState<"pgn" | "json">("pgn");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeContent = format === "pgn" ? pgn : json;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
    }
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], {
      type: format === "pgn" ? "text/plain;charset=utf-8" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zerosum-round-${roundNumber}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3
              id="export-modal-title"
              className="text-sm font-semibold text-slate-900"
            >
              Export Match PGN / JSON
            </h3>
            <p className="text-[11px] text-slate-400">
              Round #{roundNumber} portable notation and structured telemetry
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Format Switcher */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 mb-3">
            <button
              type="button"
              onClick={() => setFormat("pgn")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                format === "pgn"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Match PGN
            </button>
            <button
              type="button"
              onClick={() => setFormat("json")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                format === "json"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              JSON Telemetry
            </button>
          </div>

          <pre className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-[11px] font-mono text-slate-700 overflow-x-auto max-h-64 leading-relaxed">
            {activeContent}
          </pre>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy {format.toUpperCase()}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-3.5 h-3.5" />
              Download .{format}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

