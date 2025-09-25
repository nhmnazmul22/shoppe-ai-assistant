"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

type Category = { id: string; name: string };
type Sop = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  version: number;
  isActive: boolean;
};

export default function EditSopPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Omit<Sop, "id">>({
    title: "",
    content: "",
    categoryId: "",
    version: 1,
    isActive: true,
  });

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        // fetch detail sop
        const sopRes = await fetch(`/api/admin/sops/${id}`);
        if (!sopRes.ok) throw new Error("Failed to load SOP");
        const sopData: Sop & { category?: { name: string } } =
          await sopRes.json();

        // fetch categories
        const catRes = await fetch("/api/admin/categories");
        const catData: Category[] = catRes.ok ? await catRes.json() : [];

        setCategories(catData);
        setForm({
          title: sopData.title || "",
          content: sopData.content || "",
          categoryId: sopData.categoryId || "",
          version: sopData.version || 1,
          isActive: sopData.isActive ?? true,
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const canSave = useMemo(() => {
    return (
      form.title.trim() && form.content.trim() && form.categoryId && !saving
    );
  }, [form, saving]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/sops/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update SOP");
      router.push("/admin/sops");
    } catch (e: any) {
      setError(e?.message || "Failed to update SOP");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#EE4D2D]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/sops"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to SOPs</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit SOP</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2 focus:border-[#EE4D2D] focus:ring-[#EE4D2D] outline-none"
              placeholder="Enter SOP title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryId: e.target.value }))
              }
              className="w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2 focus:border-[#EE4D2D] focus:ring-[#EE4D2D] outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="number"
                min={1}
                value={form.version}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    version: Number(e.target.value || 1),
                  }))
                }
                className="w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2 focus:border-[#EE4D2D] focus:ring-[#EE4D2D] outline-none"
              />
            </div>

            <div className="mt-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 "
                />
                Active
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              rows={14}
              className="w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2 focus:border-[#EE4D2D] focus:ring-[#EE4D2D] outline-none"
              placeholder="Enter detailed SOP instructions..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/sops"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!canSave}
            className="px-4 py-2 rounded-md bg-[#EE4D2D] text-white hover:bg-[#d63916] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
