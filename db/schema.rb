# db/schema.rb

ActiveRecord::Schema.define(version: 2025_12_17_000000) do

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "category"
    t.string "gender"
    t.string "password_digest" # Senha
    t.string "role", default: "participant"
    t.string "city"
    t.string "photo_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.string "title"
    t.string "location"
    t.datetime "date"
    t.string "category"
    t.string "status", default: "open"
    t.integer "user_id" # Organizador
    t.text "description"
    t.decimal "price", precision: 10, scale: 2
    t.string "event_type", default: "free"
    t.integer "max_attendees"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "registrations", force: :cascade do |t|
    t.integer "user_id"
    t.integer "event_id"
    t.string "status", default: "pending"
    t.integer "checkins_count", default: 0
    t.string "payment_status", default: "pending"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "event_id"
    t.integer "user_id"
    t.integer "score"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "friendships", force: :cascade do |t|
    t.integer "requester_id"
    t.integer "receiver_id"
    t.string "status", default: "pending"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.integer "sender_id"
    t.integer "receiver_id"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end