class CreateRatings < ActiveRecord::Migration[7.0]
  def change
    create_table :ratings do |t|
      t.integer :rater_id, null: false  # quem avaliou (jogador)
      t.integer :rated_id, null: false  # quem foi avaliado (jogador)
      t.integer :match_id, null: false # em qual partida
      t.integer :score, null: false     # a pontuação

      t.timestamps
    end

    # chaves estrangeiras
    add_foreign_key :ratings, :players, column: :rater_id
    add_foreign_key :ratings, :players, column: :rated_id
    add_foreign_key :ratings, :matches, column: :match_id

    # garante que um jogador só pode avaliar outro jogador uma vez por partida.
    add_index :ratings, [:rater_id, :rated_id, :match_id], unique: true
  end
end