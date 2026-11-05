export type Category = {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  image: string;
};

export type Product = {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  featured?: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  date: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  image?: string;
  tag?: string;
};

export type Store = {
  categories: Category[];
  products: Product[];
  posts: Post[];
};
