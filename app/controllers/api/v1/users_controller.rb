class Api::V1::UsersController < Api::V1::ApiApplicationController
  def index
    @users = User.where.not(id: current_user.id)
    render json: success(@users), status: :ok
  end
end
