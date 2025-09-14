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

ActiveRecord::Schema[8.0].define(version: 2025_09_14_212843) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "match_requests", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.bigint "match_id", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "payment_status"
    t.index ["match_id"], name: "index_match_requests_on_match_id"
    t.index ["player_id"], name: "index_match_requests_on_player_id"
  end

  create_table "matches", force: :cascade do |t|
    t.string "title"
    t.string "location"
    t.datetime "date"
    t.string "category"
    t.string "status"
    t.bigint "organizer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organizer_id"], name: "index_matches_on_organizer_id"
  end

  create_table "players", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "gender"
    t.string "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ratings", force: :cascade do |t|
    t.bigint "rater_id"
    t.bigint "rated_id"
    t.bigint "match_id"
    t.integer "score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_ratings_on_match_id"
    t.index ["rated_id"], name: "index_ratings_on_rated_id"
    t.index ["rater_id"], name: "index_ratings_on_rater_id"
  end

  add_foreign_key "match_requests", "matches"
  add_foreign_key "match_requests", "players"
  add_foreign_key "matches", "players", column: "organizer_id"
  add_foreign_key "ratings", "matches"
  add_foreign_key "ratings", "players", column: "rated_id"
  add_foreign_key "ratings", "players", column: "rater_id"
end
