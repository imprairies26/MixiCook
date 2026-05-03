-- MixiCook Database Schema (PostgreSQL)

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: ingredients
CREATE TABLE ingredients (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    image_url TEXT
);

-- Table: recipes
CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions JSONB NOT NULL,
    image_url TEXT,
    cooking_time INTEGER, -- minutes
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: recipe_ingredients (Mapping)
CREATE TABLE recipe_ingredients (
    recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    unit VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- Table: saved_recipes (Favorites)
CREATE TABLE saved_recipes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_recipe UNIQUE (user_id, recipe_id)
);

INSERT INTO ingredients (name, category, image_url) VALUES
('Thịt lợn ba chỉ', 'Thịt', 'https://example.com/img/pork.jpg'),
('Xương bò', 'Thịt', 'https://example.com/img/beef_bone.jpg'),
('Thịt bò thăn', 'Thịt', 'https://example.com/img/beef.jpg'),
('Thịt gà ta', 'Thịt', 'https://example.com/img/chicken.jpg'),
('Đậu phụ', 'Thực phẩm khô/Chế biến', 'https://example.com/img/tofu.jpg'),
('Cà chua', 'Rau củ', 'https://example.com/img/tomato.jpg'),
('Hành tây', 'Rau củ', 'https://example.com/img/onion.jpg'),
('Tỏi', 'Gia vị', 'https://example.com/img/garlic.jpg'),
('Hành tím', 'Gia vị', 'https://example.com/img/shallot.jpg'),
('Nước mắm', 'Gia vị', 'https://example.com/img/fish_sauce.jpg'),
('Nước tương', 'Gia vị', 'https://example.com/img/soy_sauce.jpg'),
('Muối', 'Gia vị', 'https://example.com/img/salt.jpg'),
('Tiêu', 'Gia vị', 'https://example.com/img/pepper.jpg'),
('Đường', 'Gia vị', 'https://example.com/img/sugar.jpg'),
('Trứng gà', 'Trứng/Sữa', 'https://example.com/img/egg.jpg'),
('Bánh phở', 'Tinh bột', 'https://example.com/img/noodles.jpg'),
('Rau mùi', 'Rau thơm', 'https://example.com/img/coriander.jpg'),
('Hành lá', 'Rau thơm', 'https://example.com/img/spring_onion.jpg'),
('Dầu ăn', 'Gia vị', 'https://example.com/img/oil.jpg'),
('Nước cốt dừa', 'Trứng/Sữa', 'https://example.com/img/coconut_milk.jpg'),
('Khoai tây', 'Rau củ', 'https://example.com/img/potato.jpg'),
('Cà rốt', 'Rau củ', 'https://example.com/img/carrot.jpg'),
('Sả', 'Gia vị', 'https://example.com/img/lemongrass.jpg'),
('Ớt tươi', 'Gia vị', 'https://example.com/img/chili.jpg'),
('Gừng', 'Gia vị', 'https://example.com/img/ginger.jpg');

INSERT INTO recipes (title, description, instructions, image_url, cooking_time, difficulty, user_id, is_system) VALUES
('Phở Bò Truyền Thống', 'Món phở bò thơm ngon, đậm đà hương vị truyền thống Việt Nam.', 
 '["Bước 1: Rửa sạch xương bò và chần qua nước sôi.", "Bước 2: Ninh xương bò với gừng và hành tím nướng trong 8 tiếng.", "Bước 3: Thái mỏng thịt bò thăn.", "Bước 4: Chần bánh phở, xếp thịt bò, hành lá và chan nước dùng."]', 
 'https://example.com/img/pho_bo_recipe.jpg', 480, 'Hard', NULL, TRUE),

('Thịt Kho Trứng', 'Món ăn đưa cơm, thịt mềm rục, trứng thấm vị.', 
 '["Bước 1: Thái thịt ba chỉ miếng vuông, ướp với nước mắm, đường, hành tỏi băm.", "Bước 2: Luộc trứng và bóc vỏ.", "Bước 3: Thắng đường làm nước màu, xào săn thịt.", "Bước 4: Cho nước dừa tươi hoặc nước cốt dừa vào hầm nhỏ lửa cùng trứng trong 45 phút."]', 
 'https://example.com/img/thit_kho_trung.jpg', 60, 'Medium', NULL, TRUE),

('Đậu Phụ Sốt Cà Chua', 'Món ăn thanh đạm, dễ làm cho bữa tối nhanh gọn.', 
 '["Bước 1: Cắt đậu phụ thành miếng vuông và chiên vàng.", "Bước 2: Thái hạt lựu cà chua.", "Bước 3: Phi thơm hành tím, xào nhuyễn cà chua với chút mắm và đường.", "Bước 4: Cho đậu phụ vào sốt, rim nhỏ lửa 5 phút rồi rắc hành lá."]', 
 'https://example.com/img/dau_sot_ca_chua.jpg', 15, 'Easy', NULL, TRUE),

('Gà Kho Gừng', 'Thịt gà kho đậm đà, ấm bụng vào những ngày mưa.', 
 '["Bước 1: Chặt gà miếng vừa ăn, ướp gia vị, mắm, muối, tiêu.", "Bước 2: Thái sợi gừng.", "Bước 3: Thắng nước màu, xào săn thịt gà cùng gừng.", "Bước 4: Thêm chút nước, kho riu riu đến khi nước sệt lại."]', 
 'https://example.com/img/ga_kho_gung.jpg', 30, 'Medium', NULL, TRUE),

('Canh Khoai Tây Cà Rốt Hầm Xương', 'Canh thanh mát, đầy đủ dinh dưỡng.', 
 '["Bước 1: Chần xương thịt qua nước sôi, rửa sạch.", "Bước 2: Ninh xương khoảng 30 phút lấy nước ngọt.", "Bước 3: Cắt khối khoai tây và cà rốt.", "Bước 4: Cho khoai và cà rốt vào hầm thêm 15 phút, nêm nếm vừa ăn, rắc hành ngò."]', 
 'https://example.com/img/canh_khoai_tay.jpg', 45, 'Medium', NULL, TRUE),

('Trứng Chiên Hành', 'Món ăn quốc dân, hoàn thành trong nháy mắt.', 
 '["Bước 1: Đập trứng ra bát, thêm hành lá thái nhỏ, xíu nước mắm và tiêu.", "Bước 2: Đánh tan hỗn hợp.", "Bước 3: Làm nóng chảo với dầu ăn, đổ trứng vào chiên vàng hai mặt."]', 
 'https://example.com/img/trung_chien.jpg', 10, 'Easy', NULL, TRUE),

('Bò Xào Hành Tây', 'Thịt bò mềm, hành tây giòn ngọt.', 
 '["Bước 1: Thái mỏng thịt bò, ướp với tỏi, dầu ăn và nước tương.", "Bước 2: Cắt múi cau hành tây.", "Bước 3: Phi tỏi, xào nhanh thịt bò ở lửa lớn rồi trút ra đĩa.", "Bước 4: Xào hành tây chín tới, đổ lại bò vào đảo đều, rắc tiêu."]', 
 'https://example.com/img/bo_xao_hanh.jpg', 15, 'Easy', NULL, TRUE),

('Cà Ri Gà', 'Cà ri béo ngậy, cay nồng ăn kèm bánh mì cực cuốn.', 
 '["Bước 1: Ướp gà với bột cà ri, hành, tỏi, muối, đường.", "Bước 2: Chiên sơ khoai tây và cà rốt.", "Bước 3: Xào săn gà với sả đập dập.", "Bước 4: Đổ nước hầm 20 phút, thêm khoai, cà rốt và nước cốt dừa, hầm thêm 10 phút."]', 
 'https://example.com/img/ca_ri_ga.jpg', 40, 'Medium', NULL, TRUE),

('Gà Luộc', 'Cách luộc gà da vàng ươm, thịt mọng nước.', 
 '["Bước 1: Xát muối làm sạch gà.", "Bước 2: Cho gà vào nồi nước lạnh, đun cùng hành nướng và gừng đập dập.", "Bước 3: Nước sôi thì hạ nhỏ lửa, đun 15 phút rồi tắt bếp ủ thêm 10 phút.", "Bước 4: Vớt ra ngâm nước đá lạnh để da giòn."]', 
 'https://example.com/img/ga_luoc.jpg', 30, 'Easy', NULL, TRUE),

('Canh Cà Chua Trứng', 'Món canh giải nhiệt siêu nhanh chóng.', 
 '["Bước 1: Thái múi cau cà chua.", "Bước 2: Phi hành tím, xào cà chua ra màu.", "Bước 3: Đổ nước lọc vào đun sôi, nêm gia vị.", "Bước 4: Đánh tan trứng, đổ từ từ vào nồi nước đang sôi để tạo vân trứng, rắc hành lá."]', 
 'https://example.com/img/canh_ca_chua_trung.jpg', 10, 'Easy', NULL, TRUE);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
-- 1. Phở Bò
((SELECT id FROM recipes WHERE title = 'Phở Bò Truyền Thống'), (SELECT id FROM ingredients WHERE name = 'Xương bò'), 1000, 'gram'),
((SELECT id FROM recipes WHERE title = 'Phở Bò Truyền Thống'), (SELECT id FROM ingredients WHERE name = 'Thịt bò thăn'), 300, 'gram'),
((SELECT id FROM recipes WHERE title = 'Phở Bò Truyền Thống'), (SELECT id FROM ingredients WHERE name = 'Hành tím'), 3, 'củ'),
((SELECT id FROM recipes WHERE title = 'Phở Bò Truyền Thống'), (SELECT id FROM ingredients WHERE name = 'Gừng'), 2, 'nhánh'),
((SELECT id FROM recipes WHERE title = 'Phở Bò Truyền Thống'), (SELECT id FROM ingredients WHERE name = 'Bánh phở'), 500, 'gram'),
((SELECT id FROM recipes WHERE title = 'Phở Bò Truyền Thống'), (SELECT id FROM ingredients WHERE name = 'Hành lá'), 20, 'gram'),
((SELECT id FROM recipes WHERE title = 'Phở Bò Truyền Thống'), (SELECT id FROM ingredients WHERE name = 'Nước mắm'), 2, 'muỗng'),

-- 2. Thịt Kho Trứng
((SELECT id FROM recipes WHERE title = 'Thịt Kho Trứng'), (SELECT id FROM ingredients WHERE name = 'Thịt lợn ba chỉ'), 500, 'gram'),
((SELECT id FROM recipes WHERE title = 'Thịt Kho Trứng'), (SELECT id FROM ingredients WHERE name = 'Trứng gà'), 5, 'quả'),
((SELECT id FROM recipes WHERE title = 'Thịt Kho Trứng'), (SELECT id FROM ingredients WHERE name = 'Nước mắm'), 3, 'muỗng'),
((SELECT id FROM recipes WHERE title = 'Thịt Kho Trứng'), (SELECT id FROM ingredients WHERE name = 'Đường'), 2, 'muỗng'),
((SELECT id FROM recipes WHERE title = 'Thịt Kho Trứng'), (SELECT id FROM ingredients WHERE name = 'Tỏi'), 1, 'củ'),
((SELECT id FROM recipes WHERE title = 'Thịt Kho Trứng'), (SELECT id FROM ingredients WHERE name = 'Nước cốt dừa'), 200, 'ml'),

-- 3. Đậu Phụ Sốt Cà Chua
((SELECT id FROM recipes WHERE title = 'Đậu Phụ Sốt Cà Chua'), (SELECT id FROM ingredients WHERE name = 'Đậu phụ'), 3, 'miếng'),
((SELECT id FROM recipes WHERE title = 'Đậu Phụ Sốt Cà Chua'), (SELECT id FROM ingredients WHERE name = 'Cà chua'), 2, 'quả'),
((SELECT id FROM recipes WHERE title = 'Đậu Phụ Sốt Cà Chua'), (SELECT id FROM ingredients WHERE name = 'Hành tím'), 1, 'củ'),
((SELECT id FROM recipes WHERE title = 'Đậu Phụ Sốt Cà Chua'), (SELECT id FROM ingredients WHERE name = 'Nước mắm'), 1, 'muỗng'),
((SELECT id FROM recipes WHERE title = 'Đậu Phụ Sốt Cà Chua'), (SELECT id FROM ingredients WHERE name = 'Hành lá'), 10, 'gram'),
((SELECT id FROM recipes WHERE title = 'Đậu Phụ Sốt Cà Chua'), (SELECT id FROM ingredients WHERE name = 'Dầu ăn'), 3, 'muỗng'),

-- 4. Gà Kho Gừng
((SELECT id FROM recipes WHERE title = 'Gà Kho Gừng'), (SELECT id FROM ingredients WHERE name = 'Thịt gà ta'), 500, 'gram'),
((SELECT id FROM recipes WHERE title = 'Gà Kho Gừng'), (SELECT id FROM ingredients WHERE name = 'Gừng'), 1, 'củ lớn'),
((SELECT id FROM recipes WHERE title = 'Gà Kho Gừng'), (SELECT id FROM ingredients WHERE name = 'Nước mắm'), 2, 'muỗng'),
((SELECT id FROM recipes WHERE title = 'Gà Kho Gừng'), (SELECT id FROM ingredients WHERE name = 'Đường'), 1, 'muỗng'),
((SELECT id FROM recipes WHERE title = 'Gà Kho Gừng'), (SELECT id FROM ingredients WHERE name = 'Tiêu'), 1, 'thìa cafe'),

-- 5. Canh Khoai Tây Cà Rốt Hầm Xương
((SELECT id FROM recipes WHERE title = 'Canh Khoai Tây Cà Rốt Hầm Xương'), (SELECT id FROM ingredients WHERE name = 'Xương bò'), 300, 'gram'),
((SELECT id FROM recipes WHERE title = 'Canh Khoai Tây Cà Rốt Hầm Xương'), (SELECT id FROM ingredients WHERE name = 'Khoai tây'), 2, 'củ'),
((SELECT id FROM recipes WHERE title = 'Canh Khoai Tây Cà Rốt Hầm Xương'), (SELECT id FROM ingredients WHERE name = 'Cà rốt'), 1, 'củ'),
((SELECT id FROM recipes WHERE title = 'Canh Khoai Tây Cà Rốt Hầm Xương'), (SELECT id FROM ingredients WHERE name = 'Muối'), 1, 'thìa'),
((SELECT id FROM recipes WHERE title = 'Canh Khoai Tây Cà Rốt Hầm Xương'), (SELECT id FROM ingredients WHERE name = 'Rau mùi'), 10, 'gram'),

-- 6. Trứng Chiên Hành
((SELECT id FROM recipes WHERE title = 'Trứng Chiên Hành'), (SELECT id FROM ingredients WHERE name = 'Trứng gà'), 3, 'quả'),
((SELECT id FROM recipes WHERE title = 'Trứng Chiên Hành'), (SELECT id FROM ingredients WHERE name = 'Hành lá'), 20, 'gram'),
((SELECT id FROM recipes WHERE title = 'Trứng Chiên Hành'), (SELECT id FROM ingredients WHERE name = 'Nước mắm'), 1, 'thìa cafe'),
((SELECT id FROM recipes WHERE title = 'Trứng Chiên Hành'), (SELECT id FROM ingredients WHERE name = 'Dầu ăn'), 1, 'muỗng'),

-- 7. Bò Xào Hành Tây
((SELECT id FROM recipes WHERE title = 'Bò Xào Hành Tây'), (SELECT id FROM ingredients WHERE name = 'Thịt bò thăn'), 200, 'gram'),
((SELECT id FROM recipes WHERE title = 'Bò Xào Hành Tây'), (SELECT id FROM ingredients WHERE name = 'Hành tây'), 1, 'củ'),
((SELECT id FROM recipes WHERE title = 'Bò Xào Hành Tây'), (SELECT id FROM ingredients WHERE name = 'Tỏi'), 1, 'củ'),
((SELECT id FROM recipes WHERE title = 'Bò Xào Hành Tây'), (SELECT id FROM ingredients WHERE name = 'Nước tương'), 2, 'muỗng'),
((SELECT id FROM recipes WHERE title = 'Bò Xào Hành Tây'), (SELECT id FROM ingredients WHERE name = 'Dầu ăn'), 2, 'muỗng'),

-- 8. Cà Ri Gà
((SELECT id FROM recipes WHERE title = 'Cà Ri Gà'), (SELECT id FROM ingredients WHERE name = 'Thịt gà ta'), 500, 'gram'),
((SELECT id FROM recipes WHERE title = 'Cà Ri Gà'), (SELECT id FROM ingredients WHERE name = 'Khoai tây'), 2, 'củ'),
((SELECT id FROM recipes WHERE title = 'Cà Ri Gà'), (SELECT id FROM ingredients WHERE name = 'Cà rốt'), 1, 'củ'),
((SELECT id FROM recipes WHERE title = 'Cà Ri Gà'), (SELECT id FROM ingredients WHERE name = 'Nước cốt dừa'), 200, 'ml'),
((SELECT id FROM recipes WHERE title = 'Cà Ri Gà'), (SELECT id FROM ingredients WHERE name = 'Sả'), 3, 'cây'),
((SELECT id FROM recipes WHERE title = 'Cà Ri Gà'), (SELECT id FROM ingredients WHERE name = 'Muối'), 1, 'thìa'),

-- 9. Gà Luộc
((SELECT id FROM recipes WHERE title = 'Gà Luộc'), (SELECT id FROM ingredients WHERE name = 'Thịt gà ta'), 1000, 'gram'),
((SELECT id FROM recipes WHERE title = 'Gà Luộc'), (SELECT id FROM ingredients WHERE name = 'Gừng'), 1, 'nhánh'),
((SELECT id FROM recipes WHERE title = 'Gà Luộc'), (SELECT id FROM ingredients WHERE name = 'Hành tím'), 2, 'củ'),
((SELECT id FROM recipes WHERE title = 'Gà Luộc'), (SELECT id FROM ingredients WHERE name = 'Muối'), 2, 'thìa'),

-- 10. Canh Cà Chua Trứng
((SELECT id FROM recipes WHERE title = 'Canh Cà Chua Trứng'), (SELECT id FROM ingredients WHERE name = 'Cà chua'), 2, 'quả'),
((SELECT id FROM recipes WHERE title = 'Canh Cà Chua Trứng'), (SELECT id FROM ingredients WHERE name = 'Trứng gà'), 2, 'quả'),
((SELECT id FROM recipes WHERE title = 'Canh Cà Chua Trứng'), (SELECT id FROM ingredients WHERE name = 'Hành tím'), 1, 'củ'),
((SELECT id FROM recipes WHERE title = 'Canh Cà Chua Trứng'), (SELECT id FROM ingredients WHERE name = 'Hành lá'), 10, 'gram'),
((SELECT id FROM recipes WHERE title = 'Canh Cà Chua Trứng'), (SELECT id FROM ingredients WHERE name = 'Muối'), 1, 'thìa');


select * from users;
select * from ingredients;
select * from recipes;
select * from recipe_ingredients;
select * from saved_recipes;