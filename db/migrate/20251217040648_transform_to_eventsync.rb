class TransformToEventsync < ActiveRecord::Migration[7.0]
  def change
    # 1. Transformar Players em Users (Com Autenticação)
    rename_table :players, :users
    add_column :users, :password_digest, :string # Para senha segura
    add_column :users, :role, :string, default: 'participant' # participant ou organizer
    add_column :users, :city, :string
    add_column :users, :photo_url, :string

    # 2. Transformar Matches em Events
    rename_table :matches, :events
    rename_column :events, :organizer_id, :user_id # O dono do evento
    add_column :events, :description, :text
    add_column :events, :price, :decimal, precision: 10, scale: 2
    add_column :events, :event_type, :string, default: 'free' # free ou paid
    add_column :events, :max_attendees, :integer

    # 3. Transformar MatchRequests em Registrations (Inscrições)
    rename_table :match_requests, :registrations
    rename_column :registrations, :match_id, :event_id
    rename_column :registrations, :player_id, :user_id
    add_column :registrations, :checkins_count, :integer, default: 0
    add_column :registrations, :payment_status, :string, default: 'pending'

    # 4. Criar Tabela de Amizades (Social)
    create_table :friendships do |t|
      t.integer :requester_id
      t.integer :receiver_id
      t.string :status, default: 'pending' # pending, accepted, rejected
      t.timestamps
    end

    # 5. Criar Tabela de Mensagens
    create_table :messages do |t|
      t.integer :sender_id
      t.integer :receiver_id
      t.text :content
      t.timestamps
    end
  end
end