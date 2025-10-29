class CreateMatches < ActiveRecord::Migration[7.0]
  def change
    create_table :matches do |t|
      t.string :title, null: false
      t.string :location, null: false
      t.datetime :date, null: false
      t.string :category, null: false
      t.string :status, default: 'scheduled'
      t.integer :organizer_id, null: false # Chave estrangeira para o Jogador organizador

      t.timestamps
    end
    
    add_index :matches, :organizer_id
  end
end