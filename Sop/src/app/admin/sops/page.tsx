"use client";

import { useState, useEffect, Fragment } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface Sop {
  id: string;
  title: string;
  content: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  category: { name: string };
  creator: { name: string };
}

/* ---------- UI helpers ---------- */
function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow">
        {label}
      </span>
    </div>
  );
}

function IconButton({
  color = "slate",
  label,
  onClick,
  href,
  children,
}: {
  color?: "slate" | "orange" | "blue" | "red";
  label: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center h-8 w-8 rounded-md transition";
  const styles: Record<string, string> = {
    slate:
      "bg-slate-50 hover:bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 ring-1 ring-blue-200",
    orange:
      "bg-orange-50 hover:bg-orange-100 text-orange-600 ring-1 ring-orange-200",
    red: "bg-red-50 hover:bg-red-100 text-red-600 ring-1 ring-red-200",
  };
  const cls = `${base} ${styles[color]}`;
  const content = (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={cls}
      >
        {children}
      </button>
    </Tooltip>
  );
  if (href) {
    return (
      <Tooltip label={label}>
        <Link href={href} aria-label={label} className={cls}>
          {children}
        </Link>
      </Tooltip>
    );
  }
  return content;
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 w-72 bg-gray-100 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-8 bg-gray-100 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-14 bg-gray-100 rounded-full animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-8 w-8 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-8 w-8 bg-gray-100 rounded-md animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

/* ---------- Page ---------- */
export default function SopsPage() {
  const [sops, setSops] = useState<Sop[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchSops();
  }, []);

  const fetchSops = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/sops");
      if (res.ok) setSops(await res.json());
    } catch (e) {
      console.error("Failed to fetch SOPs:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setBusyId(id);
      const res = await fetch(`/api/admin/sops`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) await fetchSops();
    } catch (e) {
      console.error("Failed to delete SOP:", e);
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      setBusyId(id);
      const res = await fetch(`/api/admin/sops/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) await fetchSops();
    } catch (e) {
      console.error("Failed to update SOP:", e);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SOP Management</h1>
          <p className="text-gray-600 mt-2">
            Manage standard operating procedures
          </p>
        </div>
        <Link
          href="/admin/sops/new"
          className="inline-flex items-center gap-2 bg-[#EE4D2D] text-white px-4 py-2 rounded-lg hover:bg-[#d63916] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create SOP</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : sops.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-gray-500"
                >
                  No SOPs found. Create one to get started.
                </td>
              </tr>
            ) : (
              sops.map((sop) => (
                <tr key={sop.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 align-top">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {sop.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {sop.content}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sop.category.name}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-gray-900">
                    v{sop.version}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <button
                      onClick={() => toggleActive(sop.id, sop.isActive)}
                      disabled={busyId === sop.id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition
                        ${
                          sop.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                        ${busyId === sop.id ? "opacity-60" : ""}
                      `}
                    >
                      {sop.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-gray-500">
                    {sop.creator.name}
                  </td>

                  {/* Actions column */}
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        label="View"
                        color="blue"
                        href={`/admin/sops/${sop.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </IconButton>

                      <IconButton
                        label="Edit"
                        color="orange"
                        href={`/admin/sops/${sop.id}/edit`}
                      >
                        <Edit className="w-4 h-4" />
                      </IconButton>

                      <IconButton
                        label="Delete"
                        color="red"
                        onClick={() => setConfirmId(sop.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm delete modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900">Delete SOP?</h3>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone. The SOP will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                disabled={busyId === confirmId}
              >
                {busyId === confirmId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
