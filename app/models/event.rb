class Event < ApplicationRecord
  has_many :event_logs
  has_many :user_events, inverse_of: :event
  has_many :users, through: :user_events
  accepts_nested_attributes_for :user_events
  validates :name, :date, :location, :amount, presence: true
  after_create :distrubte_amount

  private

  def distrubte_amount
    distrubted_amount = amount / user_events.count
    payers = user_events.where('contribution < ?', distrubted_amount)
    payees = user_events.where('contribution > ?', distrubted_amount)
    payers.each do |pr|
      need_pay = distrubted_amount - pr.contribution
      payees.each do |pe|
        break if need_pay.zero?
        owe_amt = pe.contribution - distrubted_amount
        next if owe_amt.zero?
        if need_pay >= owe_amt
          event_logs.create!(payer_id: pr.user_id,
            payee_id: pe.user_id, amount: owe_amt)
          need_pay -= owe_amt
          pe.update(contribution: distrubted_amount)
        else
          event_logs.create!(payer_id: pr.user_id,
            payee_id: pe.user_id, amount: need_pay)
          need_pay = 0
          pe.update(contribution: pe.contribution - need_pay)
        end
      end
      pr.update(contribution: distrubted_amount)
    end
  end
end
