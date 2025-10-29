class Rating < ActiveRecord::Base
  belongs_to :rater, class_name: 'Player', foreign_key: 'rater_id'
  belongs_to :rated, class_name: 'Player', foreign_key: 'rated_id'
  belongs_to :match

  validates :rater_id, :rated_id, :match_id, :score, presence: true
  validates :score, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
  validates :rater_id, uniqueness: { scope: [:rated_id, :match_id], message: "já avaliou esse jogador nesta partida." }

  validate :cannot_rate_self

  private
  
  def cannot_rate_self
    if self.rater_id.to_i == self.rated_id.to_i 
      if self.rater_id.to_i > 0 
         errors.add(:rated_id, "não pode ser o mesmo que o avaliado.")
      end
    end
  end
end