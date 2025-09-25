"use client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Sop = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  version: number;
  isActive: boolean;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};
type Category = { id: string; name: string };

const SopsDetailsPage: NextPage = ({}) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Omit<Sop, "id">>({
    title: "",
    content: "",
    categoryId: "",
    version: 1,
    isActive: true,
    createdBy: "",
    createdAt: "",
    updatedAt: "",
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
          createdBy: sopData.createdBy || "",
          createdAt: sopData.createdAt || "",
          updatedAt: sopData.updatedAt || "",
        });
        console.log(sopData);
      } catch (e: any) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const filterCategoryName =
    (categories &&
      categories.find((cat) => cat.id === form.categoryId)?.name) ||
    "";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#EE4D2D]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/sops"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to SOPs</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">SOP Details</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{form?.title}</h1>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              form?.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {form?.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Content */}
        <div className="bg-gray-50 p-5 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
          {form?.content}
        </div>

        {/* Metadata */}
        <div className="border-t pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="font-semibold text-gray-800">Category</dt>
              <dd className="text-gray-600">{filterCategoryName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">Created By</dt>
              <dd className="text-gray-600">{form?.createdBy}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">Created At</dt>
              <dd className="text-gray-600">
                {form?.createdAt && new Date(form?.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">Updated At</dt>
              <dd className="text-gray-600">
                {form?.updatedAt && new Date(form?.updatedAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">Version</dt>
              <dd className="text-gray-600">{form?.version}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default SopsDetailsPage;
