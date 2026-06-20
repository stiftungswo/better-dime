-- Seed data for integration tests.
-- Uses INSERT ... ON DUPLICATE KEY UPDATE to be idempotent.
-- Bcrypt hash below is for password "123456" (cost 10).

INSERT INTO employee_groups (id, name, created_at, updated_at)
VALUES (1, 'Zivi', NOW(), NOW()),
       (2, 'SWO Angestellte', NOW(), NOW()),
       (3, 'UWT Teilnehmer', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name), updated_at = NOW();

INSERT INTO employees (id, email, encrypted_password, first_name, last_name, is_admin, can_login, archived, holidays_per_year, employee_group_id, first_vacation_takeover, locale, created_at, updated_at)
VALUES
  (1, 'zivi@example.com',     '$2a$10$iyJoVjJfxMfrjYGeR60.2.jUplJ1vGzSt4HaTei8DzpNmRxiIvfOW', 'Zivi',        'Muster', 1, 1, 0, 20, 1, 0.00, 'de', NOW(), NOW()),
  (2, 'employee@example.com', '$2a$10$xFnUP64bAdHfu1Z8vGBLP.BWKYiA.rULS81rUSjhpKbryqv9BPWM.', 'Mitarbeiter', 'Muster', 0, 1, 0, 20, 2, 0.00, 'de', NOW(), NOW()),
  (3, 'uwt@example.com',      '$2a$10$H8H/3mokKUNxf5h.2RBOK.SlKAeYT/AzkoRIS1LAYUXODZ1y2mnE.', 'UWT',         'Muster', 0, 1, 0, 20, 3, 0.00, 'de', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  encrypted_password = VALUES(encrypted_password),
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  is_admin = VALUES(is_admin),
  can_login = VALUES(can_login),
  archived = VALUES(archived),
  holidays_per_year = VALUES(holidays_per_year),
  employee_group_id = VALUES(employee_group_id),
  first_vacation_takeover = VALUES(first_vacation_takeover),
  locale = VALUES(locale),
  updated_at = NOW();

INSERT INTO rate_groups (id, name, description)
VALUES (1, 'Standard', 'Default rate group')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO costgroups (number, name, created_at, updated_at)
VALUES (100, 'Default', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  updated_at = NOW();

INSERT INTO project_categories (id, name, archived, created_at, updated_at)
VALUES (1, 'Default Category', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  archived = VALUES(archived),
  updated_at = NOW();

INSERT INTO global_settings (id, sender_name, sender_street, sender_zip, sender_city, sender_phone, sender_mail, sender_vat, sender_bank, sender_web, service_order_comment, sender_bank_detail, sender_bank_iban, sender_bank_bic, created_at, updated_at)
VALUES (1, 'Test GmbH', 'Teststrasse 1', '8000', 'Teststadt', '+41 44 000 00 00', 'info@test.example.com', 'CHE-000.000.000', 'Testbank AG', 'https://test.example.com', 'Test comment', 'BC 1234', 'CH00 0000 0000 0000 0000 0', 'TESTCHZZ', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  sender_name = VALUES(sender_name),
  sender_street = VALUES(sender_street),
  sender_zip = VALUES(sender_zip),
  sender_city = VALUES(sender_city),
  sender_phone = VALUES(sender_phone),
  sender_mail = VALUES(sender_mail),
  sender_vat = VALUES(sender_vat),
  sender_bank = VALUES(sender_bank),
  sender_web = VALUES(sender_web),
  service_order_comment = VALUES(service_order_comment),
  sender_bank_detail = VALUES(sender_bank_detail),
  sender_bank_iban = VALUES(sender_bank_iban),
  sender_bank_bic = VALUES(sender_bank_bic),
  updated_at = NOW();
