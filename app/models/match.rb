class Match < ActiveRecord::Base
  # uma partida pertence a um jogador (organizador)
  belongs_to :organizer, class_name: 'Player', foreign_key: 'organizer_id'

  # validacoes
  validates :title, :location, :date, :category, :organizer_id, presence: true
end