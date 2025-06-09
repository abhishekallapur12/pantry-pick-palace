
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    unit: '',
    inStock: true,
    quantity: 0,
    description: '',
    image: '/placeholder.svg'
  });

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Snacks', 'Beverages'];
  
  // Sample grocery images for different categories
  const groceryImages = {
    'Fruits': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop',
    'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop',
    'Dairy': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop',
    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
    'Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop',
    'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop',
    'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop'
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.unit || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Auto-set grocery image based on category if no image provided
    if (!formData.image || formData.image === '/placeholder.svg') {
      formData.image = groceryImages[formData.category as keyof typeof groceryImages] || '/placeholder.svg';
    }

    if (editingId) {
      updateProduct(editingId, formData);
      setEditingId(null);
    } else {
      addProduct(formData as Product);
      setShowAddForm(false);
    }
    
    setFormData({
      name: '',
      price: 0,
      category: '',
      unit: '',
      inStock: true,
      quantity: 0,
      description: '',
      image: '/placeholder.svg'
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      price: 0,
      category: '',
      unit: '',
      inStock: true,
      quantity: 0,
      description: '',
      image: '/placeholder.svg'
    });
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  const ProductForm = () => (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              placeholder="e.g., per kg, per piece"
            />
          </div>
          <div>
            <Label htmlFor="quantity">Available Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Image URL or leave blank for auto-selection"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Product description"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {editingId ? 'Update' : 'Add'} Product
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products</h2>
        {!showAddForm && !editingId && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {(showAddForm || editingId) && <ProductForm />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="animate-fade-in">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      disabled={editingId !== null}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={editingId !== null}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="text-sm">{product.unit}</p>
                <p className="font-bold text-primary">${product.price}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Qty: {product.quantity}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${product.inStock && product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs">
                      {product.inStock && product.quantity > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
