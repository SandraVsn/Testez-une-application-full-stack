CREATE TABLE IF NOT EXISTS `TEACHERS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `last_name` VARCHAR(40),
  `first_name` VARCHAR(40),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `SESSIONS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50),
  `description` VARCHAR(2000),
  `date` TIMESTAMP,
  `teacher_id` int,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `USERS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `last_name` VARCHAR(40),
  `first_name` VARCHAR(40),
  `admin` BOOLEAN NOT NULL DEFAULT false,
  `email` VARCHAR(255),
  `password` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `PARTICIPATE` (
  `user_id` INT, 
  `session_id` INT
);

ALTER TABLE `SESSIONS` ADD FOREIGN KEY (`teacher_id`) REFERENCES `TEACHERS` (`id`);
ALTER TABLE `PARTICIPATE` ADD FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`);
ALTER TABLE `PARTICIPATE` ADD FOREIGN KEY (`session_id`) REFERENCES `SESSIONS` (`id`);

INSERT INTO TEACHERS (id, first_name, last_name)
SELECT 1, 'Test', 'TEST' 
WHERE NOT EXISTS (
    SELECT 1 FROM TEACHERS WHERE first_name = 'Test' AND last_name = 'TEST'
);

INSERT INTO TEACHERS (first_name, last_name)
SELECT 'Margot', 'DELAHAYE' 
WHERE NOT EXISTS (
    SELECT 1 FROM TEACHERS WHERE first_name = 'Margot' AND last_name = 'DELAHAYE'
);

INSERT INTO TEACHERS (first_name, last_name)
SELECT 'Hélène', 'THIERCELIN'
WHERE NOT EXISTS (
    SELECT 1 FROM TEACHERS WHERE first_name = 'Hélène' AND last_name = 'THIERCELIN'
);

INSERT INTO USERS (first_name, last_name, admin, email, password)
SELECT 'Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'
WHERE NOT EXISTS (
    SELECT 1 FROM USERS WHERE email = 'yoga@studio.com'
);

INSERT INTO USERS (id, first_name, last_name, admin, email, password)
SELECT 1, 'Test', 'test', true, 'test@mail.com', 'test'
WHERE NOT EXISTS (
    SELECT 1 FROM USERS WHERE email = 'test@mail.com'
);

INSERT INTO USERS (id, first_name, last_name, admin, email, password)
SELECT 2, 'Existing', 'Existing', true, 'existing@mail.com', 'test'
WHERE NOT EXISTS (
    SELECT 1 FROM USERS WHERE email = 'existing@mail.com'
);
