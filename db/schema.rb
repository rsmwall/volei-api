# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_10_29_035133) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "match_requests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "match_id", null: false
    t.string "payment_status", default: "unpaid"
    t.integer "player_id", null: false
    t.string "status", default: "pending"
    t.datetime "updated_at", null: false
    t.index ["player_id", "match_id"], name: "index_match_requests_on_player_id_and_match_id", unique: true
  end

  create_table "matches", force: :cascade do |t|
    t.string "category", null: false
    t.datetime "created_at", null: false
    t.datetime "date", null: false
    t.string "location", null: false
    t.integer "organizer_id", null: false
    t.string "status", default: "scheduled"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["organizer_id"], name: "index_matches_on_organizer_id"
  end

  create_table "players", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "gender"
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_players_on_email", unique: true
  end

  add_foreign_key "match_requests", "matches"
  add_foreign_key "match_requests", "players"
end
