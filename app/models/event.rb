class Event < ActiveRecord::Base
  belongs_to :organizer, class_name: 'User', foreign_key: 'user_id'
  has_many :registrations
  has_many :participants, through: :registrations, source: :user
  
  validates :title, presence: true
  validates :date, presence: true
end