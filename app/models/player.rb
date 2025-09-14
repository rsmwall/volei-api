class Player < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :gender, presence: true
  validates :category, presence: true
  validates :email, presence: true, uniqueness: true

  def self.ranking
    self.left_joins(:rated_ratings)
        .group(:id)
        .select("players.*, AVG(ratings.score) AS average_score")
        .order("average_score DESC NULLS LAST")
  end
  has_many :rated_ratings, class_name: "Rating", foreign_key: "rated_id"
end
