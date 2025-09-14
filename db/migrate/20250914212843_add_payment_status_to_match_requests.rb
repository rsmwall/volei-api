class AddPaymentStatusToMatchRequests < ActiveRecord::Migration[8.0]
  def change
    add_column :match_requests, :payment_status, :string
  end
end
