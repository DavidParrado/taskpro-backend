export interface ITarea {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string; email: string };
}
