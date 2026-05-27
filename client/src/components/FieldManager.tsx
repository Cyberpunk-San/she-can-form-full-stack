import React, { useState } from 'react';
import api from '../services/api';
import { FormField } from '../types';
import toast from 'react-hot-toast';

interface FieldManagerProps {
  fields: FormField[];
  onFieldsUpdate: () => void;
}

const FieldManager: React.FC<FieldManagerProps> = ({ fields, onFieldsUpdate }) => {
  const [newField, setNewField] = useState<Partial<FormField>>({ type: 'text', required: false });
  const [editingField, setEditingField] = useState<FormField | null>(null);

  const handleAddField = async () => {
    if (!newField.fieldName || !newField.label) {
      toast.error('Field name and label are required');
      return;
    }

    try {
      await api.post('/form-fields', newField);
      toast.success('Field added successfully!');
      setNewField({ type: 'text', required: false });
      onFieldsUpdate();
    } catch (error) {
      toast.error('Failed to add field');
    }
  };

  const handleUpdateField = async () => {
    if (!editingField) return;

    try {
      await api.put(`/form-fields/${editingField._id}`, editingField);
      toast.success('Field updated successfully!');
      setEditingField(null);
      onFieldsUpdate();
    } catch (error) {
      toast.error('Failed to update field');
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return;

    try {
      await api.delete(`/form-fields/${id}`);
      toast.success('Field deleted successfully!');
      onFieldsUpdate();
    } catch (error) {
      toast.error('Failed to delete field');
    }
  };

  return (
    <div className="bg-white border-2 border-indie-dark p-6 md:p-8 indie-shadow relative">
      {/* Offset dotted decorative outline frame */}
      <div className="absolute -inset-1.5 border-2 border-dotted border-indie-clay/40 pointer-events-none z-0 rounded-sm" />

      <div className="border-b-2 border-dashed border-indie-dark/20 pb-4 mb-6 relative z-10">
        <h2 className="font-serif-indie text-2xl font-bold text-indie-dark">Manage Form Fields</h2>
        <p className="font-serif-indie italic text-xs text-neutral-500">Configure the dynamic inputs collected in the solidarity form.</p>
      </div>

      {/* Add New Field Section */}
      <div className="border-b-2 border-dashed border-indie-dark/10 pb-6 mb-6 relative z-10">
        <h3 className="font-mono-indie text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-4">
          Add New Field
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex flex-col space-y-1">
            <label className="font-mono-indie text-[9px] tracking-wider uppercase font-bold text-neutral-400">Field ID / Name</label>
            <input
              type="text"
              placeholder="e.g., age"
              className="border-2 border-indie-dark bg-indie-bg/30 px-3 py-2 font-sans text-xs focus:outline-none focus:bg-white focus:border-indie-blue transition-all"
              value={newField.fieldName || ''}
              onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-mono-indie text-[9px] tracking-wider uppercase font-bold text-neutral-400">Display Label</label>
            <input
              type="text"
              placeholder="e.g., Your Age"
              className="border-2 border-indie-dark bg-indie-bg/30 px-3 py-2 font-sans text-xs focus:outline-none focus:bg-white focus:border-indie-blue transition-all"
              value={newField.label || ''}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-mono-indie text-[9px] tracking-wider uppercase font-bold text-neutral-400">Input Type</label>
            <select
              className="border-2 border-indie-dark bg-indie-bg/30 px-3 py-2.5 font-mono-indie text-xs focus:outline-none focus:bg-white focus:border-indie-blue transition-all"
              value={newField.type || 'text'}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="textarea">Textarea</option>
              <option value="number">Number</option>
              <option value="tel">Phone</option>
              <option value="date">Date</option>
            </select>
          </div>
          <div className="flex items-end gap-4 h-full pt-4 md:pt-0">
            <label className="font-mono-indie text-[10px] uppercase tracking-wider font-bold text-neutral-500 flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 accent-indie-terracotta border-2 border-indie-dark"
                checked={newField.required || false}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              />
              Required
            </label>
            <button 
              onClick={handleAddField} 
              className="flex-1 bg-indie-terracotta hover:bg-indie-clay text-white font-mono-indie text-xs tracking-widest uppercase font-bold py-2 border-2 border-indie-dark transition-all duration-200 indie-shadow-sm indie-shadow-active"
            >
              Add Field
            </button>
          </div>
        </div>
      </div>

      {/* Existing Fields List */}
      <div className="space-y-4 relative z-10">
        <h3 className="font-mono-indie text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-2">
          Current Form Layout
        </h3>
        {fields.map((field) => (
          <div 
            key={field._id} 
            className="p-4 bg-white border-2 border-indie-dark/15 hover:border-indie-dark/40 transition-colors"
          >
            {editingField?._id === field._id ? (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px] flex flex-col space-y-1">
                  <label className="font-mono-indie text-[9px] uppercase tracking-wider font-bold text-neutral-400">Label</label>
                  <input
                    type="text"
                    value={editingField.label}
                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                    className="border-2 border-indie-dark px-3 py-1.5 text-xs focus:outline-none focus:border-indie-blue"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-mono-indie text-[9px] uppercase tracking-wider font-bold text-neutral-400">Type</label>
                  <select
                    value={editingField.type}
                    onChange={(e) => setEditingField({ ...editingField, type: e.target.value })}
                    className="border-2 border-indie-dark px-3 py-2 text-xs font-mono-indie focus:outline-none focus:border-indie-blue"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="textarea">Textarea</option>
                    <option value="number">Number</option>
                    <option value="tel">Phone</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <label className="font-mono-indie text-[10px] uppercase tracking-wider font-bold text-neutral-500 flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingField.required}
                      onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                      className="accent-indie-terracotta"
                    />
                    Required
                  </label>
                  <label className="font-mono-indie text-[10px] uppercase tracking-wider font-bold text-neutral-500 flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingField.isActive}
                      onChange={(e) => setEditingField({ ...editingField, isActive: e.target.checked })}
                      className="accent-indie-terracotta"
                    />
                    Active
                  </label>
                </div>
                <div className="flex gap-2 pt-4 ml-auto">
                  <button 
                    onClick={handleUpdateField} 
                    className="bg-indie-dark hover:bg-neutral-800 text-white font-mono-indie text-xs tracking-wider uppercase px-3 py-1.5 border border-indie-dark"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingField(null)} 
                    className="bg-white hover:bg-neutral-100 text-neutral-500 font-mono-indie text-xs tracking-wider uppercase px-3 py-1.5 border border-neutral-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="text-left">
                  <p className="font-serif-indie text-base font-bold text-indie-dark">{field.label}</p>
                  <p className="font-mono-indie text-[9px] uppercase tracking-wider text-neutral-400 mt-1">
                    key: <span className="text-neutral-600">{field.fieldName}</span> • type: <span className="text-neutral-600">{field.type}</span> • required: <span className="text-neutral-600">{field.required ? 'yes' : 'no'}</span> • status: <span className={field.isActive ? 'text-green-600 font-bold' : 'text-red-500'}>{field.isActive ? 'active' : 'inactive'}</span>
                  </p>
                </div>
                <div className="flex gap-3 mt-2 sm:mt-0">
                  <button 
                    onClick={() => setEditingField(field)} 
                    className="font-mono-indie text-[10px] sm:text-xs tracking-wider uppercase border border-indie-dark hover:bg-indie-dark hover:text-white px-2.5 py-1.5 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteField(field._id)} 
                    className="font-mono-indie text-[10px] sm:text-xs tracking-wider uppercase border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-2.5 py-1.5 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldManager;