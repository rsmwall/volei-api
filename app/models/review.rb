class Review < ActiveRecord::Base
  belongs_to :user
  belongs_to :event

  validates :score, presence: true, inclusion: { in: 1..5 }
  validates :comment, presence: true
end