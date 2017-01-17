class Api::V1::UsersController < Api::V1::ApiApplicationController
  def index
    @users = User.all
    render json: success(@users), status: :ok
  end
end
