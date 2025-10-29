class MatchRequest < ActiveRecord::Base
  belongs_to :player
  belongs_to :match

  validates :player_id, uniqueness: { scope: :match_id, message: 'ja requisitou essa partida' }
  validates :player_id, :match_id, presence: true
end