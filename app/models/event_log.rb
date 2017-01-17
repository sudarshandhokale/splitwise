class EventLog < ApplicationRecord
  belongs_to :event
  belongs_to :payer, class_name: 'User'
  belongs_to :payee, class_name: 'User'
  scope :logs, ->(id) { where('payee_id = ? OR payer_id = ?', id, id) }
  scope :logs_hash, ->(id) { logs(id).group_by(&:event_id) }
  scope :events, ->(id) { logs(id).group_by(&:event).keys.sort_by!{|a| a[:date]}.reverse }

  def as_json(options = {})
    super((options || {}).merge(
      methods: [:payee, :payer]
    ))
  end
end
