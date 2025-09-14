class CreateMatches < ActiveRecord::Migration[8.0]
  def change
    create_table :matches do |t|
      t.string :title
      t.string :location
      t.datetime :date
      t.string :category
      t.string :status
      t.references :organizer, foreign_key: { to_table: :players }

      t.timestamps
    end
  end
end
