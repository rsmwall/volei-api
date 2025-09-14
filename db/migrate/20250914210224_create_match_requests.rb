class CreateMatchRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :match_requests do |t|
      t.references :player, foreign_key: { to_table: :players }
      t.references :match, foreign_key: { to_table: :matches }
      t.string :status

      t.timestamps
    end
  end
end
