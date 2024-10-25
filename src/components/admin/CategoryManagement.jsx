import React, { useState } from 'react';
import { useVideos } from '../../contexts/VideoContext';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const { videos } = useVideos();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Nature', subcategories: ['Landscapes', 'Wildlife'], order: 1 },
    { id: 2, name: 'Urban', subcategories: ['Cities', 'Architecture'], order: 2 },
    { id: 3, name: 'Technology', subcategories: ['AI', 'Digital'], order: 3 }
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    subcategories: []
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...newCategory, id: cat.id, order: cat.order } : cat
      ));
      toast.success('Category updated successfully');
    } else {
      const maxOrder = Math.max(...categories.map(cat => cat.order), 0);
      setCategories([...categories, { 
        ...newCategory, 
        id: Date.now(),
        order: maxOrder + 1
      }]);
      toast.success('Category added successfully');
    }

    setNewCategory({ name: '', subcategories: [] });
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({ ...category });
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) {
      toast.error('Subcategory name is required');
      return;
    }

    if (newCategory.subcategories.includes(newSubcategory.trim())) {
      toast.error('Subcategory already exists');
      return;
    }

    setNewCategory({
      ...newCategory,
      subcategories: [...newCategory.subcategories, newSubcategory.trim()]
    });
    setNewSubcategory('');
    toast.success('Subcategory added');
  };

  const handleRemoveSubcategory = (index) => {
    setNewCategory({
      ...newCategory,
      subcategories: newCategory.subcategories.filter((_, i) => i !== index)
    });
    toast.success('Subcategory removed');
  };

  const moveCategory = (categoryId, direction) => {
    const category = categories.find(cat => cat.id === categoryId);
    const otherCategory = categories.find(cat => 
      direction === 'up' ? cat.order === category.order - 1 : cat.order === category.order + 1
    );

    if (otherCategory) {
      setCategories(categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, order: otherCategory.order };
        }
        if (cat.id === otherCategory.id) {
          return { ...cat, order: category.order };
        }
        return cat;
      }));
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Category Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Category Name"
              id="categoryName"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Subcategories</label>
              <div className="flex gap-2">
                <Input
                  id="subcategory"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="Add subcategory"
                />
                <Button type="button" onClick={handleAddSubcategory}>
                  <FaPlus className="mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {newCategory.subcategories?.map((sub, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <span className="text-gray-200">{sub}</span>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => handleRemoveSubcategory(index)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              {editingCategory && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategory({ name: '', subcategories: [] });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Categories List</h3>
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <div key={category.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-white">{category.name}</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => moveCategory(category.id, 'up')}
                      disabled={category.order === 1}
                    >
                      <FaArrowUp />
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => moveCategory(category.id, 'down')}
                      disabled={category.order === categories.length}
                    >
                      <FaArrowDown />
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEdit(category)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(category.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  {category.subcategories?.map((sub, index) => (
                    <div key={index} className="text-gray-300 bg-gray-600 px-2 py-1 rounded text-sm">
                      {sub}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {videos.filter(v => v.category === category.name).length} videos in this category
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CategoryManagement;