/** 冰箱食材 */
export type Ingredient = {
  id: string;
  name: string;
  quantity: string | null;
  urgent: boolean;
  created_at: string;
};

/** 想吃的菜 */
export type Wish = {
  id: string;
  dish_name: string;
  created_at: string;
};

/** 每日菜单 */
export type DailyMenu = {
  id: string;
  date: string;
  content: string;
  generated_at: string;
  updated_at: string;
};
