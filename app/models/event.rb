class Event < ApplicationRecord
  has_many :event_logs
  has_many :user_events
  has_many :users, through: :user_events
  accepts_nested_attributes_for :user_events
  validates :name, :date, :location, :amount, presence: true
end
