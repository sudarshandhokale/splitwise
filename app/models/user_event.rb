class UserEvent < ApplicationRecord
  belongs_to :user
  belongs_to :event, inverse_of: :user_events
  validates :contribution, presence: true
end
