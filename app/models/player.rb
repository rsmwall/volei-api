class Player < ActiveRecord::Base
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  # jogador recebe muitas avaliações
  has_many :rated_ratings, class_name: 'Rating', foreign_key: 'rated_id'
  
  # jogador faz muitas avaliações
  has_many :given_ratings, class_name: 'Rating', foreign_key: 'rater_id'
end