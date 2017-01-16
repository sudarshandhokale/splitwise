class EventLog < ApplicationRecord
  belongs_to :event
  belongs_to :payer, class_name: 'User'
  belongs_to :payee, class_name: 'User'
end
