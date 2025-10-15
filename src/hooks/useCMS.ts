import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBanners = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const saveBanner = useMutation({
    mutationFn: async (banner: any) => {
      if (banner.id) {
        const { error } = await supabase
          .from("banners")
          .update(banner)
          .eq("id", banner.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert(banner);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({ title: "Banner saved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({ title: "Banner deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return { banners, isLoading, saveBanner: saveBanner.mutate, deleteBanner: deleteBanner.mutate };
};

export const useCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const saveCategory = useMutation({
    mutationFn: async (category: any) => {
      if (category.id) {
        const { error } = await supabase
          .from("categories")
          .update(category)
          .eq("id", category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(category);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category saved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return { categories, isLoading, saveCategory: saveCategory.mutate, deleteCategory: deleteCategory.mutate };
};

export const useSubcategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subcategories = [], isLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const saveSubcategory = useMutation({
    mutationFn: async (subcategory: any) => {
      if (subcategory.id) {
        const { error } = await supabase
          .from("subcategories")
          .update(subcategory)
          .eq("id", subcategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("subcategories").insert(subcategory);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Subcategory saved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteSubcategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subcategories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Subcategory deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return { subcategories, isLoading, saveSubcategory: saveSubcategory.mutate, deleteSubcategory: deleteSubcategory.mutate };
};

export const useCMS = () => {
  const bannersData = useBanners();
  const categoriesData = useCategories();
  const subcategoriesData = useSubcategories();

  return {
    banners: bannersData.banners,
    categories: categoriesData.categories,
    subcategories: subcategoriesData.subcategories,
    isLoading: bannersData.isLoading || categoriesData.isLoading || subcategoriesData.isLoading,
    createBanner: bannersData.saveBanner,
    updateBanner: bannersData.saveBanner,
    deleteBanner: bannersData.deleteBanner,
    createCategory: categoriesData.saveCategory,
    updateCategory: categoriesData.saveCategory,
    deleteCategory: categoriesData.deleteCategory,
    createSubcategory: subcategoriesData.saveSubcategory,
    updateSubcategory: subcategoriesData.saveSubcategory,
    deleteSubcategory: subcategoriesData.deleteSubcategory,
  };
};
