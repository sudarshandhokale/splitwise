class CreateEventLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :event_logs do |t|
      t.references :event, foreign_key: true
      t.integer :payer_id, index: true, foreign_key: true
      t.integer :payee_id, index: true, foreign_key: true
      t.decimal :amount
      t.boolean :settled

      t.timestamps
    end
  end
end
