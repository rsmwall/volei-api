class User < ActiveRecord::Base
  # Adiciona segurança de senha (requer gem 'bcrypt')
  has_secure_password 

  # Relacionamentos
  has_many :events # Eventos que ele organiza
  has_many :registrations
  has_many :participating_events, through: :registrations, source: :event
  
  # Social (Auto-relacionamento)
  has_many :sent_friendships, class_name: 'Friendship', foreign_key: 'requester_id'
  has_many :received_friendships, class_name: 'Friendship', foreign_key: 'receiver_id'

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
end