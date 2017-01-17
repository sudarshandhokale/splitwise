class User < ApplicationRecord
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :validatable,
          :omniauthable, :trackable #, :confirmable
  include DeviseTokenAuth::Concerns::User
  validates :name, presence: true, format: { with: /[\w]+([\s]+[\w]+){1}+/ }
  has_many :events
  has_many :user_events
  has_many :events, through: :user_events
  has_many :payers, class_name: 'EventLog', foreign_key: :payee_id
  has_many :payees, class_name: 'EventLog', foreign_key: :payer_id
end
