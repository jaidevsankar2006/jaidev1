USE optimized_retail_inventory;

INSERT INTO users (id, name, email, password_hash, role) VALUES
('user-1', 'Admin User', 'admin@retailflow.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role);

INSERT INTO categories (id, name) VALUES
('cat-1', 'Beverages'),
('cat-2', 'Snacks'),
('cat-3', 'Personal Care')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO suppliers (id, name, contact_person, phone, email, location) VALUES
('sup-1', 'FreshMart Distributors', 'Rina Paul', '+91 90000 12345', 'sales@freshmart.example', 'Kolkata'),
('sup-2', 'Prime Wholesale Hub', 'Akash Roy', '+91 90000 67890', 'orders@primehub.example', 'Bengaluru'),
('sup-e4cd0097', 'dhggy', 'uiahihi', 'fuiadhfyuf', 'jaidevsa@gmail.com', 'jfhfusdhf')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
contact_person = VALUES(contact_person),
phone = VALUES(phone),
location = VALUES(location);

INSERT INTO products (id, name, sku, category_id, supplier_id, price, quantity, min_stock, max_stock) VALUES
('prod-1', 'Orange Juice 1L', 'BEV-001', 'cat-1', 'sup-1', 120, 26, 15, 80),
('prod-2', 'Salted Chips 200g', 'SNK-004', 'cat-2', 'sup-2', 40, 12, 18, 100),
('prod-3', 'Hand Wash 500ml', 'CARE-010', 'cat-3', 'sup-1', 90, 58, 10, 55),
('prod-14b73ee4', 'efjhd', 'njdnj', 'cat-1', 'sup-1', 3333, 0, 0, 10),
('prod-0b90b163', 'juice', '2', 'cat-1', 'sup-1', 799, 956, 7, 100)
ON DUPLICATE KEY UPDATE
name = VALUES(name),
category_id = VALUES(category_id),
supplier_id = VALUES(supplier_id),
price = VALUES(price),
quantity = VALUES(quantity),
min_stock = VALUES(min_stock),
max_stock = VALUES(max_stock);

INSERT INTO purchases (id, product_id, supplier_id, quantity, unit_cost, date) VALUES
('pur-a426093c', 'prod-0b90b163', 'sup-1', 900, 78, '2026-04-09'),
('pur-1', 'prod-1', 'sup-1', 30, 85, '2026-03-20'),
('pur-2', 'prod-2', 'sup-2', 45, 22, '2026-03-22')
ON DUPLICATE KEY UPDATE
quantity = VALUES(quantity),
unit_cost = VALUES(unit_cost),
date = VALUES(date);

INSERT INTO sales (id, product_id, quantity, unit_price, date) VALUES
('sale-c0e67dc4', 'prod-0b90b163', 34, 30, '2026-04-09'),
('sale-1', 'prod-1', 12, 120, '2026-03-26'),
('sale-2', 'prod-2', 18, 40, '2026-03-28'),
('sale-3', 'prod-3', 7, 90, '2026-04-01')
ON DUPLICATE KEY UPDATE
quantity = VALUES(quantity),
unit_price = VALUES(unit_price),
date = VALUES(date);
