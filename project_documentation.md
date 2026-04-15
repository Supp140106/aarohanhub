CREATE TABLE aarohan_data_1nf (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,
    full_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role TEXT,

    event_id INT,
    event_title VARCHAR(255),
    event_description TEXT,
    schedule TIMESTAMP,
    winner_name VARCHAR(255),

    is_volunteer TINYINT(1),

    accommodation_details TEXT,
    food_coupon_provided TINYINT(1),

    query_question TEXT,
    query_answer TEXT,
    answered_by VARCHAR(255)
);