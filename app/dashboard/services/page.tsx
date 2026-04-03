"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  Stethoscope,
  Plus,
  Loader2,
  Save,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Service } from "@/lib/types";

export default function ServicesPage() {
  const { doctorRecord } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (doctorRecord) fetchServices();
  }, [doctorRecord]);

  const fetchServices = async () => {
    if (!doctorRecord) return;
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("doctor_id", doctorRecord.id)
      .order("name");
    setServices((data || []) as Service[]);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (service: Service) => {
    setName(service.name);
    setDescription(service.description || "");
    setPrice(service.price?.toString() || "");
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorRecord) return;

    setSaving(true);

    const serviceData = {
      doctor_id: doctorRecord.id,
      name: name.trim(),
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
    };

    if (editingId) {
      await supabase.from("services").update(serviceData).eq("id", editingId);
      setSuccess("Service updated!");
    } else {
      await supabase.from("services").insert(serviceData);
      setSuccess("Service added!");
    }

    resetForm();
    await fetchServices();
    setSaving(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    await supabase.from("services").delete().eq("id", id);
    setSuccess("Service deleted");
    await fetchServices();
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage the services you offer to patients
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        )}
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="e.g. General Consultation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="Brief description of the service"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (R)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingId ? "Update" : "Add"} Service
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services list */}
      {services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="card p-4 flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  {service.description && (
                    <p className="text-sm text-gray-500">{service.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {service.price && (
                  <span className="font-bold text-teal-600">
                    R{service.price.toLocaleString()}
                  </span>
                )}
                <button
                  onClick={() => startEdit(service)}
                  className="text-sm text-gray-500 hover:text-teal-600 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <Stethoscope className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">
            No services added yet. Add your first service to show patients what
            you offer.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-sm inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Your First Service
            </button>
          )}
        </div>
      )}
    </div>
  );
}