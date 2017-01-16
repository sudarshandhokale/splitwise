class Api::V1::ApiApplicationController < ApplicationController
  before_action :authenticate_user!

  private

  def authenticate_user!
    unless current_user
      return render json: unauthorize_error, status: 401
    end
  end
end
