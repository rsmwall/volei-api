class CreateRatings < ActiveRecord::Migration[8.0]
  def change
    create_table :ratings do |t|
      t.references :rater, foreign_key: { to_table: :players }
      t.references :rated, foreign_key: { to_table: :players }
      t.references :match, foreign_key: { to_table: :matches }
      t.integer :score

      t.timestamps
    end
  end
end
