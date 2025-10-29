class CreatePlayers < ActiveRecord::Migration[8.1]
  def change
    create_table :players do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :gender
      t.string :category

      t.timestamps
    end
  end
end
