export interface Category {
  $id?: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image?: string;
  slug?: string;
}
