class UserEvent < ApplicationRecord
  belongs_to :user
  belongs_to :event
  validates :contribution, presence: true
end
