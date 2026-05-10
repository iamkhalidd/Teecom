'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Save,
  Type,
  Package,
  Grid,
  Megaphone
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  image_alt?: string;
  cta_text?: string;
  cta_link?: string;
  is_active: boolean;
  order: number;
  start_date?: string;
  end_date?: string;
}

interface Announcement {
  id: number;
  text: string;
  link?: string;
  is_active: boolean;
  background_color: string;
  text_color: string;
  start_date?: string;
  end_date?: string;
}

interface ContentBlock {
  id: number;
  name: string;
  block_type: 'featured_products' | 'categories' | 'text' | 'promotion';
  title?: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  image_alt?: string;
  cta_text?: string;
  cta_link?: string;
  products: number[];
  categories: number[];
  is_active: boolean;
  order: number;
  start_date?: string;
  end_date?: string;
}

export default function ContentPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchData();
  }, []);

  const fetchContent = async () => {
    try {
      const [bannersRes, announcementsRes, blocksRes] = await Promise.all([
        api.admin.content.banners.list(),
        api.admin.content.announcements.list(),
        api.admin.content.blocks.list()
      ]);
      setBanners(Array.isArray(bannersRes) ? bannersRes : bannersRes.results || []);
      setAnnouncements(Array.isArray(announcementsRes) ? announcementsRes : announcementsRes.results || []);
      setBlocks(Array.isArray(blocksRes) ? blocksRes : blocksRes.results || []);
    } catch (error) {
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.admin.products.list(),
        api.products.categories()
      ]);
      setAvailableProducts(Array.isArray(productsRes) ? productsRes : productsRes.results || []);
      setAvailableCategories(Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.results || []);
    } catch (error) {
      console.error('Failed to fetch support data', error);
    }
  };

  // Banner Actions
  const handleUpdateBanner = async (id: number, data: Partial<Banner>) => {
    try {
      await api.admin.content.banners.update(id, data);
      toast.success('Banner updated');
      fetchContent();
    } catch (error) {
      toast.error('Failed to update banner');
    }
  };

  const handleAddBanner = async () => {
    try {
      await api.admin.content.banners.create({
        title: 'New Banner',
        subtitle: 'Add a subtitle here',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        cta_text: 'Shop Now',
        cta_link: '/products',
        is_active: false,
        order: banners.length
      });
      toast.success('New banner added');
      fetchContent();
    } catch (error) {
      toast.error('Failed to add banner');
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.admin.content.banners.delete(id);
      toast.success('Banner deleted');
      fetchContent();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  // Announcement Actions
  const handleUpdateAnnouncement = async (id: number, data: Partial<Announcement>) => {
    try {
      await api.admin.content.announcements.update(id, data);
      toast.success('Announcement updated');
      fetchContent();
    } catch (error) {
      toast.error('Failed to update announcement');
    }
  };

  const handleAddAnnouncement = async () => {
    try {
      await api.admin.content.announcements.create({
        text: 'New Announcement',
        is_active: false,
        background_color: '#000000',
        text_color: '#FFFFFF'
      });
      toast.success('New announcement added');
      fetchContent();
    } catch (error) {
      toast.error('Failed to add announcement');
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.admin.content.announcements.delete(id);
      toast.success('Announcement deleted');
      fetchContent();
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  // Block Actions
  const handleUpdateBlock = async (id: number, data: Partial<ContentBlock>) => {
    // Basic date validation
    if (data.start_date && data.end_date) {
      if (new Date(data.start_date) >= new Date(data.end_date)) {
        toast.error('End date must be after start date');
        return;
      }
    } else if (data.start_date || data.end_date) {
      const block = blocks.find(b => b.id === id);
      const start = data.start_date || block?.start_date;
      const end = data.end_date || block?.end_date;
      if (start && end && new Date(start) >= new Date(end)) {
        toast.error('End date must be after start date');
        return;
      }
    }

    try {
      await api.admin.content.blocks.update(id, data);
      toast.success('Block updated');
      fetchContent();
    } catch (error) {
      toast.error('Failed to update block');
    }
  };

  const handleAddBlock = async () => {
    try {
      await api.admin.content.blocks.create({
        name: 'New Section',
        block_type: 'text',
        title: 'New Section Title',
        is_active: false,
        order: blocks.length
      });
      toast.success('New block added');
      fetchContent();
    } catch (error) {
      toast.error('Failed to add block');
    }
  };

  const handleDeleteBlock = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.admin.content.blocks.delete(id);
      toast.success('Block deleted');
      fetchContent();
    } catch (error) {
      toast.error('Failed to delete block');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Storefront Designer</h1>
          <p className="text-muted-foreground">Manage your homepage layout and content sections.</p>
        </div>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="banners">Hero Banners</TabsTrigger>
          <TabsTrigger value="announcements">Announcement Bars</TabsTrigger>
          <TabsTrigger value="blocks">Home Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Hero Banners</h2>
            <Button onClick={handleAddBanner} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </div>

          <div className="grid gap-6">
            {banners.map((banner) => (
              <Card key={banner.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/3 space-y-4">
                      <div className="aspect-video relative rounded-xl overflow-hidden bg-muted border">
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={banner.image_url}
                          onChange={(e) => handleUpdateBanner(banner.id, { image_url: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image Alt Text</Label>
                        <Input
                          value={banner.image_alt || ''}
                          placeholder="e.g. Summer collection banner"
                          onChange={(e) => handleUpdateBanner(banner.id, { image_alt: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={banner.title}
                            onChange={(e) => handleUpdateBanner(banner.id, { title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input
                            value={banner.subtitle || ''}
                            onChange={(e) => handleUpdateBanner(banner.id, { subtitle: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>CTA Text</Label>
                          <Input
                            value={banner.cta_text || ''}
                            onChange={(e) => handleUpdateBanner(banner.id, { cta_text: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA Link</Label>
                          <Input
                            value={banner.cta_link || ''}
                            onChange={(e) => handleUpdateBanner(banner.id, { cta_link: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="datetime-local"
                            value={banner.start_date ? banner.start_date.substring(0, 16) : ''}
                            onChange={(e) => handleUpdateBanner(banner.id, { start_date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="datetime-local"
                            value={banner.end_date ? banner.end_date.substring(0, 16) : ''}
                            onChange={(e) => handleUpdateBanner(banner.id, { end_date: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={banner.is_active}
                              onCheckedChange={(checked) => handleUpdateBanner(banner.id, { is_active: checked })}
                            />
                            <Label>Active</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label>Order</Label>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleUpdateBanner(banner.id, { order: Math.max(0, banner.order - 1) })}>
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                className="w-12 h-8 text-center"
                                value={banner.order}
                                onChange={(e) => handleUpdateBanner(banner.id, { order: parseInt(e.target.value) })}
                              />
                              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleUpdateBanner(banner.id, { order: banner.order + 1 })}>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Announcement Bars</h2>
            <Button onClick={handleAddAnnouncement} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Announcement
            </Button>
          </div>

          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Text</Label>
                        <Input
                          value={announcement.text}
                          onChange={(e) => handleUpdateAnnouncement(announcement.id, { text: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link (Optional)</Label>
                        <Input
                          value={announcement.link || ''}
                          onChange={(e) => handleUpdateAnnouncement(announcement.id, { link: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                       <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="datetime-local"
                          value={announcement.start_date ? announcement.start_date.substring(0, 16) : ''}
                          onChange={(e) => handleUpdateAnnouncement(announcement.id, { start_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="datetime-local"
                          value={announcement.end_date ? announcement.end_date.substring(0, 16) : ''}
                          onChange={(e) => handleUpdateAnnouncement(announcement.id, { end_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>BG Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            className="flex-1"
                            value={announcement.background_color}
                            onChange={(e) => handleUpdateAnnouncement(announcement.id, { background_color: e.target.value })}
                          />
                          <input
                            type="color"
                            value={announcement.background_color}
                            onChange={(e) => handleUpdateAnnouncement(announcement.id, { background_color: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            className="flex-1"
                            value={announcement.text_color}
                            onChange={(e) => handleUpdateAnnouncement(announcement.id, { text_color: e.target.value })}
                          />
                          <input
                            type="color"
                            value={announcement.text_color}
                            onChange={(e) => handleUpdateAnnouncement(announcement.id, { text_color: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={announcement.is_active}
                          onCheckedChange={(checked) => handleUpdateAnnouncement(announcement.id, { is_active: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Homepage Sections</h2>
            <Button onClick={handleAddBlock} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="grid gap-6">
            {blocks.map((block) => (
              <Card key={block.id} className={!block.is_active ? 'opacity-70' : ''}>
                <CardHeader className="pb-3 border-b bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border">
                        {block.block_type === 'featured_products' && <Package className="h-4 w-4" />}
                        {block.block_type === 'categories' && <Grid className="h-4 w-4" />}
                        {block.block_type === 'text' && <Type className="h-4 w-4" />}
                        {block.block_type === 'promotion' && <Megaphone className="h-4 w-4" />}
                      </div>
                      <div>
                        <CardTitle className="text-base">{block.name}</CardTitle>
                        <CardDescription>Type: {block.block_type}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 mr-4">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleUpdateBlock(block.id, { order: Math.max(0, block.order - 1) })}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{block.order}</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleUpdateBlock(block.id, { order: block.order + 1 })}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Switch
                        checked={block.is_active}
                        onCheckedChange={(checked) => handleUpdateBlock(block.id, { is_active: checked })}
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBlock(block.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label>Internal Name (for admin only)</Label>
                        <Input value={block.name} onChange={(e) => handleUpdateBlock(block.id, { name: e.target.value })} />
                      </div>

                      <div className="grid gap-2">
                        <Label>Section Type</Label>
                        <Select
                          value={block.block_type}
                          onValueChange={(val: any) => handleUpdateBlock(block.id, { block_type: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="featured_products">Featured Products</SelectItem>
                            <SelectItem value="categories">Categories Grid</SelectItem>
                            <SelectItem value="text">Custom Text / About</SelectItem>
                            <SelectItem value="promotion">Promotional Banner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Display Title</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })} />
                      </div>

                      <div className="grid gap-2">
                        <Label>Display Subtitle</Label>
                        <Input value={block.subtitle || ''} onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })} />
                      </div>

                      {block.image_url && (
                        <div className="pt-4">
                          <Label className="mb-2 block">Image Preview</Label>
                          <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
                            <img
                              src={block.image_url}
                              alt="Preview"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 border-l pl-8">
                      {/* Block Type Specific Content */}
                      {block.block_type === 'text' && (
                        <div className="grid gap-2">
                          <Label>Content Body</Label>
                          <Textarea
                            rows={5}
                            value={block.content || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                          />
                        </div>
                      )}

                      {block.block_type === 'promotion' && (
                        <div className="space-y-4">
                           <div className="grid gap-2">
                            <Label>Background Image URL</Label>
                            <Input value={block.image_url || ''} onChange={(e) => handleUpdateBlock(block.id, { image_url: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label>Image Alt Text</Label>
                            <Input value={block.image_alt || ''} placeholder="Describe the image for SEO" onChange={(e) => handleUpdateBlock(block.id, { image_alt: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>CTA Text</Label>
                              <Input value={block.cta_text || ''} onChange={(e) => handleUpdateBlock(block.id, { cta_text: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <Label>CTA Link</Label>
                              <Input value={block.cta_link || ''} onChange={(e) => handleUpdateBlock(block.id, { cta_link: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      )}

                      {block.block_type === 'featured_products' && (
                        <div className="grid gap-2">
                          <Label>Select Products</Label>
                          <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md bg-muted/20">
                            {availableProducts.map(product => (
                              <div key={product.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`prod-${block.id}-${product.id}`}
                                  checked={block.products?.includes(product.id)}
                                  onChange={(e) => {
                                    const currentIds = block.products || [];
                                    const newIds = e.target.checked
                                      ? [...currentIds, product.id]
                                      : currentIds.filter(id => id !== product.id);
                                    handleUpdateBlock(block.id, { products: newIds });
                                  }}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor={`prod-${block.id}-${product.id}`} className="text-sm cursor-pointer truncate">
                                  {product.name} <span className="text-xs text-muted-foreground">({product.sku})</span>
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Selected: {block.products?.length || 0} products</p>
                        </div>
                      )}

                      {block.block_type === 'categories' && (
                        <div className="grid gap-2">
                          <Label>Select Categories</Label>
                          <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md bg-muted/20">
                            {availableCategories.map(category => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`cat-${block.id}-${category.id}`}
                                  checked={block.categories?.includes(category.id)}
                                  onChange={(e) => {
                                    const currentIds = block.categories || [];
                                    const newIds = e.target.checked
                                      ? [...currentIds, category.id]
                                      : currentIds.filter(id => id !== category.id);
                                    handleUpdateBlock(block.id, { categories: newIds });
                                  }}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor={`cat-${block.id}-${category.id}`} className="text-sm cursor-pointer">
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Selected: {block.categories?.length || 0} categories</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="grid gap-2">
                          <Label>Start Date</Label>
                          <Input
                            type="datetime-local"
                            className="text-sm"
                            value={block.start_date ? block.start_date.substring(0, 16) : ''}
                            onChange={(e) => handleUpdateBlock(block.id, { start_date: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>End Date</Label>
                          <Input
                            type="datetime-local"
                            className="text-sm"
                            value={block.end_date ? block.end_date.substring(0, 16) : ''}
                            onChange={(e) => handleUpdateBlock(block.id, { end_date: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
