class Api::V1::EventsController < Api::V1::ApiApplicationController

  # GET /events
  # GET /events.json
  def index
    @event_logs = EventLog.logs_hash(current_user.id)
    @event_logs.merge!(events: EventLog.events(current_user.id))
    render json: success(@event_logs), status: :ok
  end

  # POST /events
  # POST /events.json
  def create
    @event = Event.new(event_params)
    if @event.save
      render json: success(@event), status: :created
    else
      render json: error(@event), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/1
  # PATCH/PUT /events/1.json
  def update
    @event_logs = EventLog.where(id: params[:ids])
    if @event_logs.update_all(settled: true)
      render json: success(@event_logs), status: :ok
    else
      render json: error(@event_logs), status: :unprocessable_entity
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def event_params
    params.require(:event).permit(:name, :date, :location, :amount,
      user_events_attributes: [:user_id, :event_id, :contribution])
  end
end
