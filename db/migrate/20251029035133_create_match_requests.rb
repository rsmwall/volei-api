class CreateMatchRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :match_requests do |t|
      t.integer :player_id, null: false # Quem está solicitando
      t.integer :match_id, null: false  # Para qual partida
      t.string :status, default: 'pending' # 'pending', 'accepted', 'rejected', 'withdrawn'
      t.string :payment_status, default: 'unpaid' # 'unpaid', 'paid'

      t.timestamps
    end
    
    # Adiciona chaves estrangeiras
    add_foreign_key :match_requests, :players, column: :player_id
    add_foreign_key :match_requests, :matches, column: :match_id
    
    # Garante que um jogador só possa ter um pedido por partida
    add_index :match_requests, [:player_id, :match_id], unique: true
  end
end