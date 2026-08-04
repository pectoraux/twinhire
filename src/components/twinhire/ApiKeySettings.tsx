"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Key,
  KeyRound,
  Loader2,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * ApiKeySettings — guided onboarding for bring-your-own API keys.
 *
 * The vision: "Allow businesses to bring API keys, choose routing policies,
 * create model ensembles." Each user can add keys for different AI providers.
 * The LLM client uses the user's keys when available, falling back to the
 * platform pool.
 */

interface ApiKey {
  id: string;
  provider: string;
  keyValue: string; // masked
  isActive: boolean;
  label: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
}

const PROVIDERS = [
  {
    key: "zai",
    name: "Z.ai",
    desc: "Platform's default — GLM models",
    placeholder: "20f9b7a4... your Z.ai API key",
    docsUrl: "https://z.ai/manage-apikey/apikey-list",
    color: "oklch(0.52 0.11 165)",
    recommended: true,
  },
  {
    key: "openai",
    name: "OpenAI",
    desc: "GPT-4o, o1, o3-mini",
    placeholder: "sk-proj-... your OpenAI API key",
    docsUrl: "https://platform.openai.com/api-keys",
    color: "oklch(0.6 0.09 200)",
    recommended: false,
  },
  {
    key: "anthropic",
    name: "Anthropic",
    desc: "Claude 3.5 Sonnet, Opus",
    placeholder: "sk-ant-... your Anthropic API key",
    docsUrl: "https://console.anthropic.com/settings/keys",
    color: "oklch(0.62 0.16 350)",
    recommended: false,
  },
  {
    key: "gemini",
    name: "Google Gemini",
    desc: "Gemini 2.0 Flash, Pro",
    placeholder: "AIza... your Google AI key",
    docsUrl: "https://aistudio.google.com/app/apikey",
    color: "oklch(0.74 0.135 70)",
    recommended: false,
  },
  {
    key: "deepseek",
    name: "DeepSeek",
    desc: "DeepSeek-V3, R1",
    placeholder: "sk-... your DeepSeek API key",
    docsUrl: "https://platform.deepseek.com/api_keys",
    color: "oklch(0.68 0.13 140)",
    recommended: false,
  },
  {
    key: "groq",
    name: "Groq",
    desc: "Ultra-fast inference",
    placeholder: "gsk_... your Groq API key",
    docsUrl: "https://console.groq.com/keys",
    color: "oklch(0.72 0.12 165)",
    recommended: false,
  },
];

export function ApiKeySettings({ onClose }: { onClose: () => void }) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingProvider, setAddingProvider] = useState<string | null>(null);
  const [ keyValue, setKeyValue] = useState("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/api-keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async (provider: string) => {
    if (!keyValue.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, keyValue, label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      setAddingProvider(null);
      setKeyValue("");
      setLabel("");
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/user/api-keys/${id}`, { method: "DELETE" });
      void load();
    } catch {
      // silent
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/user/api-keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      void load();
    } catch {
      // silent
    }
  };

  const activeCount = keys.filter((k) => k.isActive).length;
  const hasKey = (provider: string) => keys.some((k) => k.provider === provider);

  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              <Key className="h-3 w-3" /> Settings
            </span>
            <h1 className="mt-3 font-display text-3xl">AI provider keys</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Bring your own API keys to power simulations, evaluations, and recommendations.
              Your keys are used in preference to the platform pool.
            </p>
          </div>
          <Button variant="outline" onClick={onClose} className="h-10 gap-1.5 rounded-full">
            <X className="h-4 w-4" /> Close
          </Button>
        </div>

        {/* Status banner */}
        <div className={cn(
          "mt-6 flex items-center gap-3 rounded-2xl border p-4",
          activeCount > 0
            ? "border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]"
            : "border-amber-200/60 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-500/[0.06]",
        )}>
          <span className={cn(
            "grid h-9 w-9 place-items-center rounded-full",
            activeCount > 0 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
          )}>
            {activeCount > 0 ? <CheckCircle2 className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {activeCount > 0
                ? `${activeCount} key${activeCount === 1 ? "" : "s"} active — your simulations use your keys.`
                : "No keys configured — using the platform pool."}
            </p>
            <p className="text-xs text-muted-foreground">
              {activeCount > 0
                ? "Add more providers for redundancy and model choice."
                : "Add at least one key to unlock the full simulation experience."}
            </p>
          </div>
        </div>

        {/* Provider grid */}
        <div className="mt-6 space-y-3">
          {PROVIDERS.map((provider, i) => {
            const existingKey = keys.find((k) => k.provider === provider.key);
            const isAdding = addingProvider === provider.key;
            return (
              <motion.div
                key={provider.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card"
              >
                {/* Provider row */}
                <div className="flex items-center gap-3 p-4">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white text-xs font-bold"
                    style={{ background: provider.color }}
                  >
                    {provider.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{provider.name}</span>
                      {provider.recommended && (
                        <Badge variant="outline" className="rounded-md text-[10px] border-primary/30 text-primary">
                          recommended
                        </Badge>
                      )}
                      {existingKey && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-md text-[10px]",
                            existingKey.isActive
                              ? "border-emerald-200 text-emerald-700 dark:border-emerald-500/20 dark:text-emerald-300"
                              : "text-muted-foreground",
                          )}
                        >
                          {existingKey.isActive ? "active" : "inactive"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{provider.desc}</p>
                    {existingKey && (
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{existingKey.keyValue}</p>
                    )}
                  </div>
                  {existingKey ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggle(existingKey.id, existingKey.isActive)}
                        className="h-8 rounded-full text-xs"
                      >
                        {existingKey.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAddingProvider(isAdding ? null : provider.key)}
                        className="h-8 rounded-full text-xs"
                      >
                        Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(existingKey.id)}
                        className="h-8 w-8 rounded-full p-0 text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setAddingProvider(isAdding ? null : provider.key)}
                      className="h-8 gap-1.5 rounded-full"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add key
                    </Button>
                  )}
                </div>

                {/* Add/replace form */}
                <AnimatePresence>
                  {isAdding && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border/40"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Shield className="h-3.5 w-3.5" />
                          Keys are stored securely and never exposed to other users.
                          <a
                            href={provider.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            Get a key →
                          </a>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Input
                            type="password"
                            placeholder={provider.placeholder}
                            value={keyValue}
                            onChange={(e) => setKeyValue(e.target.value)}
                            className="h-10 rounded-xl font-mono text-sm"
                          />
                          <Input
                            type="text"
                            placeholder="Label (optional, e.g. 'work account')"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="h-10 rounded-xl text-sm"
                          />
                        </div>
                        {error && (
                          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>
                        )}
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            onClick={() => handleSave(provider.key)}
                            disabled={!keyValue.trim() || saving}
                            className="h-9 gap-1.5 rounded-full"
                          >
                            {saving ? (
                              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
                            ) : (
                              <><CheckCircle2 className="h-3.5 w-3.5" /> Save key</>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setAddingProvider(null);
                              setKeyValue("");
                              setLabel("");
                              setError("");
                            }}
                            className="h-9 rounded-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 rounded-2xl border border-border/50 bg-secondary/20 p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">How your keys are used</p>
              <p className="mt-1">
                When you start a simulation, the system checks for your active keys in priority
                order. If none are configured, it falls back to the platform pool. Your keys are
                used for: work task generation, performance evaluation, and hiring recommendations.
              </p>
              <p className="mt-2">
                <Zap className="mr-1 inline h-3 w-3" />
                Provider-agnostic: future providers slot in without architectural changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
