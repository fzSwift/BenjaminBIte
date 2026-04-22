import { FormEvent, useEffect, useState } from "react";
import api from "../services/api";
import { MenuItem } from "../types";
import { getStoragePathFromPublicUrl, removeMenuImage, uploadMenuImage } from "../services/supabaseStorage";

const emptyForm = { name: "", description: "", price: 0, category: "", image: "", dietaryPreferences: "", available: true };

const AdminMenuManagementPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () => api.get("/menu").then((res) => setItems(res.data));
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      dietaryPreferences: String(form.dietaryPreferences)
        .split(",")
        .map((x: string) => x.trim())
        .filter(Boolean)
    };
    if (editingId) {
      await api.put(`/menu/${editingId}`, payload);
      setMessage("Menu item updated");
    } else {
      await api.post("/menu", payload);
      setMessage("Menu item added");
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item._id);
    setForm({ ...item, dietaryPreferences: item.dietaryPreferences.join(", ") });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const { publicUrl } = await uploadMenuImage(file);
      setForm({ ...form, image: publicUrl });
      setMessage("Image uploaded successfully");
    } catch (error: any) {
      setMessage(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const takeDownImage = async () => {
    if (!form.image) return;
    try {
      const filePath = getStoragePathFromPublicUrl(form.image);
      if (filePath) {
        await removeMenuImage(filePath);
      }
      setForm({ ...form, image: "" });
      setMessage("Image removed");
    } catch (error: any) {
      setMessage(error.message || "Failed to remove image");
    }
  };

  const takeDownItem = async (itemId: string) => {
    await api.put(`/menu/${itemId}`, { available: false });
    setMessage("Item taken down from menu");
    load();
  };

  return (
    <div className="container py-4">
      <h2>Admin Menu Management</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form className="card p-3 mb-3" onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="form-control mb-2"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <input className="form-control mb-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="form-control mb-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <div className="d-flex gap-2 mb-2">
          <input className="form-control" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] || null)} />
          <button className="btn btn-outline-danger" type="button" onClick={takeDownImage} disabled={!form.image}>
            Remove Image
          </button>
        </div>
        {uploading && <small className="text-muted mb-2">Uploading image...</small>}
        <div className="form-check mb-2">
          <input
            id="itemAvailable"
            className="form-check-input"
            type="checkbox"
            checked={Boolean(form.available)}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
          <label htmlFor="itemAvailable" className="form-check-label">
            Item available
          </label>
        </div>
        <input
          className="form-control mb-2"
          placeholder="Dietary Preferences (comma separated)"
          value={form.dietaryPreferences}
          onChange={(e) => setForm({ ...form, dietaryPreferences: e.target.value })}
        />
        <button className="btn btn-dark">{editingId ? "Update Item" : "Add Item"}</button>
      </form>

      {items.map((item) => (
        <div key={item._id} className="card p-3 mb-2">
          {item.image && <img src={item.image} alt={item.name} className="img-fluid rounded mb-2" style={{ maxHeight: "180px", objectFit: "cover" }} />}
          <h6>{item.name}</h6>
          <p className="mb-1 text-muted">{item.description}</p>
          <p className="mb-2">${item.price.toFixed(2)}</p>
          <p className="mb-2">
            <span className={`badge ${item.available ? "bg-success" : "bg-secondary"}`}>{item.available ? "Available" : "Taken Down"}</span>
          </p>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-dark" onClick={() => startEdit(item)}>
              Edit
            </button>
            {item.available && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => takeDownItem(item._id)}>
                Take Down Item
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMenuManagementPage;
