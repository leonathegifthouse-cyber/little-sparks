-- Optional: run this after schema.sql to see a few sample products in your storefront.
-- These use placeholder image URLs — replace with your own uploaded image URLs
-- (Storage > product-images in the Supabase dashboard) once you have real photos.

insert into products (name, description, price_paise, image_url, category, age_group, stock)
values
  ('Wooden Stacking Rainbow', 'A hand-painted wooden stacking toy that builds fine motor skills and color recognition.', 89900, null, 'toys', '1-3', 25),
  ('First Words Picture Book', 'A sturdy board book with bright illustrations for early vocabulary building.', 34900, null, 'books', '0-2', 40),
  ('Dino Print Cotton Romper', 'Soft, breathable cotton romper with a friendly dinosaur print.', 59900, null, 'clothing', '0-2', 30),
  ('Birthday Party Confetti Kit', 'Balloons, banners and confetti poppers for a bright kids'' birthday celebration.', 74900, null, 'birthday', 'all', 15),
  ('Build-Your-Own Robot Blocks', 'Magnetic building blocks that snap into a robot — great for imaginative play.', 129900, null, 'toys', '3-5', 20),
  ('Bedtime Stories Collection', 'A boxed set of five gentle bedtime stories for toddlers.', 99900, null, 'books', '2-5', 18);
